from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session
from pydantic import BaseModel, Field, field_validator

from app.database import get_db
from app.models import User, Document

from app.auth import (
    create_access_token,
    hash_password,
    verify_password,
)

from app.security import (
    get_current_user,
    require_role,
)

from pypdf import PdfReader
from pathlib import Path

from app.document_ingestion import ingest_pdf
from app.pdf_search import search_documents
from app.context_builder import build_context
from app.prompt_builder import build_prompt
from app.llm_generator import generate_answer
from app.answer_evaluator import evaluate_answer
import uuid
import hashlib
import chromadb
import logging
import time
import io

MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB
# ===============================
# LOGGING
# ===============================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


# ===============================
# FASTAPI APPLICATION
# ===============================

app = FastAPI(
    title="IntelliDoc AI API",
    description="Document intelligence and RAG API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===============================
# CHROMADB CONNECTION
# ===============================

client = chromadb.PersistentClient(
    path="chroma_db"
)

collection = client.get_collection(
    name="arise_ml_documents_v2"
)


# ===============================
# PDF TEXT EXTRACTION
# ===============================

def extract_text_from_pdf(file_path: str) -> str:

    reader = PdfReader(file_path)

    return "\n".join(
        page.extract_text() or ""
        for page in reader.pages
    )


# ===============================
# REQUEST VALIDATION
# ===============================

class QuestionRequest(BaseModel):

    question: str = Field(
        ...,
        min_length=3,
        max_length=500,
        description="Question about the uploaded document"
    )

    filename: str | None = Field(
        default=None,
        description="Optional PDF filename to search"
    )
    history: list[dict[str, str]] = Field(
        default_factory=list,
        description="Previous conversation messages"
    )


    @field_validator("question")
    @classmethod
    def validate_question(cls, value: str) -> str:

        value = value.strip()

        if not value:
            raise ValueError(
                "Question cannot be empty"
            )

        return value


    @field_validator("filename")
    @classmethod
    def validate_filename(
        cls,
        value: str | None
    ) -> str | None:

        if value is not None:

            value = value.strip()

            if not value:
                return None

        return value

class RegisterRequest(BaseModel):

    email: str = Field(
        ...,
        min_length=5,
        max_length=255
    )

    password: str = Field(
        ...,
        min_length=8,
        max_length=128
    )

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:

        value = value.strip().lower()

        if "@" not in value:
            raise ValueError("Invalid email address")

        return value

# ===============================
# HOME ENDPOINT
# ===============================

@app.get("/")
def home():

    return {
        "message": "IntelliDoc AI API is running"
    }

@app.post("/register")
def register_user(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=409,
            detail="Email is already registered."
        )

    password_hash = hash_password(
        request.password
    )

    user = User(
        email=request.email,
        password_hash=password_hash,
        role="user",
        is_active=True
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User registered successfully.",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at
        }
    }

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        form_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="User account is inactive"
        )

    access_token = create_access_token(
        user_id=user.id,
        email=user.email,
        role=user.role
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
@app.get("/test-admin")
def test_admin(
    current_user: User = Depends(
        require_role("admin")
    )
):
    return {
        "message": "Admin authorization successful",
        "user_id": current_user.id,
        "email": current_user.email,
        "role": current_user.role
    }

@app.get("/users/me")
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active
    }
# ===============================
# DOCUMENTS ENDPOINT
# ===============================

@app.get("/documents")
def get_documents(
    current_user: User = Depends(get_current_user)
):

    try:

        results = collection.get(
            where={
                "user_id": current_user.id
            },
            include=["metadatas"]
        )

        document_names = set()

        for metadata in results["metadatas"]:

            if metadata and metadata.get("filename"):

                document_names.add(
                    metadata["filename"]
                )

        documents = sorted(
            document_names,
            key=str.lower
        )

        return {
            "documents": documents,
            "total_documents": len(documents)
        }

    except Exception:

        logger.exception(
            "Error while retrieving documents"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve documents."
        )


# ===============================
# PDF UPLOAD ENDPOINT
# ===============================

@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="Filename is required."
        )


    if not file.filename.lower().endswith(".pdf"):

        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    safe_filename = Path(file.filename).name

    if not safe_filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    user_directory = Path("data/documents") / f"user_{current_user.id}"
    user_directory.mkdir(parents=True, exist_ok=True)

    stored_filename = f"{uuid.uuid4()}.pdf"
    file_path = user_directory / stored_filename
    try:
        file_data = await file.read()
        

        if not file_data:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty."
            )
        file_hash = hashlib.sha256(file_data).hexdigest()
        existing_document = (
            db.query(Document)
            .filter(
                Document.user_id == current_user.id,
                Document.file_hash == file_hash
            )
            .first()
        )

        if existing_document:
            raise HTTPException(
                status_code=409,
                detail="This document has already been uploaded."
            )

        if len(file_data) > MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=413,
                detail="PDF file is too large. Maximum allowed size is 10 MB."
            )
        try:
            reader = PdfReader(io.BytesIO(file_data), strict=True)

            if reader.is_encrypted:
                raise HTTPException(
                    status_code=400,
                    detail="Encrypted PDFs are not supported."
                )

            if len(reader.pages) == 0:
                raise HTTPException(
                    status_code=400,
                    detail="The PDF contains no pages."
                )

            has_readable_text = any(
                (page.extract_text() or "").strip()
                for page in reader.pages
            )

            if not has_readable_text:
                raise HTTPException(
                    status_code=400,
                    detail="No readable text was found in the PDF."
                )

        except HTTPException:
            raise

        except Exception:
            logger.exception("Uploaded file failed PDF validation")
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is not a valid, readable PDF."
            )

        with open(file_path, "wb") as buffer:
            buffer.write(file_data)

        result = ingest_pdf(
            file_path=file_path,
            document_name=file.filename,
            user_id=current_user.id
        )

        try:
            document = Document(
                filename=safe_filename,
                file_hash=file_hash,
                storage_path=str(file_path),
                user_id=current_user.id
            )

            db.add(document)
            db.commit()
            db.refresh(document)

        except Exception:
            db.rollback()
            logger.exception("Failed to save document metadata")
            raise HTTPException(
                status_code=500,
                detail="Failed to save document information."
            )

        return {
            "message": "PDF uploaded and indexed successfully.",
            "filename": file.filename,
            "pages": result["chunks"],
            "chunks": result["chunks"],
            "collection": result["collection"],
            "total_chunks": result["total_chunks"]
        }


    except HTTPException:
        raise

    except Exception:
        logger.exception("Error while ingesting PDF")
        raise HTTPException(
            status_code=500,
            detail="Failed to process and index the PDF."
        )


# ===============================
# ASK QUESTION ENDPOINT
# ===============================

@app.post("/ask")
def ask_question(
    request: QuestionRequest,
    current_user: User = Depends(get_current_user)
):

    question = request.question

    filename = request.filename

    history = request.history

    start_time = time.perf_counter()


    logger.info(
        "Received question: %s",
        question
    )


    try:

        # ===============================
        # BUILD CONTEXTUAL SEARCH QUERY
        # ===============================

        search_query = question

        if history:

            previous_user_messages = [
                message["content"]
                for message in history
                if message.get("role") == "user"
            ]

            if previous_user_messages:
                search_query = (
                    previous_user_messages[-1]
                    + " "
                    + question
                )

        logger.info(
            "Search query: %s",
            search_query
        )


        search_results = search_documents(

            query=search_query,

            top_k=5,

            filename=filename,

            user_id=current_user.id

        )

        context = build_context(search_results)


        prompt = build_prompt(

            context,

            question,

            history

        )


        answer = generate_answer(
            prompt
        )

        evaluation = evaluate_answer(
            question=question,
            context=context,
            answer=answer
        ) 
        fallback_message = "I could not find the answer in the provided document."

        if fallback_message.lower() in answer.lower():
            sources = []
        else:
            sources = [
                {
                    "filename": result["metadata"].get("filename"),
                    "page": result["metadata"]["page"],
                    "distance": round(result["distance"], 4),
                    "text": result["text"]
                }
                for result in search_results
            ]


        return {

            "question": question,

            "answer": answer,

            "sources": sources,

            "evaluation": evaluation

        }


    except Exception:

        logger.exception(

            "Error while processing question"

        )


        raise HTTPException(

            status_code=500,

            detail=(
                "An internal error occurred "
                "while processing your question."
            )

        )


    finally:

        processing_time = (
            time.perf_counter() - start_time
        )


        logger.info(

            "Request completed in %.2f seconds",

            processing_time

        )