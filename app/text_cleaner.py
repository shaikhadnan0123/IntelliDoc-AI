import re


def clean_text(text: str) -> str:
    # Replace multiple whitespace characters with a single space
    text = re.sub(r"\s+", " ", text)

    # Remove unnecessary spaces at the beginning/end
    text = text.strip()

    return text


if __name__ == "__main__":
    sample_text = """
    MACHINE

    LEARNING

    is

    a

    branch of

    Artificial Intelligence.
    """

    cleaned = clean_text(sample_text)

    print("Original:")
    print(sample_text)

    print("\nCleaned:")
    print(cleaned)