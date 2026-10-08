import logging
import os
import time

from groq import Groq


logger = logging.getLogger(__name__)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_answer(prompt: str) -> str:
    """
    Generate a response using the Groq LLM.
    """

    generation_start = time.perf_counter()

    try:
        logger.info("Starting Groq LLM generation...")
        logger.info("Prompt length: %d characters", len(prompt))

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

        logger.info(
            "Groq response received successfully."
        )

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

    except Exception as exc:
        logger.exception(
            "LLM generation failed. Error type: %s | Error: %s",
            type(exc).__name__,
            str(exc)
        )

        return ""