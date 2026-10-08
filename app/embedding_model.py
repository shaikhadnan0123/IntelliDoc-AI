from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

def create_embeddings(texts: list[str], show_progress_bar: bool = False):
    return model.encode(
        texts,
        show_progress_bar=show_progress_bar
    )

if __name__ == "__main__":

    texts = [
        "Machine learning is a branch of artificial intelligence.",
        "Artificial intelligence includes machine learning.",
        "The weather is sunny today."
    ]

    embeddings = create_embeddings(texts)

    similarity_matrix = cosine_similarity(embeddings)
    print(similarity_matrix)