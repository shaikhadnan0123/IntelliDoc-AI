
import hashlib

import chromadb


# Connect to persistent ChromaDB
client = chromadb.PersistentClient(
    path="chroma_db"
)

collection = client.get_or_create_collection(
    name="arise_ml_documents_v2"
)


def create_chunk_id(
    document_name: str,
    chunk_index: int
) -> str:
    """
    Create a unique ID for each document chunk.
    """

    document_hash = hashlib.md5(
        document_name.encode("utf-8")
    ).hexdigest()[:10]

    return f"{document_hash}_chunk_{chunk_index:04d}"


def add_documents_to_collection(
    documents: list[str],
    embeddings,
    metadatas: list[dict]
):
    """
    Add document chunks, embeddings, and metadata
    to the shared ChromaDB collection.
    """

    ids = [
        create_chunk_id(
            metadata["filename"],
            index
        )
        for index, metadata in enumerate(metadatas)
    ]

    collection.upsert(
        ids=ids,
        documents=documents,
        embeddings=embeddings.tolist(),
        metadatas=metadatas
    )

    print("Documents stored successfully.")
    print("Collection:", collection.name)
    print("Total stored documents:", collection.count())

    return {
        "collection": collection.name,
        "stored_chunks": len(documents),
        "total_chunks": collection.count()
    }