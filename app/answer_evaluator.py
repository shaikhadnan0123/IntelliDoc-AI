import json
import logging
import re

from app.llm_generator import generate_answer


# ===============================
# LOGGING
# ===============================

logger = logging.getLogger(__name__)


# ===============================
# ANSWER EVALUATION
# ===============================

def evaluate_answer(
    question: str,
    context: str,
    answer: str
) -> dict:

    evaluation_prompt = f"""
You are an AI answer evaluator for a RAG application.

Question:
{question}

Document Context:
{context}

AI Answer:
{answer}

Evaluate the AI answer using ONLY the document context.

Check:

1. Faithfulness:
Is the answer supported by the provided context?

2. Relevance:
Does the answer address the question?

3. Unsupported Claims:
Does the answer contain information that is not supported?

Return ONLY valid JSON.

Do not use Markdown.
Do not add text before or after the JSON.
Keep the explanation short.
Do not use double quotes inside the explanation.

Required format:

{{
    "faithfulness_score": 0,
    "relevance_score": 0,
    "grounded": true,
    "explanation": "Short explanation"
}}

Rules:

- Scores must be integers from 0 to 100.
- grounded must be true only when the answer is supported.
- Use false when the context does not support the answer.
- Do not use outside knowledge.
"""


    try:

        # ===============================
        # CALL EVALUATION LLM
        # ===============================

        evaluation_response = generate_answer(
            evaluation_prompt
        )

        logger.info(
            "Raw evaluation response: %r",
            evaluation_response
        )


        # ===============================
        # EXTRACT JSON
        # ===============================

        json_match = re.search(
            r"\{.*\}",
            evaluation_response,
            re.DOTALL
        )

        if not json_match:

            raise ValueError(
                "No JSON object found in evaluation response."
            )


        json_text = json_match.group(0)

        logger.info(
            "Extracted evaluation JSON: %s",
            json_text
        )


        # ===============================
        # PARSE JSON
        # ===============================

        evaluation = json.loads(
            json_text
        )


        # ===============================
        # READ VALUES
        # ===============================

        faithfulness_score = int(
            evaluation.get(
                "faithfulness_score",
                0
            )
        )

        relevance_score = int(
            evaluation.get(
                "relevance_score",
                0
            )
        )

        grounded = evaluation.get(
            "grounded",
            False
        )

        explanation = evaluation.get(
            "explanation",
            "No explanation provided."
        )


        # ===============================
        # VALIDATE SCORES
        # ===============================

        faithfulness_score = max(
            0,
            min(
                100,
                faithfulness_score
            )
        )

        relevance_score = max(
            0,
            min(
                100,
                relevance_score
            )
        )


        # ===============================
        # VALIDATE GROUNDED VALUE
        # ===============================

        if isinstance(grounded, str):

            grounded = (
                grounded.strip().lower()
                == "true"
            )

        else:

            grounded = bool(
                grounded
            )


        # ===============================
        # RETURN EVALUATION
        # ===============================

        return {

            "faithfulness_score": (
                faithfulness_score
            ),

            "relevance_score": (
                relevance_score
            ),

            "grounded": grounded,

            "explanation": str(
                explanation
            )

        }


    except Exception:

        logger.exception(
            "Answer evaluation failed"
        )

        return {

            "faithfulness_score": 0,

            "relevance_score": 0,

            "grounded": False,

            "explanation": (
                "Evaluation could not be completed."
            )

        }