# IntelliDoc-AI

**Intelligent Document Question Answering Platform using Retrieval-Augmented Generation (RAG)**

IntelliDoc-AI is a document intelligence platform that allows authenticated users to upload documents and ask natural-language questions about their content.

Instead of relying only on an LLM's pretrained knowledge, IntelliDoc-AI retrieves relevant document content from a vector database and provides that context to the language model before generating an answer.

The project combines **FastAPI, PostgreSQL, ChromaDB, Sentence Transformers, Groq, Docker, and Python** to implement an end-to-end RAG application with authentication, role-based access control, and document-level isolation.

---

## 1. What IntelliDoc-AI Does

The application follows this general workflow:

```text
User
 │
 ▼
Authenticate
 │
 ▼
Upload Document
 │
 ▼
Extract Text
 │
 ▼
Split into Chunks
 │
 ▼
Generate Embeddings
 │
 ▼
Store Vectors in ChromaDB
 │
 ▼
Ask Question
 │
 ▼
Generate Question Embedding
 │
 ▼
Similarity Search
 │
 ▼
Retrieve Relevant Chunks
 │
 ▼
Build Context
 │
 ▼
Send Context + Question to LLM
 │
 ▼
Generate Grounded Answer
```

This approach helps the application answer questions using information contained in the user's documents rather than relying exclusively on general model knowledge.

---

# 2. Key Features

* User registration and authentication
* Password hashing using Argon2
* JWT-based authentication
* Role-based access control (RBAC)
* Protected API endpoints
* Document upload
* PDF text extraction
* Document chunking
* Semantic embeddings
* Vector similarity search
* ChromaDB vector storage
* PostgreSQL application database
* User/document isolation
* Retrieval-Augmented Generation pipeline
* LLM-based answer generation through Groq
* FastAPI REST API
* Dockerized backend
* CPU-oriented deployment
* Environment-based configuration

---

# 3. RAG Architecture

IntelliDoc-AI implements a Retrieval-Augmented Generation pipeline.

```text
                         IntelliDoc-AI
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
         Document Ingestion            User Question
                │                           │
                ▼                           ▼
          PDF Extraction            Question Embedding
                │                           │
                ▼                           ▼
             Chunking                Similarity Search
                │                           │
                ▼                           ▼
            Embeddings                  Top-K Chunks
                │                           │
                ▼                           │
           ChromaDB ◄───────────────────────┘
                │
                ▼
        Retrieved Context
                │
                ▼
        Prompt Construction
                │
                ▼
             Groq LLM
                │
                ▼
          Grounded Answer
```

---

# 4. RAG Pipeline

## Step 1 — Document Upload

An authenticated user uploads a supported document through the application.

The backend validates the request and passes the document into the ingestion pipeline.

## Step 2 — Text Extraction

For PDF documents, text is extracted using `pypdf`.

```text
PDF
 ↓
Text Extraction
 ↓
Raw Document Text
```

## Step 3 — Chunking

Large documents are divided into smaller overlapping text chunks.

The current application uses a chunking strategy that allows retrieved sections to contain enough surrounding context without sending an entire document to the LLM.

Conceptually:

```text
Document
│
├── Chunk 1
├── Chunk 2
├── Chunk 3
├── ...
└── Chunk N
```

## Step 4 — Embeddings

Each chunk is converted into a numerical vector using a Sentence Transformers embedding model.

The vector represents the semantic meaning of the text.

```text
Text Chunk
    ↓
Embedding Model
    ↓
Vector Representation
```

## Step 5 — Vector Storage

The generated embeddings and associated document information are stored in ChromaDB.

This allows semantic similarity searches to be performed later.

## Step 6 — Question Embedding

When a user asks a question, the question is converted into an embedding using the same embedding model.

```text
User Question
     ↓
Embedding Model
     ↓
Question Vector
```

## Step 7 — Similarity Search

The question vector is compared against stored document vectors.

The most relevant chunks are retrieved using semantic similarity.

```text
Question Vector
      ↓
ChromaDB
      ↓
Top-K Relevant Chunks
```

## Step 8 — Context Construction

The retrieved chunks are combined into a context that is supplied to the language model.

## Step 9 — Prompt Construction

The system builds a prompt containing:

* Retrieved document context
* User question
* Instructions for generating the answer

## Step 10 — LLM Generation

The constructed prompt is sent to the configured Groq model.

The LLM generates an answer based on the retrieved context.

---

# 5. Authentication and RBAC

IntelliDoc-AI contains an authentication layer for protecting application resources.

The backend uses:

* FastAPI
* SQLAlchemy
* PostgreSQL
* JWT authentication
* Argon2 password hashing
* Role-based access control

The authentication flow is conceptually:

```text
Register
   ↓
Password
   ↓
Argon2 Hash
   ↓
PostgreSQL
```

During authentication:

```text
Email + Password
       ↓
Verify Password Hash
       ↓
Create JWT
       ↓
Authenticated API Requests
```

Protected endpoints can validate the JWT before allowing access to application resources.

RBAC provides a foundation for distinguishing between different application roles such as regular users and administrators.

---

# 6. Document Isolation

A key requirement of a multi-user document application is preventing one user from accessing another user's documents.

IntelliDoc-AI therefore associates document/vector information with the authenticated user.

Conceptually:

```text
User A
 ├── Document A1
 ├── Document A2
 └── Document A3

User B
 ├── Document B1
 └── Document B2
```

Retrieval should be performed within the appropriate user/document scope rather than treating every uploaded document as globally accessible.

This provides the foundation for multi-user document isolation.

---

# 7. PostgreSQL

PostgreSQL is used as the relational application database.

It stores application-level information such as user accounts and authentication-related metadata.

The current application uses SQLAlchemy as the database ORM.

Conceptually:

```text
FastAPI
   │
   ▼
SQLAlchemy
   │
   ▼
PostgreSQL
```

PostgreSQL is intentionally separated from the vector database.

---

# 8. ChromaDB

ChromaDB is used as the vector database.

It stores:

* Document chunks
* Embeddings
* Associated metadata

The application can then perform semantic similarity searches over stored document representations.

The architecture separates responsibilities:

```text
PostgreSQL
→ Users / application data

ChromaDB
→ Document embeddings / vector retrieval
```

---

# 9. API

The backend is implemented using FastAPI.

The API provides functionality for areas including:

### Authentication

```text
POST /auth/register
POST /auth/login
```

### Application

Protected routes are used for authenticated application operations such as document processing and RAG interactions.

The exact available endpoints should be verified from the running FastAPI application's `/docs` page before deployment.

FastAPI automatically provides interactive API documentation through:

```text
/docs
```

and OpenAPI schema support.

---

# 10. Frontend

The frontend provides a modern, responsive user-facing interface for interacting with IntelliDoc-AI, built with **React 18**, **Vite**, and **Lucide Icons** with a custom dark glassmorphic design system.

### Key UI Components:
* **`Navbar`**: System branding, authentication status, user profile dropdown, and modal triggers.
* **`Sidebar`**: Document listing, document selection, filtering, and document management.
* **`ChatWorkspace`**: Interactive RAG Q&A interface with real-time response rendering, conversation history, and evaluation cards.
* **`SourcesPanel`**: Side panel displaying retrieved context chunks, similarity relevance scores, and metadata breakdown.
* **`EvaluationCard`**: RAG metric dashboard showing Faithfulness, Context Precision, and Relevance scores.
* **`FileUploadModal`**: Drag-and-drop document uploader with PDF processing status updates.
* **`AuthModal`**: Seamless Login and Registration modal interface with token persistence.
* **`AdminModal`**: Admin management dashboard for role monitoring and system test endpoints.

The primary user workflow is:

```text
Login / Register
  ↓
Authenticated Session (JWT)
  ↓
Upload PDF Document
  ↓
Ingest & Vectorize
  ↓
Ask Question (scoped to active document or all docs)
  ↓
View Context-Grounded Answer + Retrieved Sources & RAG Metrics
```

The frontend communicates asynchronously with the FastAPI backend through HTTP REST API requests.

---

# 11. Technology Stack

| Component        | Technology            |
| ---------------- | --------------------- |
| Frontend         | React 18 + Vite       |
| UI Styling       | Vanilla CSS (Glassmorphism design system) |
| UI Icons         | Lucide React          |
| Backend          | FastAPI               |
| API Server       | Uvicorn               |
| Language         | Python 3.12 / JavaScript (ES6+) |
| Database         | PostgreSQL            |
| ORM              | SQLAlchemy            |
| Vector Database  | ChromaDB              |
| Embeddings       | Sentence Transformers |
| LLM              | Groq (Llama 3 / Mixtral) |
| PDF Processing   | pypdf                 |
| Authentication   | JWT                   |
| Password Hashing | Argon2                |
| Validation       | Pydantic              |
| Containerization | Docker                |
| Configuration    | python-dotenv         |

---

# 12. Environment Variables

Sensitive configuration should be stored in environment variables rather than committed to Git.

Example:

```env
DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/intellidoc

JWT_SECRET_KEY=your-secret-key

GROQ_API_KEY=your-groq-api-key
```

The actual values should never be committed to the repository.

A local `.env` file can be used during development.

Example:

```text
.env
```

should remain excluded from Git.

---

# 13. Local Development

## Prerequisites

Install:

* Python 3.12+
* Node.js (v18+) & npm
* PostgreSQL
* Docker Desktop (optional)
* Git

## 1. Backend Setup

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```cmd
.venv\Scripts\activate
```

Activate it on macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements-cpu.txt
```

Run the FastAPI application:

```bash
python -m uvicorn app.main:app --reload
```

The API will be available at:
* API Server: `http://127.0.0.1:8000`
* Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`

## 2. Frontend Setup

In a separate terminal, navigate to the `frontend` directory:

```bash
cd frontend
```

Install Node dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The React frontend will be available at:
* Development UI: `http://localhost:5173` (or port indicated by Vite)

---

# 14. Docker

IntelliDoc-AI includes a Docker-based deployment configuration.

The application uses a CPU-oriented Python environment and installs the required CPU version of PyTorch separately.

The dependency installation is intentionally separated so that the Docker build does not unnecessarily pull the standard PyTorch package.

Build the image:

```bash
docker build -t intellidoc-ai:cpu .
```

Run the container:

```bash
docker run --name intellidoc-test -p 8000:8000 intellidoc-ai:cpu
```

The application runs inside the container using Uvicorn.

Conceptually:

```text
Host Machine
     │
     │ Port 8000
     ▼
┌──────────────────────┐
│ Docker Container     │
│                      │
│ FastAPI              │
│ Uvicorn              │
│ RAG Pipeline         │
│ Embedding Model      │
└──────────────────────┘
```

---

# 15. Project Structure

The project is organized into separate backend and frontend modules for API handling, authentication, document ingestion, vector retrieval, generation, and user interface.

```text
IntelliDoc-AI/
│
├── app/                        # FastAPI Backend Application
│   ├── main.py                 # Core API endpoints & router setup
│   ├── auth.py                 # JWT token generation & verification
│   ├── security.py             # Password hashing (Argon2) & RBAC dependencies
│   ├── database.py             # SQLAlchemy session & DB connection
│   ├── models.py               # ORM database models (User, Document)
│   ├── document_ingestion.py   # PDF Ingestion coordinator
│   ├── pdf_processor.py        # PDF text extraction
│   ├── document_chunker.py     # Text chunking logic
│   ├── pdf_embeddings.py       # Sentence Transformer embedding pipeline
│   ├── vector_store.py         # ChromaDB persistence & similarity search
│   ├── pdf_search.py           # Multi-document vector search integration
│   ├── context_builder.py      # Context window assembly for LLM
│   ├── prompt_builder.py       # Prompt engineering & system message generation
│   ├── llm_generator.py        # Groq LLM API client integration
│   └── answer_evaluator.py     # Faithfulness & relevance evaluation metrics
│
├── frontend/                   # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/         # Modular UI Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatWorkspace.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── SourcesPanel.jsx
│   │   │   ├── EvaluationCard.jsx
│   │   │   ├── FileUploadModal.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   └── AdminModal.jsx
│   │   ├── services/
│   │   │   └── api.js          # Axios / Fetch backend service layer
│   │   ├── App.jsx             # Main Application layout & state
│   │   ├── main.jsx            # React root entry point
│   │   └── index.css           # Global glassmorphic design system styles
│   ├── package.json
│   └── vite.config.js
│
├── chroma_db/                  # Local ChromaDB vector store persistent storage
├── scripts/                    # Utility & admin automation scripts
├── create_admin.py             # Script to create initial admin user
├── create_tables.py            # Database schema migration script
├── ocr_search.py               # OCR helper search utility
├── requirements-cpu.txt        # Backend dependencies (CPU-optimized)
├── Dockerfile                  # Containerization file
├── .dockerignore
├── .gitignore
├── .env.example
└── README.md                   # System documentation
```

---

# 16. Security Considerations

Security is an important part of the application because IntelliDoc-AI processes user accounts and uploaded documents.

### Password Security

Passwords should never be stored as plaintext.

The application uses Argon2 password hashing.

### Authentication

Protected API operations require authentication.

### Authorization

RBAC can restrict operations according to the authenticated user's role.

### Secret Management

API keys, database credentials, and JWT secrets must be supplied through environment variables.

They should never be committed to Git.

### Document Isolation

Document retrieval should respect the authenticated user's ownership/scope.

### Input Validation

FastAPI and Pydantic provide request validation before application logic processes incoming data.

### Production Configuration

For production deployment:

* Disable development reload mode.
* Use strong secrets.
* Restrict CORS origins.
* Use HTTPS.
* Protect PostgreSQL credentials.
* Do not expose database ports unnecessarily.
* Use persistent storage for required application data.
* Apply appropriate authentication and authorization checks to every protected resource.

---

# 17. Deployment Architecture

A production deployment can be structured as:

```text
                         Internet
                            │
                            ▼
                    ┌───────────────┐
                    │ Reverse Proxy │
                    │    / HTTPS    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   FastAPI     │
                    │   Container   │
                    └───────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
        PostgreSQL      ChromaDB       Groq API
        Application     Vector Store   LLM
        Data            Embeddings
```

The application can be deployed using Docker-compatible infrastructure.

The database and vector storage should use persistent storage rather than ephemeral container filesystems when deployed to production.

---

# 18. Example RAG Workflow

Suppose a user uploads a machine-learning document and asks:

> What type of learning uses labeled data?

The system performs:

```text
1. User authenticates
        ↓
2. Document is uploaded
        ↓
3. PDF text is extracted
        ↓
4. Text is divided into chunks
        ↓
5. Chunks are converted into embeddings
        ↓
6. Embeddings are stored in ChromaDB
        ↓
7. User asks the question
        ↓
8. Question is converted into an embedding
        ↓
9. ChromaDB searches for similar chunks
        ↓
10. Relevant chunks are retrieved
        ↓
11. Retrieved chunks become LLM context
        ↓
12. Prompt is sent to Groq
        ↓
13. LLM generates a context-grounded answer
```

The important principle is:

```text
Retrieve relevant information first
                ↓
Generate answer using retrieved information
```

rather than:

```text
Question
   ↓
LLM guesses from pretrained knowledge
```

---

# 19. Why RAG?

A language model's pretrained knowledge is not automatically aware of private documents uploaded by an application user.

RAG provides a mechanism for connecting an LLM with external knowledge.

Advantages include:

* Working with private documents
* Reducing dependence on model memory
* Providing relevant context to the LLM
* Updating knowledge by changing the document collection
* Supporting domain-specific question answering

RAG does not guarantee that every generated answer is correct, so retrieval quality, prompt design, model behavior, and evaluation remain important.

---

# 20. Current Project Status

The project currently includes the core components required for an end-to-end RAG backend:

* FastAPI application
* PostgreSQL integration
* User authentication
* Password hashing
* RBAC foundation
* PDF ingestion
* Text chunking
* Sentence Transformer embeddings
* ChromaDB vector storage
* Semantic retrieval
* Context construction
* Prompt construction
* LLM generation integration
* Answer evaluation components
* Docker CPU environment

The Docker image has been tested successfully with the current CPU dependency configuration.

---

# 21. Future Improvements

Potential future improvements include:

* Improved document metadata management
* More advanced retrieval filtering
* Hybrid keyword + semantic retrieval
* Reranking retrieved chunks
* Citation/source display in answers
* Streaming LLM responses
* Conversation history
* Multiple document formats
* Background document processing
* Improved evaluation metrics
* Rate limiting
* Production monitoring
* Automated tests
* CI/CD
* Persistent production vector storage
* Improved frontend UX

---

# 22. Learning Objectives

This project was designed not only as an application but also as a practical implementation of modern AI engineering concepts.

Key concepts demonstrated include:

* REST APIs
* Authentication
* Authorization
* SQL databases
* ORM usage
* Password hashing
* JWT
* Document processing
* Text chunking
* Embeddings
* Vector databases
* Semantic similarity
* Retrieval-Augmented Generation
* Prompt engineering
* LLM integration
* Docker
* Environment-based configuration
* Multi-user data isolation

---

# 23. License

This project is intended for educational, portfolio, and demonstration purposes.
