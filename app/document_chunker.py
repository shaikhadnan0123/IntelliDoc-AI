from pathlib import Path
from app.pdf_processor import extract_pages_from_pdf
from app.text_cleaner import clean_text

def create_chunks(
    text: str,
    chunk_size: int = 100,
    overlap: int = 20
):
    words = text.split()
    chunks = []

    if overlap >= chunk_size:
        raise ValueError("Overlap must be smaller than chunk size")

    step = chunk_size - overlap

    for start in range(0, len(words), step):

        end = min(start + chunk_size, len(words))

        chunk_words = words[start:end]
        chunk = " ".join(chunk_words).strip()

        if chunk:
            chunks.append(chunk)

        if end >= len(words):
            break

    return chunks
def chunk_pdf(file_path: str):
    pages = extract_pages_from_pdf(file_path)

    all_chunks = []

    filename = Path(file_path).name

    for page in pages:
        cleaned_text = clean_text(page["text"])

        page_chunks = create_chunks(
            cleaned_text,
            chunk_size=500,
            overlap=50
        )

        for chunk in page_chunks:
            all_chunks.append({
                "text": chunk,
                "page": page["page"],
                "filename": filename
            })

    return all_chunks


if __name__ == "__main__":

    # Step 1: Test chunking with sample text
    test_text = "Machine learning is useful. " * 100

    test_chunks = create_chunks(test_text)

    print("Test chunks:", len(test_chunks))

    for i, chunk in enumerate(test_chunks[:3]):
        print(f"\nChunk {i + 1}:")
        print(chunk)

    # Step 2: Process the real PDF
    file_path = r"C:\Users\adnan\OneDrive\Desktop\IntelliDoc-AI\data\documents\MACHINE LEARNING - ARISE NOTES.docx.pdf"

    chunks = chunk_pdf(file_path)

    print("\nTotal PDF chunks:", len(chunks))