def create_chunks(text: str, chunk_size: int = 500, overlap: int = 50):
    chunks = []

    start = 0

    while start < len(text):
        end = start + chunk_size

        chunk = text[start:end]

        chunks.append(chunk)

        start += chunk_size - overlap

    return chunks

if __name__ == "__main__":
    text = """
    Machine learning is a branch of artificial intelligence.
    Supervised learning uses labeled data.
    Regression predicts continuous values.
    Classification predicts categories.
    """

    chunks = create_chunks(text, chunk_size=100, overlap=20)

    for i, chunk in enumerate(chunks):
        print(f"\n--- Chunk {i + 1} ---")
        print(chunk)