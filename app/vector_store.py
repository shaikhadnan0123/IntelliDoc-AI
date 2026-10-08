import chromadb

from embedding_model import create_embeddings


# ============================================================
# 1. CONNECT TO CHROMADB
# ============================================================

client = chromadb.PersistentClient(
    path="chroma_db"
)

collection = client.get_or_create_collection(
    name="intellidoc_metadata_test"
)


# ============================================================
# 2. TEST DOCUMENTS
# ============================================================

texts = [
    "Machine learning is a branch of artificial intelligence.",
    "Supervised learning uses labeled training data.",
    "Classification predicts categories such as spam or not spam.",
    "The weather is sunny today."
]


# ============================================================
# 3. CREATE EMBEDDINGS FOR DOCUMENTS
# ============================================================

embeddings = create_embeddings(texts)

print("\n========== EMBEDDING DEBUG ==========")
print("Embedding shape:", embeddings.shape)
print("Number of documents:", len(texts))
print("=====================================")


# ============================================================
# 4. STORE DOCUMENTS IN CHROMADB
# ============================================================

# Use unique IDs.
# This prevents duplicate-ID errors if you run the script again.

ids = [
    "chunk_001",
    "chunk_002",
    "chunk_003",
    "chunk_004"
]

metadatas = [
    {
        "filename": "machine_learning.pdf",
        "page": 1,
        "section": "Introduction"
    },
    {
        "filename": "machine_learning.pdf",
        "page": 5,
        "section": "Supervised Learning"
    },
    {
        "filename": "machine_learning.pdf",
        "page": 8,
        "section": "Classification"
    },
    {
        "filename": "machine_learning.pdf",
        "page": 20,
        "section": "Other Topics"
    }
]


# ============================================================
# 5. ADD DOCUMENTS
# ============================================================

# Delete existing test collection contents so that
# running this script repeatedly does not create confusion.

existing = collection.get()

if existing["ids"]:
    collection.delete(
        ids=existing["ids"]
    )


collection.add(
    ids=ids,
    documents=texts,
    embeddings=embeddings.tolist(),
    metadatas=metadatas
)


print("\n========== STORAGE DEBUG ==========")
print("Documents stored successfully.")
print("Collection name:", collection.name)
print("Number of documents:", collection.count())
print("===================================")


# ============================================================
# 6. VERIFY STORED DOCUMENTS
# ============================================================

stored_documents = collection.get(
    include=["documents", "metadatas"]
)

print("\n========== STORED DOCUMENTS ==========")

for i, document in enumerate(stored_documents["documents"]):

    print(f"\nDocument {i + 1}:")
    print(document)

    print("Metadata:")
    print(stored_documents["metadatas"][i])

print("=======================================")


# ============================================================
# 7. CREATE QUERY EMBEDDING
# ============================================================

query = "What type of learning uses labeled data?"

query_embedding = create_embeddings(
    [query]
)

print("\n========== QUERY DEBUG ==========")
print("Query:")
print(query)

print("\nQuery embedding shape:")
print(query_embedding.shape)

print("=================================")


# ============================================================
# 8. QUERY CHROMADB
# ============================================================

number_of_results = min(
    10,
    collection.count()
)

results = collection.query(
    query_embeddings=query_embedding.tolist(),
    n_results=number_of_results
)


# ============================================================
# 9. DISPLAY RAW RETRIEVAL RESULTS
# ============================================================

print("\n========== RAW CHROMA RESULTS ==========")

print("\nIDs:")
print(results["ids"])

print("\nDistances:")
print(results["distances"])

print("\n========================================")


# ============================================================
# 10. DISPLAY RETRIEVED DOCUMENTS
# ============================================================

print("\n========== RETRIEVED DOCUMENTS ==========")

retrieved_documents = results["documents"][0]
retrieved_metadatas = results["metadatas"][0]
retrieved_distances = results["distances"][0]
retrieved_ids = results["ids"][0]


for i in range(len(retrieved_documents)):

    print(f"\n--- Result {i + 1} ---")

    print("ID:")
    print(retrieved_ids[i])

    print("\nDistance:")
    print(retrieved_distances[i])

    print("\nDocument:")
    print(retrieved_documents[i])

    print("\nMetadata:")
    print(retrieved_metadatas[i])


print("\n==========================================")
print("CHROMA RETRIEVAL TEST COMPLETE")
print("==========================================")