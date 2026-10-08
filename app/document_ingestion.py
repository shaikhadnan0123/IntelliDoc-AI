from app.document_chunker import chunk_pdf
from app.embedding_model import create_embeddings
from app.pdf_vector_store import add_documents_to_collection


def ingest_pdf(
    file_path: str,
    document_name: str,
    user_id: int
):
    # 1. Extract and create chunks
    chunks = chunk_pdf(file_path)

    if not chunks:
        raise ValueError("No readable text found in the PDF.")

    print("Total chunks:", len(chunks))

    # 2. Extract chunk text
    texts = [
        chunk["text"]
        for chunk in chunks
    ]

    # 3. Generate embeddings
    embeddings = create_embeddings(
        texts,
        show_progress_bar=True
    )

    # 4. Prepare metadata
    metadatas = [
        {
            "page": chunk["page"],
            "filename": document_name,
            "chunk_index": index,
            "user_id": user_id
        }
        for index, chunk in enumerate(chunks)
    ]

    # 5. Store in shared ChromaDB collection
    result = add_documents_to_collection(
        documents=texts,
        embeddings=embeddings,
        metadatas=metadatas
    )

    return {
        "document_name": document_name,
        "chunks": len(chunks),
        "collection": result["collection"],
        "total_chunks": result["total_chunks"]
    }
