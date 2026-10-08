const evaluationSection = document.getElementById("evaluation-section");
const faithfulnessScore = document.getElementById("faithfulness-score");
const relevanceScore = document.getElementById("relevance-score");
const groundedStatus = document.getElementById("grounded-status");
const evaluationExplanation = document.getElementById("evaluation-explanation");
const uploadButton = document.getElementById("uploadButton");
const documentInput = document.getElementById("documentInput");
const uploadStatus = document.getElementById("uploadStatus");

const askButton = document.getElementById("askButton");
const questionInput = document.getElementById("questionInput");
const answerDiv = document.getElementById("answer");
const answerStatus = document.getElementById("answerStatus");

const documentSelect = document.getElementById("documentSelect");
const sourcesDiv = document.getElementById("sources");


// ===============================
// DOCUMENT SELECTOR
// ===============================

function addDocumentToSelector(filename) {

    const evaluationSection = document.getElementById(
    "evaluation-section"
    );

    const faithfulnessScore = document.getElementById(
        "faithfulness-score"
    );

    const relevanceScore = document.getElementById(
        "relevance-score"
    );

    const groundedStatus = document.getElementById(
        "grounded-status"
    );

    const evaluationExplanation = document.getElementById(
        "evaluation-explanation"
    );

    // Check whether the document already exists
    const existingOption = Array.from(
        documentSelect.options
    ).find(option => option.value === filename);

    if (existingOption) {
        documentSelect.value = filename;
        return;
    }

    // Create a new dropdown option
    const option = document.createElement("option");

    option.value = filename;
    option.textContent = filename;

    documentSelect.appendChild(option);

    // Automatically select the uploaded document
    documentSelect.value = filename;
}


async function loadDocuments() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/documents"
        );

        if (!response.ok) {
            throw new Error("Failed to load documents");
        }

        const data = await response.json();

        data.documents.forEach(filename => {
            addDocumentToSelector(filename);
        });

        console.log(
            `${data.total_documents} documents loaded.`
        );

    } catch (error) {

        console.error(
            "Unable to load documents:",
            error
        );

    }
}


// Load documents when the page opens
loadDocuments();


// ===============================
// PDF UPLOAD
// ===============================

uploadButton.addEventListener("click", async () => {

    const file = documentInput.files[0];

    if (!file) {
        uploadStatus.textContent =
            "Please select a PDF file.";
        return;
    }

    if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
    ) {
        uploadStatus.textContent =
            "Only PDF files are allowed.";
        return;
    }

    const formData = new FormData();

    formData.append("file", file);

    uploadStatus.textContent =
        "Uploading PDF...";

    uploadButton.disabled = true;

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/upload",
            {
                method: "POST",
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error("Upload failed");
        }

        const data = await response.json();

        uploadStatus.textContent =
            `Uploaded successfully: ${data.filename}`;

        // Add uploaded filename to dropdown
        addDocumentToSelector(data.filename);

        // Clear file input
        documentInput.value = "";

    } catch (error) {

        console.error(error);

        uploadStatus.textContent =
            "Unable to upload the PDF.";

    } finally {

        uploadButton.disabled = false;

    }

});


// ===============================
// CONVERSATION HISTORY
// ===============================

let conversationHistory = [];


// ===============================
// ASK QUESTION
// ===============================

askButton.addEventListener("click", async () => {

    const question = questionInput.value.trim();
    const filename = documentSelect.value;

    if (!question) {
        answerStatus.textContent = "Please enter a question.";
        return;
    }

    answerStatus.textContent = "Generating answer...";
    answerDiv.textContent = "";
    sourcesDiv.textContent = "Searching document sources...";
    askButton.disabled = true;

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/ask",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    question: question,

                    filename: filename || null,

                    history: conversationHistory

                })
            }
        );

        if (!response.ok) {
            throw new Error("Request failed");
        }

        const data = await response.json();


        // ===============================
        // STORE CONVERSATION
        // ===============================

        conversationHistory.push({

            role: "user",
            content: question

        });

        conversationHistory.push({

            role: "assistant",
            content: data.answer

        });


        // ===============================
        // DISPLAY ANSWER
        // ===============================

        answerDiv.textContent = data.answer;

        // ===============================
        // DISPLAY ANSWER EVALUATION
        // ===============================

        const evaluation = data.evaluation;

        if (evaluation) {

           evaluationSection.style.display = "block";

           faithfulnessScore.textContent =
               `${evaluation.faithfulness_score}/100`;

           relevanceScore.textContent =
              `${evaluation.relevance_score}/100`;

           groundedStatus.textContent =
               evaluation.grounded
                   ? "Yes"
                   : "No";

           evaluationExplanation.textContent =
               evaluation.explanation;

        } else {

             evaluationSection.style.display = "none";

        }


        // ===============================
        // DISPLAY SOURCES
        // ===============================

        sourcesDiv.textContent = "";

        if (data.sources && data.sources.length > 0) {

            data.sources.forEach((source, index) => {

                const sourceCard = document.createElement("div");
                sourceCard.className = "source-card";

                const title = document.createElement("h3");
                title.textContent = `Source ${index + 1}`;

                const filenameText = document.createElement("p");
                filenameText.textContent =
                    `Document: ${source.filename}`;

                const page = document.createElement("p");
                page.textContent = `Page: ${source.page}`;

                const distance = document.createElement("p");
                distance.textContent =
                    `Distance: ${source.distance}`;

                const text = document.createElement("p");
                text.textContent = source.text;

                sourceCard.appendChild(title);
                sourceCard.appendChild(filenameText);
                sourceCard.appendChild(page);
                sourceCard.appendChild(distance);
                sourceCard.appendChild(text);

                sourcesDiv.appendChild(sourceCard);

            });

        } else {

            sourcesDiv.textContent = "No sources found.";

        }

        answerStatus.textContent =
            "Answer generated successfully.";

        questionInput.value = "";


    } catch (error) {

        console.error(error);

        answerStatus.textContent =
            "Unable to generate an answer.";

        answerDiv.textContent =
            "Please check whether FastAPI is running.";

        sourcesDiv.textContent =
            "Sources are unavailable.";

    } finally {

        askButton.disabled = false;

    }

});