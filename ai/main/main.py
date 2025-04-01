import sys
import os
import json
import uuid
import requests
import whisper
import uvicorn

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse



import oci
from oci.config import from_file
from oci.ai_language import AIServiceLanguageClient
from oci.ai_language.models import (
    BatchDetectLanguageSentimentsDetails,
    TextDocument
)

# Import our temp storage utility
from temp_storage import save_transcript, load_transcript

app = FastAPI()

# CORS Setup
origins = ["http://localhost:3000"]  # Adjust if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LM Studio base URL (or fallback)
LMSTUDIO_BASE_URL = os.environ.get("LMSTUDIO_URL") or "http://localhost:1234"

# OCI setup
oci_config = from_file()
language_client = AIServiceLanguageClient(oci_config)

def sse_format(message: str) -> str:
    """
    Helper to format a message as SSE data.
    Every SSE event ends with a double newline.
    """
    return f"data: {message}\n\n"

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI with Docker Compose"}

def generate_summary_with_llm(transcript_text: str) -> str:
    """
    Send the transcript to your LLM to get a concise summary.
    Adjust the prompt, model, and other parameters as needed.
    """
    endpoint = f"{LMSTUDIO_BASE_URL}/v1/chat/completions"

    prompt = (
        "You are a helpful assistant. Given the following call transcript, "
        "please generate a concise summary that covers key points, overall tone, and important details:\n\n"
        f"{transcript_text}\n"
    )

    payload = {
        "model": "YourModelNameOrPath",  # Adjust to match your loaded LM Studio model
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post(endpoint, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()
        # Extract the summary text
        summary_text = data["choices"][0]["message"]["content"]
        return summary_text
    except Exception as e:
        print("ERROR generating summary with LLM:", e, file=sys.stderr)
        return "No summary (error calling LLM)."

@app.post("/upload", response_class=StreamingResponse)
async def upload_audio(file: UploadFile = File(...)):
    """
    Single endpoint that returns SSE messages during the upload/analysis process.
    The frontend must manually consume the streamed data.
    """

    async def event_generator():
        # 1) Inform that file arrived
        yield sse_format("audio file received, saving locally...")

        # Save file to disk
        temp_filename = f"temp_{uuid.uuid4()}_{file.filename}"
        with open(temp_filename, "wb") as f:
            f.write(await file.read())

        yield sse_format("file saved, now transcribing with Whisper...")

        # 2) Transcribe using Whisper
        model = whisper.load_model("base")  # or "small", "medium", etc.
        result = model.transcribe(temp_filename)
        transcript_text = result["text"]

        yield sse_format("whisper transcription complete.")

        # 3) Prepare OCI Sentiment request
        yield sse_format("reaching OCI services for sentiment analysis...")
        documents = [
            TextDocument(
                key="doc1",
                text=transcript_text,
                language_code="en"
            )
        ]
        sentiment_request = BatchDetectLanguageSentimentsDetails(documents=documents)

        # 4) Call OCI
        emotion_text = "Unknown"
        aspects_json_str = None
        try:
            response = language_client.batch_detect_language_sentiments(
                batch_detect_language_sentiments_details=sentiment_request
            )
            yield sse_format("OCI is analyzing emotion...")

            if response.data.documents and len(response.data.documents) > 0:
                doc_result = response.data.documents[0]

                if hasattr(doc_result.document_sentiment, "label"):
                    emotion_text = doc_result.document_sentiment.label
                elif doc_result.aspects:
                    emotion_text = doc_result.aspects[0].sentiment
                else:
                    emotion_text = "No document-level sentiment found"

                if doc_result.aspects:
                    aspects_json_str = json.dumps([
                        {
                            "text": a.text,
                            "sentiment": a.sentiment,
                            "scores": a.scores
                        } for a in doc_result.aspects
                    ])
        except Exception as ex:
            print("DEBUG: Exception calling OCI:", ex, file=sys.stderr)
            yield sse_format("OCI sentiment analysis failed.")
            emotion_text = "Unknown"

        yield sse_format("reaching LLM services for summary generation...")

        # 5) Generate the summary via LLM
        summary_text = generate_summary_with_llm(transcript_text)
        yield sse_format("summary generated by AI.")

        # 6) Instead of DB, store in temp JSON
        aspects_list = json.loads(aspects_json_str) if aspects_json_str else []
        transcript_id = save_transcript(
            transcript_text=transcript_text,
            summary_text=summary_text,
            emotion_text=emotion_text,
            aspects_list=aspects_list
        )

        # Remove temp file
        os.remove(temp_filename)

        yield sse_format("generating final insights...")

        # 7) Finally, yield the JSON with the full data (same SSE approach)
        final_payload = {
            "id": transcript_id,
            "transcript": transcript_text,
            "summary": summary_text,
            "emotion": emotion_text,
            "aspects": aspects_list
        }
        yield sse_format(json.dumps(final_payload))

    # Return a streaming response of SSE data
    return StreamingResponse(event_generator(), media_type="text/event-stream")


# -----------------------------
# Pydantic model for Chat Request
# -----------------------------
from pydantic import BaseModel
from typing import List, Dict

class ChatRequest(BaseModel):
    # Note: use string for ID now, since we're using UUIDs
    transcript_id: str
    messages: List[Dict]

# -----------------------------
# 2) Chat endpoint
# -----------------------------
@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    # Instead of DB, load from temp JSON
    transcript_obj = load_transcript(request.transcript_id)
    if not transcript_obj:
        raise HTTPException(status_code=404, detail="Transcript not found in temp files")

    # Build system context
    system_prompt = (
        "You have the following context:\n\n"
        f"Transcript: {transcript_obj['transcript_text']}\n"
        f"Summary: {transcript_obj['summary_text']}\n"
        f"Emotion: {transcript_obj['emotion_text']}\n\n"
        "The user will ask questions or make requests based on this transcript. Provide helpful answers."
    )

    conversation = [{"role": "system", "content": system_prompt}]
    conversation.extend(request.messages)

    payload = {
        "model": "YourModelNameOrPath",  # Adjust to match your loaded LM Studio model
        "messages": conversation,
        "temperature": 0.7
    }

    try:
        endpoint = f"{LMSTUDIO_BASE_URL}/v1/chat/completions"
        response = requests.post(endpoint, json=payload, timeout=90)
        if response.status_code != 200:
            return {"error": f"LLM error. Status: {response.status_code}"}
        data = response.json()
        assistant_reply = data["choices"][0]["message"]["content"]
        return {"assistant_message": assistant_reply}
    except Exception as e:
        return {"error": f"Exception calling LLM: {str(e)}"}


# -----------------------------
# 3) Test OCI endpoint
# -----------------------------
@app.get("/test_oci")
def test_oci_call():
    """
    Quick test route to see if OCI returns a normal doc-level sentiment for known text.
    """
    text = "I hate everything about this. This is the absolute worst experience. I'm so upset."
    documents = [
        TextDocument(
            key="doc1",
            text=text,
            language_code="en"
        )
    ]
    sentiment_request = BatchDetectLanguageSentimentsDetails(documents=documents)

    try:
        response = language_client.batch_detect_language_sentiments(
            batch_detect_language_sentiments_details=sentiment_request
        )
        print("DEBUG /test_oci response:", response.data, file=sys.stderr)
        return response.data
    except Exception as ex:
        print("DEBUG /test_oci exception:", ex, file=sys.stderr)
        return {"error": str(ex)}

# Run server if executed directly
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
