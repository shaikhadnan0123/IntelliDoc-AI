
import fitz
import pytesseract
from PIL import Image
from io import BytesIO

PDF_PATH = "data/documents/MACHINE LEARNING - ARISE NOTES.docx.pdf"

# Update this path if Tesseract was installed elsewhere
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

search_terms = [
    "binary search",
    "binary searching",
    "search algorithm"
]

pdf = fitz.open(PDF_PATH)

matches = []

for page_index in range(100):
    page = pdf[page_index]

    # Render page as an image
    pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2))

    image = Image.open(BytesIO(pixmap.tobytes("png")))

    # OCR the page image
    text = pytesseract.image_to_string(image)

    text_lower = text.lower()

    if any(term in text_lower for term in search_terms):
        matches.append((page_index + 1, text))

        print("\n" + "=" * 70)
        print(f"MATCH FOUND ON PAGE {page_index + 1}")
        print("=" * 70)
        print(text[:3000])

print("\n" + "=" * 70)
print(f"Total matching pages: {len(matches)}")
print("=" * 70)

for page_number, _ in matches:
    print(f"Page {page_number}")