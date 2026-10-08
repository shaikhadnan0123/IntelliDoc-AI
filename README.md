# IntelliDoc-AI

### Intelligent Document Question Answering with Retrieval-Augmented Generation

**IntelliDoc-AI** is a full-stack document intelligence platform that allows authenticated users to upload PDF documents and ask natural-language questions about their content.

Instead of asking an LLM to answer from its pretrained knowledge alone, IntelliDoc-AI retrieves relevant information from the user's documents and supplies that context to the LLM before generating an answer.

The project demonstrates an end-to-end **RAG architecture** combined with **authentication, RBAC, PostgreSQL, vector search, document processing, LLM integration, and Docker-based deployment**.

---

## 🚀 Why IntelliDoc-AI?

Traditional LLM applications can struggle when users need answers from:

* Private documents
* Company knowledge bases
* Technical documentation
* Research papers
* Internal reports
* Large PDF collections

IntelliDoc-AI addresses this by connecting an LLM to an external document knowledge base through **Retrieval-Augmented Generation (RAG)**.

```text
User Question
      │
      ▼
Question Embedding
      │
      ▼
Semantic Retrieval
      │
      ▼
Relevant Document Chunks
      │
      ▼
Context + Question
      │
      ▼
LLM
      │
      ▼
Grounded Answer
```

---

# ✨ Key Features

### 🔐 Authentication & Security

* User registration and login
* JWT-based authentication
* Argon2 password hashing
* Role-based access control (RBAC)
* Protected API endpoints
* Environment-based secret management

### 📄 Document Intelligence

* PDF document upload
* PDF text extraction
* Text cleaning and preprocessing
* Configurable text chunking
* Overlapping chunks for context preservation

### 🧠 RAG Pipeline

* Sentence Transformer embeddings
* ChromaDB vector storage
* Semantic similarity search
* Top-K document retrieval
* Context construction
* Prompt construction
* LLM-powered answer generation

### 🗄️ Data Layer

* PostgreSQL for application data
* SQLAlchemy ORM
* ChromaDB for vector retrieval
* User/document ownership isolation

### ⚙️ Engineering

* FastAPI REST API
* Interactive OpenAPI documentation
* Dockerized backend
* CPU-oriented dependency configuration
* Environment-based configuration
* Modular Python architecture

### 🖥️ Frontend

* React/Vite interface
* Authentication workflow
* Document upload
* RAG chat workspace
* Retrieved-source display
* Answer evaluation interface
* Admin functionality

---

# 🏗️ System Architecture

```text
                         IntelliDoc-AI
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
        Document Ingestion            User Question
                │                           │
                ▼                           ▼
          PDF Extraction             Query Embedding
                │                           │
                ▼                           ▼
             Chunking                 Similarity Search
                │                           │
                ▼                           ▼
           Embeddings                    Top-K
                │                           │
                ▼                           │
            ChromaDB ◄─────────────────────┘
                │
                ▼
       Retrieved Document Context
                │
                ▼
        Prompt Construction
                │
                ▼
             Groq LLM
                │
                ▼
         Grounded Response
                │
                ▼
       Answer + Retrieved Sources
```

---

# 🧠 RAG Pipeline

## 1. Document Ingestion

An authenticated user uploads a PDF.

```text
PDF
 ↓
Validation
 ↓
Text Extraction
```

PDF text is extracted using `pypdf`.

---

## 2. Text Chunking

Large documents are divided into smaller overlapping chunks.

```text
Document
│
├── Chunk 1
├── Chunk 2
├── Chunk 3
├── ...
└── Chunk N
```

Chunking allows the retrieval system to search smaller semantic units instead of processing the entire document for every question.

---

## 3. Embedding Generation

Each chunk is converted into a numerical vector using a Sentence Transformer model.

```text
Text Chunk
    │
    ▼
Sentence Transformer
    │
    ▼
Embedding Vector
```

The embedding represents the semantic characteristics of the text.

---

## 4. Vector Storage

Embeddings, document chunks, and metadata are stored in **ChromaDB**.

This creates a searchable vector representation of the uploaded documents.

---

## 5. Question Embedding

When the user asks a question, the same embedding model converts the question into a vector.

```text
User Question
     │
     ▼
Embedding Model
     │
     ▼
Question Vector
```

---

## 6. Semantic Retrieval

The question vector is compared with stored document vectors.

The system retrieves the most semantically relevant chunks.

```text
Question Vector
      │
      ▼
   ChromaDB
      │
      ▼
Top-K Relevant Chunks
```

---

## 7. Context Construction

The retrieved chunks are combined into a context window.

The application then constructs a prompt containing:

```text
Retrieved Context
       +
User Question
       +
System Instructions
```

---

## 8. LLM Generation

The constructed prompt is sent to the configured **Groq LLM**.

The model generates an answer using the retrieved document context.

The fundamental RAG principle is:

```text
Retrieve → Contextualize → Generate
```

rather than:

```text
Question → LLM → Uncontrolled Answer
```

---

# 🔐 Authentication & Authorization

IntelliDoc-AI uses a dedicated authentication layer to protect application resources.

### Authentication Stack

```text
FastAPI
   │
   ├── JWT Authentication
   │
   ├── Argon2 Password Hashing
   │
   └── PostgreSQL
```

### Registration

```text
Email + Password
       │
       ▼
Argon2 Hash
       │
       ▼
PostgreSQL
```

### Login

```text
Email + Password
       │
       ▼
Password Verification
       │
       ▼
JWT Token
       │
       ▼
Authenticated API Requests
```

RBAC provides role-based authorization for operations available to different user types.

---

# 🔒 Multi-User Document Isolation

A document intelligence platform must prevent users from retrieving documents belonging to other users.

IntelliDoc-AI associates document/vector metadata with the authenticated user's scope.

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

Retrieval operations are designed to respect the authenticated user's document scope rather than exposing a global document collection.

This provides the foundation for secure multi-user RAG.

---

# 🗄️ Data Architecture

IntelliDoc-AI separates relational application data from vector retrieval data.

```text
                  IntelliDoc-AI
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
     PostgreSQL                 ChromaDB
          │                         │
          ▼                         ▼
 Users / Roles              Chunks / Embeddings
 Application Data           Vector Metadata
```

### PostgreSQL

Used for structured application data such as:

* Users
* Roles
* Authentication metadata
* Document/application records

### ChromaDB

Used for:

* Document chunks
* Embeddings
* Vector metadata
* Semantic similarity retrieval

---

# 🌐 API

The backend is built with **FastAPI**.

Authentication includes endpoints such as:

```http
POST /auth/register
POST /auth/login
```

The application also exposes protected routes for document processing and RAG operations.

FastAPI automatically provides interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

and an OpenAPI schema.

---

# 🖥️ Frontend

The frontend provides a user interface for the complete document-question-answering workflow.

```text
Login
  │
  ▼
Authenticated Session
  │
  ▼
Upload PDF
  │
  ▼
Document Processing
  │
  ▼
Ask Question
  │
  ▼
Retrieve Context
  │
  ▼
View Answer + Sources
```

The frontend communicates with the FastAPI backend through HTTP API requests.

---

# 🛠️ Technology Stack

| Layer               | Technology            |
| ------------------- | --------------------- |
| Frontend            | React / Vite          |
| Backend             | FastAPI               |
| API Server          | Uvicorn               |
| Language            | Python                |
| Relational Database | PostgreSQL            |
| ORM                 | SQLAlchemy            |
| Vector Database     | ChromaDB              |
| Embeddings          | Sentence Transformers |
| LLM                 | Groq                  |
| PDF Processing      | pypdf                 |
| Authentication      | JWT                   |
| Password Hashing    | Argon2                |
| Validation          | Pydantic              |
| Containerization    | Docker                |
| Configuration       | python-dotenv         |

---

# 📁 Project Structure

```text
IntelliDoc-AI/
│
├── app/
│   ├── main.py
│   ├── auth.py
│   ├── security.py
│   ├── database.py
│   ├── models.py
│   │
│   ├── document_ingestion.py
│   ├── document_chunker.py
│   ├── chunker.py
│   ├── pdf_processor.py
│   ├── pdf_embeddings.py
│   ├── embedding_model.py
│   │
│   ├── pdf_search.py
│   ├── vector_store.py
│   ├── pdf_vector_store.py
│   ├── context_builder.py
│   ├── prompt_builder.py
│   ├── llm_generator.py
│   └── answer_evaluator.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── scripts/
│   ├── clean_duplicates.py
│   └── inspect_duplicates.py
│
├── create_admin.py
├── create_tables.py
├── ocr_search.py
│
├── Dockerfile
├── .dockerignore
├── .gitignore
├── .env.example
├── requirements-cpu.txt
└── README.md
```

---

# ⚙️ Local Setup

## Prerequisites

Install:

* Python 3.12
* PostgreSQL
* Docker Desktop
* Git
* Node.js / npm

### 1. Clone the repository

```bash
git clone https://github.com/shaikhadnan0123/IntelliDoc-AI.git
cd IntelliDoc-AI
```

### 2. Create a Python environment

```bash
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

### 3. Install Python dependencies

```bash
pip install -r requirements-cpu.txt
```

### 4. Configure environment variables

Create a local `.env` file based on:

```text
.env.example
```

Example:

```env
DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/intellidoc

JWT_SECRET_KEY=your-secret-key

GROQ_API_KEY=your-groq-api-key
```

**Never commit the real `.env` file or API keys to Git.**

### 5. Start the API

```bash
python -m uvicorn app.main:app --reload
```

API:

```text
http://127.0.0.1:8000
```

Swagger/OpenAPI:

```text
http://127.0.0.1:8000/docs
```

---

# 🐳 Docker

IntelliDoc-AI includes a CPU-oriented Docker configuration.

Build the image:

```bash
docker build -t intellidoc-ai:cpu .
```

Run the container:

```bash
docker run --name intellidoc-test -p 8000:8000 intellidoc-ai:cpu
```

Architecture:

```text
Host
 │
 │ Port 8000
 ▼
┌─────────────────────────┐
│ IntelliDoc-AI Container  │
│                         │
│ FastAPI                 │
│ RAG Pipeline            │
│ Embedding Model         │
│ Uvicorn                 │
└─────────────────────────┘
```

The current Docker configuration is designed for CPU-based execution and separates CPU PyTorch installation from the remaining Python dependencies.

---

# 🔑 Environment Variables

The project uses environment variables for sensitive configuration.

```env
DATABASE_URL=
JWT_SECRET_KEY=
GROQ_API_KEY=
```

The following files are intentionally excluded from Git:

```text
.env
.venv/
frontend/node_modules/
frontend/dist/
chroma_db/
```

Never commit:

* API keys
* Database passwords
* JWT secrets
* Personal credentials
* Uploaded private documents

---

# 🧪 Example RAG Query

Suppose a user uploads a machine-learning document and asks:

> **What type of learning uses labeled data?**

The application performs:

```text
1. Authenticate User
        ↓
2. Process Uploaded PDF
        ↓
3. Extract Text
        ↓
4. Split Text into Chunks
        ↓
5. Generate Chunk Embeddings
        ↓
6. Store Embeddings in ChromaDB
        ↓
7. Embed User Question
        ↓
8. Perform Semantic Search
        ↓
9. Retrieve Relevant Chunks
        ↓
10. Build Context
        ↓
11. Construct Prompt
        ↓
12. Send Context + Question to Groq
        ↓
13. Generate Grounded Answer
```

This allows the application to answer questions based on the uploaded document rather than relying exclusively on pretrained model knowledge.

---

# 🔐 Security Considerations

Security is considered at multiple layers.

### Password Security

Passwords are hashed using **Argon2** rather than stored as plaintext.

### Authentication

JWT authentication protects authenticated application operations.

### Authorization

RBAC provides role-based access control.

### Secret Management

Secrets are supplied through environment variables.

### Document Isolation

Document retrieval is scoped according to authenticated user ownership.

### Input Validation

FastAPI and Pydantic validate incoming API requests.

### Production Hardening

For production deployment:

* Disable development reload
* Use strong JWT secrets
* Restrict CORS origins
* Use HTTPS
* Secure PostgreSQL credentials
* Use persistent database/vector storage
* Apply authorization checks to protected resources
* Add rate limiting
* Add application logging and monitoring

---

# 📊 Current Status

### Implemented

* [x] FastAPI backend
* [x] React/Vite frontend
* [x] PostgreSQL integration
* [x] SQLAlchemy ORM
* [x] User authentication
* [x] Argon2 password hashing
* [x] JWT authentication
* [x] RBAC foundation
* [x] PDF ingestion
* [x] Text extraction
* [x] Text chunking
* [x] Sentence Transformer embeddings
* [x] ChromaDB vector storage
* [x] Semantic retrieval
* [x] Context construction
* [x] Prompt construction
* [x] Groq LLM integration
* [x] Answer evaluation components
* [x] User/document isolation
* [x] Docker CPU configuration

---

# 🚧 Future Improvements

Planned improvements include:

* [ ] Hybrid keyword + semantic retrieval
* [ ] Retrieval reranking
* [ ] Improved citation/source handling
* [ ] Streaming LLM responses
* [ ] Conversation history
* [ ] Multiple document formats
* [ ] Background document processing
* [ ] Automated evaluation benchmarks
* [ ] Rate limiting
* [ ] Automated tests
* [ ] CI/CD pipeline
* [ ] Production monitoring
* [ ] Persistent production vector storage
* [ ] Improved frontend UX

---

# 🎯 Engineering Concepts Demonstrated

This project brings together several practical AI/software engineering concepts:

### AI / GenAI

* Retrieval-Augmented Generation
* Text embeddings
* Vector similarity search
* Semantic retrieval
* Prompt engineering
* LLM integration
* Context construction
* RAG evaluation

### Backend

* REST API development
* FastAPI
* SQLAlchemy
* PostgreSQL
* JWT authentication
* RBAC
* Password hashing
* Request validation

### Data / Retrieval

* PDF processing
* Text preprocessing
* Chunking strategies
* Vector databases
* Metadata filtering
* Top-K retrieval

### DevOps

* Docker
* CPU-oriented dependency management
* Environment-based configuration
* Git/GitHub

---

# 💡 Key Learning

The main engineering lesson from IntelliDoc-AI is that building an LLM application is not only about calling an LLM API.

A reliable RAG system requires a complete pipeline:

```text
Data Quality
     ↓
Document Processing
     ↓
Chunking
     ↓
Embeddings
     ↓
Vector Storage
     ↓
Retrieval Quality
     ↓
Context Construction
     ↓
Prompt Design
     ↓
LLM Generation
     ↓
Evaluation
```

The quality of the final answer depends heavily on the quality of the information retrieved and supplied to the model.

---

# 👨‍💻 Author

**Shaikh Adnan**

B.Tech — Artificial Intelligence & Machine Learning

Interested in:

* Machine Learning
* Generative AI
* RAG Systems
* Data Science
* AI Engineering

---

# 📄 License

This project is intended for educational, portfolio, and demonstration purposes.
