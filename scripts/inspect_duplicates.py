
import chromadb
from collections import defaultdict

client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_collection(
    name="arise_ml_documents_v2"
)

results = collection.get(
    include=["documents", "metadatas"]
)

groups = defaultdict(list)

for index, (document, metadata) in enumerate(
    zip(
        results["documents"],
        results["metadatas"]
    )
):
    key = (
        metadata.get("filename"),
        metadata.get("page"),
        document.strip()
    )

    groups[key].append(index)

deletion_candidates = []

for key, indexes in groups.items():

    if len(indexes) > 1:

        # Preserve the first record
        duplicate_indexes = indexes[1:]

        for index in duplicate_indexes:

            deletion_candidates.append(
                results["ids"][index]
            )

print("Total records:", len(results["ids"]))

print(
    "Duplicate groups:",
    sum(1 for indexes in groups.values() if len(indexes) > 1)
)

print(
    "Deletion candidates:",
    len(deletion_candidates)
)

print("\nFirst 10 deletion candidates:")

for record_id in deletion_candidates[:10]:
    print(record_id)