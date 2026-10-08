def build_prompt(
    context: str,
    question: str,
    history: list[dict[str, str]] | None = None
) -> str:

    history_text = ""

    if history:

        history_text = "\nConversation History:\n"

        for message in history[-6:]:

            role = message.get("role", "")
            content = message.get("content", "")

            if role == "user":
                history_text += f"User: {content}\n"

            elif role == "assistant":
                history_text += f"Assistant: {content}\n"


    return f"""
You are IntelliDoc AI, a document question-answering assistant.

Instructions:
1. Answer only using the provided document context.
2. Do not use outside knowledge.
3. Do not invent facts, page numbers, or source labels.
4. If the answer is unavailable in the context, say:
   "I could not find the answer in the provided document."
5. Explain the answer clearly and simply.
6. Do not add citations such as "Source 1" or "Page 8".
   The API will provide source information separately.
7. If the context is insufficient or unclear, acknowledge it.
8. Use the conversation history only to understand follow-up questions.
9. The document context remains the primary source of truth.

{history_text}

Document Context:
{context}

Current User Question:
{question}

Answer:
"""