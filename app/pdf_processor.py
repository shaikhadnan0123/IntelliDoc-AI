from pypdf import PdfReader


def extract_pages_from_pdf(file_path: str):
    reader = PdfReader(file_path)

    pages = []

    for page_number, page in enumerate(reader.pages, start=1):
        page_text = page.extract_text()

        if page_text:
            pages.append({
                "page": page_number,
                "text": page_text
            })

    return pages


if __name__ == "__main__":
    file_path = r"C:\Users\adnan\OneDrive\Desktop\IntelliDoc-AI\data\documents\MACHINE LEARNING - ARISE NOTES.docx.pdf"

    pages = extract_pages_from_pdf(file_path)

    print("Number of pages:", len(pages))

    for page in pages[:3]:
        print("\n==============================")
        print("PAGE:", page["page"])
        print("==============================")
        print(page["text"][:1000])