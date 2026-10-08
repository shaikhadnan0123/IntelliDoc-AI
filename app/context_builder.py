
from app.pdf_search import search_documents


def build_context(search_results):
    context_parts = []

    for i, result in enumerate(search_results, start=1):
        page = result["metadata"]["page"]
        text = result["text"]

        context_parts.append(
            f"""
SOURCE {i}
PAGE: {page}
CONTENT:
{text}
END SOURCE {i}
"""
        )

    return "\n".join(context_parts)



if __name__ == "__main__":

    query = "What is supervised learning?"

    search_results = search_documents(
        query,
        top_k=3
    )

    context = build_context(search_results)

    print("\nGenerated Context:\n")
    print(context)