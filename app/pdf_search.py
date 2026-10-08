import time
import re
import chromadb

from app.embedding_model import create_embeddings


# ==========================================
# CHROMADB CONNECTION
# ==========================================

client = chromadb.PersistentClient(
    path="chroma_db"
)

collection = client.get_collection(
    name="arise_ml_documents_v2"
)


# ==========================================
# DOCUMENT SEARCH
# ==========================================

def search_documents(
    query: str,
    top_k: int = 5,
    filename: str | None = None,
    user_id: int | None = None
):

    # --------------------------------------
    # 1. Create query embedding
    # --------------------------------------

    embedding_start = time.perf_counter()

    query_embedding = create_embeddings([query])

    embedding_time = time.perf_counter() - embedding_start

    print(f"Embedding time: {embedding_time:.4f} seconds")


    # --------------------------------------
    # 2. Build Chroma query
    # --------------------------------------

    collection_count = collection.count()

    if collection_count == 0:
        print("ChromaDB collection is empty.")
        return []

    query_parameters = {
        "query_embeddings": query_embedding.tolist(),
        "n_results": min(30, collection_count)
    }

    if user_id is not None and filename:
        query_parameters["where"] = {
            "$and": [
                {"user_id": user_id},
                {"filename": filename}
            ]
        }

    elif user_id is not None:
        query_parameters["where"] = {
            "user_id": user_id
        }

    elif filename:
        query_parameters["where"] = {
            "filename": filename
        }


    # --------------------------------------
    # 3. Semantic search
    # --------------------------------------

    results = collection.query(
        **query_parameters
    )


    # --------------------------------------
    # 4. Safety check
    # --------------------------------------

    if not results.get("documents"):

        print("No documents returned from ChromaDB.")

        return []


    documents = results["documents"][0]
    distances = results["distances"][0]
    metadatas = results["metadatas"][0]


    print(
        f"ChromaDB returned {len(documents)} results"
    )


    # --------------------------------------
    # 5. Query normalization
    # --------------------------------------

    query_lower = query.lower().strip()

    normalized_query = re.sub(
        r"^(what is|what are|explain|define)\s+",
        "",
        query_lower
    )

    normalized_query = normalized_query.rstrip(
        "?!. "
    )


    # --------------------------------------
    # 6. Query keywords
    # --------------------------------------

    stop_words = {
        "what",
        "is",
        "are",
        "the",
        "a",
        "an",
        "of",
        "to",
        "in",
        "and",
        "for",
        "on",
        "how",
        "why",
        "does",
        "do"
    }


    query_words = {
        word
        for word in re.findall(
            r"\b[a-zA-Z]+\b",
            query_lower
        )
        if word not in stop_words
    }


    # --------------------------------------
    # 7. Reranking
    # --------------------------------------

    ranked_results = []


    for i, document in enumerate(documents):

        distance = distances[i]
        metadata = metadatas[i] or {}

        document_lower = document.lower()


        document_words = set(
            re.findall(
                r"\b[a-zA-Z]+\b",
                document_lower
            )
        )


        # Keyword overlap
        keyword_matches = len(
            query_words.intersection(
                document_words
            )
        )


        # Important words
        important_query_words = query_words - {
            "machine",
            "learning",
            "model",
            "data"
        }


        important_matches = len(
            important_query_words.intersection(
                document_words
            )
        )


        # ----------------------------------
        # Phrase matching
        # ----------------------------------

        phrase_bonus = 0.0

        important_phrases = [
            "supervised learning",
            "unsupervised learning",
            "reinforcement learning",
            "cross validation",
            "cross-validation"
        ]


        for phrase in important_phrases:

            if phrase in query_lower:

                if phrase in document_lower:

                    phrase_bonus += 0.30


        # ----------------------------------
        # Exact concept match
        # ----------------------------------

        exact_match_bonus = 0.0

        if (
            normalized_query
            and normalized_query in document_lower
        ):

            exact_match_bonus = 0.25


        # ----------------------------------
        # Definition match
        # ----------------------------------

        definition_bonus = 0.0

        definition_patterns = [

            f"{normalized_query} is",

            f"{normalized_query} refers to",

            f"{normalized_query} means",

            f"{normalized_query} is defined",

            f"{normalized_query} occurs",

            f"called {normalized_query}"

        ]


        if any(
            pattern in document_lower
            for pattern in definition_patterns
        ):

            definition_bonus = 0.35


        # ----------------------------------
        # Final ranking score
        # ----------------------------------

        ranking_score = (

            distance

            - (keyword_matches * 0.05)

            - (important_matches * 0.15)

            - phrase_bonus

            - exact_match_bonus

            - definition_bonus

        )


        ranked_results.append({

            "text": document,

            "distance": distance,

            "metadata": metadata,

            "keyword_matches": keyword_matches,

            "ranking_score": ranking_score

        })


    # --------------------------------------
    # 8. Sort
    # --------------------------------------

    ranked_results.sort(
        key=lambda result:
        result["ranking_score"]
    )


    # --------------------------------------
    # 9. Remove duplicate chunks
    # --------------------------------------

    unique_results = []

    seen_chunks = set()


    for result in ranked_results:

        metadata = result["metadata"]

        duplicate_key = (

            metadata.get("filename"),

            metadata.get("page"),

            result["text"].strip()

        )


        if duplicate_key in seen_chunks:

            continue


        seen_chunks.add(
            duplicate_key
        )

        unique_results.append(
            result
        )


    # --------------------------------------
    # 10. Debug output
    # --------------------------------------

    print(
        f"Unique retrieval results: "
        f"{len(unique_results)}"
    )


    print("\n--- Top Retrieval Results ---")


    for result in unique_results[:top_k]:

        print(

            f"Page: "
            f"{result['metadata'].get('page')} | "

            f"Distance: "
            f"{result['distance']:.4f} | "

            f"Score: "
            f"{result['ranking_score']:.4f} | "

            f"Keywords: "
            f"{result['keyword_matches']}"

        )


    # --------------------------------------
    # 11. Return top results
    # --------------------------------------

    return unique_results[:top_k]


# ==========================================
# LOCAL TEST
# ==========================================

if __name__ == "__main__":

    test_questions = [

        "What is supervised learning?",

        "What is overfitting?",

        "What is regression?",

        "What is reinforcement learning?",

        "What is cross validation?"

    ]


    for query in test_questions:

        print("\n" + "=" * 70)

        print(
            "QUERY:",
            query
        )


        results = search_documents(
            query,
            top_k=3
        )


        if not results:

            print(
                "NO RESULTS FOUND"
            )

            continue


        for i, result in enumerate(
            results,
            start=1
        ):

            print(
                f"\nResult {i}"
            )

            print(
                "Page:",
                result["metadata"].get("page")
            )

            print(
                "Distance:",
                round(
                    result["distance"],
                    4
                )
            )

            print(
                "Score:",
                round(
                    result["ranking_score"],
                    4
                )
            )

            print(
                "Text:",
                result["text"][:300]
            )