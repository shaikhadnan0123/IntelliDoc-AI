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

deletion_ids = []

for indexes in groups.values():
    if len(indexes) > 1:
        for index in indexes[1:]:
            deletion_ids.append(results["ids"][index])

print("Records to delete:", len(deletion_ids))

if deletion_ids:
    collection.delete(ids=deletion_ids)

print("Duplicate cleanup completed.")
print("Remaining records:", collection.count())