from document_chunker import chunk_pdf
from embedding_model import create_embeddings


if __name__ == "__main__":

    file_path = r"C:\Users\adnan\OneDrive\Desktop\IntelliDoc-AI\data\documents\MACHINE LEARNING - ARISE NOTES.docx.pdf"

    # Step 1: Create chunks from the PDF
    chunks = chunk_pdf(file_path)

    print("Total chunks:", len(chunks))

    # Step 2: Extract text from chunks
    texts = [chunk["text"] for chunk in chunks]

    # Step 3: Generate embeddings
    embeddings = create_embeddings(
        texts,
        show_progress_bar=True
    )

    print("\nEmbedding generation complete.")

    print("Number of embeddings:", len(embeddings))

    print("Embedding dimension:", embeddings.shape[1])

    print("First embedding (first 10 values):")
    print(embeddings[0][:10])