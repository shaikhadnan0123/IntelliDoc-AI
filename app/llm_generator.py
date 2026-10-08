
import time
import os
import logging

from dotenv import load_dotenv
from groq import Groq

from app.pdf_search import search_documents
from app.context_builder import build_context
from app.prompt_builder import build_prompt


# --------------------------------------------------
# Configuration
# --------------------------------------------------

load_dotenv()

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY is not configured in .env")

client = Groq(api_key=api_key)


# --------------------------------------------------
# LLM Answer Generation
# --------------------------------------------------

def generate_answer(prompt: str) -> str:
    """
    Generate a response using the Groq LLM.
    """

    generation_start = time.perf_counter()

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
            max_tokens=1000
        )

        generation_time = time.perf_counter() - generation_start

        logger.info(
            "LLM generation time: %.4f seconds",
            generation_time
        )

        # Debug information
        if not response.choices:
            logger.error("LLM returned no choices.")
            return ""

        choice = response.choices[0]

        logger.info(
            "Finish reason: %s",
            choice.finish_reason
        )

        message = choice.message

        logger.info(
            "Message content type: %s",
            type(message.content).__name__
        )

        answer = message.content or ""

        if not answer.strip():
            logger.error(
                "LLM returned empty content. Full response: %r",
                response
            )
            return ""

        return answer.strip()

    except Exception:
        logger.exception("LLM generation failed.")
        return ""


# --------------------------------------------------
# Standalone Testing
# --------------------------------------------------

if __name__ == "__main__":

    question = "Who is the current Prime Minister of Japan?"

    search_results = search_documents(
        question,
        top_k=3
    )

    context = build_context(search_results)

    prompt = build_prompt(
        context,
        question
    )

    answer = generate_answer(prompt)

    print("\nQuestion:")
    print(question)

    print("\nGenerated Answer:\n")
    print(answer)