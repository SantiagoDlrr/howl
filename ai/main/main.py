import sys
import os
import json
import uuid
import requests
import whisper
import uvicorn
import logging

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

import oci
from oci.config import from_file
from oci.ai_language import AIServiceLanguageClient
from oci.ai_language.models import (
    BatchDetectLanguageSentimentsDetails,
    TextDocument
)

# Import our temp storage utility
from temp_storage import save_transcript, load_transcript

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS Setup
origins = ["http://localhost:3000"]  # Adjust or add your front-end URL as needed
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
try:
    oci_config = from_file()  # If you have an OCI config file
    language_client = AIServiceLanguageClient(oci_config)
    logger.info("OCI SDK configured successfully.")
except Exception as e:
    logger.error(f"Failed to configure OCI SDK: {e}")
    language_client = None  # None if setup fails


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI with Docker Compose"}


# ----------- Utility: parse transcript text into array of {speaker, text} -----------
def parse_transcript_to_list(full_text: str):
    """
    Naive parser that splits a conversation into a list of {speaker, text}.
    Assumes lines start with 'SpeakerName:' and continues until next speaker or text ends.
    """
    lines = full_text.strip().split("\n")
    transcript_entries = []

    current_speaker = None
    current_text = []

    for line in lines:
        line = line.strip()
        if not line:
            continue
        # Check if line looks like "Something:"
        if ":" in line:
            # e.g., "Alex:", "Jamie:", etc.
            parts = line.split(":", 1)
            possible_speaker = parts[0].strip()
            rest = parts[1].strip() if len(parts) > 1 else ""

            # If the line indeed starts a new speaker:
            if current_speaker is not None and current_text:
                # Save the previous speaker chunk
                transcript_entries.append({
                    "speaker": current_speaker,
                    "text": " ".join(current_text).strip()
                })
            current_speaker = possible_speaker
            current_text = [rest] if rest else []
        else:
            # Continuation of current speaker's text
            current_text.append(line)

    # If there's leftover text at the end
    if current_speaker and current_text:
        transcript_entries.append({
            "speaker": current_speaker,
            "text": " ".join(current_text).strip()
        })

    return transcript_entries


# ----------- Prompt creation (include riskWords) -----------
def create_llm_prompt(transcript_text: str) -> str:
    """
    Creates the detailed prompt for the LLM,
    now including a 'riskWords' field in the JSON.
    """
    prompt = f"""
You are an expert call analyst. Based on the provided call transcript, generate a structured report containing the following sections:
- Feedback
- Key Topics
- Emotions
- Sentiment
- Output (Resolution)
- Risk Words (any escalation threats, negative expressions, cancellations, or other 'risky' words the customer used)
- Summary

Analyze the transcript below:
--- START TRANSCRIPT ---
{transcript_text}
--- END TRANSCRIPT ---

Generate your analysis strictly in the following JSON format. Do not include any text before or after the JSON object:

{{
  "feedback": "Specific feedback from or about the call.",
  "keyTopics": [
    "List of main topics in the conversation."
  ],
  "emotions": [
    "List of the primary emotions the speaker(s) showed."
  ],
  "sentiment": "Overall sentiment of the call. E.g., Negative, Positive, Neutral, Mixed, with short reasoning if necessary.",
  "output": "Next steps or resolution details from the conversation.",
  "riskWords": "Highlight if any language is escalatory or signals risk (if none, say 'None')",
  "summary": "One or two-sentence summary of the entire call."
}}
"""
    return prompt

# For consistent error fallback, ensure we have all 7 keys
def get_default_report():
    return {
        "feedback": "Error generating feedback.",
        "keyTopics": ["Error generating key topics."],
        "emotions": ["Error generating emotions."],
        "sentiment": "Error generating sentiment.",
        "output": "Error generating output.",
        "riskWords": "Error generating risk words.",
        "summary": "Error generating summary."
    }

def generate_call_report_with_llm(transcript_text: str) -> Dict[str, Any]:
    """
    Send the transcript to the LLM to get a structured report (JSON).
    """
    endpoint = f"{LMSTUDIO_BASE_URL}/v1/chat/completions"
    prompt = create_llm_prompt(transcript_text)

    default_report = get_default_report()

    payload = {
        "model": "YourModelNameOrPath",  # Adjust to match your LM Studio model name
        "messages": [
            {"role": "system", "content": "You are an expert call analyst generating JSON reports."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.5
    }

    try:
        logger.info("Sending request to LLM for structured report.")
        response = requests.post(endpoint, json=payload, timeout=120)
        response.raise_for_status()
        data = response.json()

        llm_response_content = data.get("choices", [{}])[0].get("message", {}).get("content")
        if not llm_response_content:
            logger.error("LLM response content is empty.")
            return default_report

        # Clean potential code fences
        if llm_response_content.strip().startswith("```json"):
            llm_response_content = llm_response_content.strip()[7:]
        if llm_response_content.strip().endswith("```"):
            llm_response_content = llm_response_content.strip()[:-3]

        # Parse the JSON
        report_data = json.loads(llm_response_content.strip())

        # Ensure all expected keys
        expected_keys = [
            "feedback", "keyTopics", "emotions", "sentiment", "output", "riskWords", "summary"
        ]
        for key in expected_keys:
            if key not in report_data:
                report_data[key] = f"Missing {key} in LLM response."

        return report_data

    except Exception as e:
        logger.error(f"Error generating call report with LLM: {e}", exc_info=True)
        # Return the default fallback
        return default_report


# ----------- Upload endpoint (no SSE, returns final JSON) -----------
@app.post("/upload")
async def upload_audio(file: UploadFile = File(...)):
    """
    Single endpoint: 
      1) Save the file (optional).
      2) Hardcode or run Whisper for transcript. 
      3) Check OCI for sentiment (optional).
      4) Ask LLM for a structured call report including 'riskWords'.
      5) Convert everything to your front-end's expected JSON shape and return it directly.
    """

    # 1) Save file to disk (optional)
    temp_filename = f"temp_{uuid.uuid4()}_{os.path.splitext(file.filename)[0]}.wav"
    try:
        with open(temp_filename, "wb") as f:
            content = await file.read()
            f.write(content)
        logger.info(f"Saved uploaded file to {temp_filename}")
    except Exception as e:
        logger.error(f"Failed to save uploaded file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    # 2) Transcribe with Whisper 
    
    try:
        logger.info("Loading Whisper model...")
        model = whisper.load_model("base")  # or "small", "medium", etc.
        logger.info("Starting transcription...")
        result = model.transcribe(temp_filename, fp16=False)  # fp16=False for CPU-only usage
        transcript_text = result["text"]
        logger.info("Whisper transcription complete.")
    except Exception as e:
        logger.error(f"Whisper transcription failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Whisper transcription failed: {e}")
    

    transcript_text = """Alex:
    Good morning! This is Alex calling from Quick Tech Solutions. How are you doing today?

    Jamie:
    Are you seriously asking me that? After everything your company has put me through? I’ve spent hours on hold, been transferred a dozen times, and still have no solution.

    Alex:
    I'm really sorry to hear that, Jamie. I’d be happy to look into this and try to resolve it right away. Can you tell me a bit more about what happened?

    Jamie:
    What happened is I bought one of your so-called smart dishwashers and it broke after five days. Five. Days. Since then, I’ve been promised a replacement, a refund, a technician—you name it. None of that happened. I’ve been lied to, ignored, and completely disrespected as a customer.

    Alex:
    That’s absolutely not the experience we want our customers to have. Let me check your file and—

    Jamie:
    Don’t even bother reading off the same script everyone else has. I’ve heard it all. We're escalating it. We'll get back to you. Thank you for your patience. It’s insulting at this point. Just admit you sold me a broken product and don’t want to fix it.

    Alex:
    I understand you're upset, and you have every right to be. What you’ve experienced is unacceptable. I’ll personally make sure this gets handled today.

    Jamie:
    You said that last week. And the week before. Every time someone says they’re taking care of it, nothing happens. I’m done playing nice. If I don’t get a refund within 48 hours, I’m filing a complaint with the Better Business Bureau, disputing the charge with my bank, and leaving a detailed review everywhere I can.

    Alex:
    That’s completely understandable. Let me at least get the process moving again while we're on the call. I’ll also put in a high-priority note so your case gets addressed within the hour.

    Jamie:
    I’ll believe it when I see it. So far, all I’ve gotten from Quick Tech Solutions is broken promises and endless apologies that mean nothing.

    Alex:
    You shouldn’t have to go through that. I’m genuinely sorry. I’ll stay on top of this until you receive confirmation. You have my word.

    Jamie:
    Your word doesn’t mean anything to me unless I see results. I’ve wasted enough time on this disaster.

    Alex:
    Understood. You’ll hear back from me directly before the end of the day with a resolution.

    Jamie:
    Good. You’d better follow through this time.

    Alex:
    Thank you for your time, Jamie. I really do appreciate your patience.

    Jamie:
    I’m not being patient. I’m being very clear. Fix it.

    Alex:
    Got it. You’ll hear from me soon.

    Jamie:
    You’d better. Goodbye.
    """

    # (If you want actual Whisper transcription, you could do it here. 
    #  We'll skip since the user wants a hardcoded version.)

    # 3) OCI Sentiment Analysis (optional)
    oci_emotion_text = "N/A"
    oci_aspects_list = []
    if language_client:
        try:
            documents = [
                TextDocument(
                    key="doc1",
                    text=transcript_text,
                    language_code="en"
                )
            ]
            sentiment_request = BatchDetectLanguageSentimentsDetails(documents=documents)
            response = language_client.batch_detect_language_sentiments(
                batch_detect_language_sentiments_details=sentiment_request
            )
            if response.data.documents and len(response.data.documents) > 0:
                doc_result = response.data.documents[0]
                if hasattr(doc_result, 'document_sentiment') and doc_result.document_sentiment:
                    oci_emotion_text = doc_result.document_sentiment.label
                elif doc_result.aspects:
                    oci_emotion_text = doc_result.aspects[0].sentiment
                if doc_result.aspects:
                    oci_aspects_list = [
                        {
                            "text": a.text,
                            "sentiment": a.sentiment,
                            "scores": a.scores
                        } for a in doc_result.aspects
                    ]
        except Exception as e:
            logger.error(f"OCI sentiment analysis failed: {e}")
            oci_emotion_text = "Error (OCI failure)"

    # 4) Generate the structured LLM report (including riskWords)
    report_data = generate_call_report_with_llm(transcript_text)

    # 5) Save in temp storage (optional)
    transcript_id = str(uuid.uuid4())
    try:
        save_transcript(
            transcript_id=transcript_id,
            transcript_text=transcript_text,
            report_data=report_data,
            oci_emotion=oci_emotion_text,
            oci_aspects=oci_aspects_list
        )
    except Exception as e:
        logger.error(f"Failed to save transcript data for {transcript_id}: {e}")

    # Remove the temp audio file
    if os.path.exists(temp_filename):
        try:
            os.remove(temp_filename)
        except OSError as e:
            logger.warning(f"Could not remove temp file {temp_filename}: {e}")

    # Convert transcript into an array of {speaker, text} to match your front-end
    parsed_transcript = parse_transcript_to_list(transcript_text)

    # Build final JSON in the same shape as your front-end FileData
    # The front-end expects something like:
    # {
    #   id: number,
    #   name: string,
    #   date: string,
    #   type: string,
    #   duration: string,
    #   rating: number,
    #   report: {
    #       feedback: string,
    #       keyTopics: string[],
    #       emotions: string[],
    #       sentiment: string,
    #       output: string,
    #       riskWords: string,
    #       summary: string
    #   },
    #   transcript?: TranscriptEntry[];
    # }
    # We'll just pass `transcript_id` as an integer or reuse it as is.

    # Example of converting UUID to int by hashing, or just keep it as is. We can do:
    # We'll parse out a random integer from the UUID to mimic your 'id'
    numeric_id = abs(hash(transcript_id)) % (10**6)  # or any scheme you prefer

    final_response = {
        "id": numeric_id,
        "name": file.filename,
        "date": "01/04/2025",  # or dynamically: str(date.today()), etc.
        "type": "Sin categoría",
        "duration": "7 min",
        "rating": 0,
        "report": {
            "feedback": report_data.get("feedback", ""),
            "keyTopics": report_data.get("keyTopics", []),
            "emotions": report_data.get("emotions", []),
            "sentiment": report_data.get("sentiment", ""),
            "output": report_data.get("output", ""),
            "riskWords": report_data.get("riskWords", ""),
            "summary": report_data.get("summary", "")
        },
        "transcript": parsed_transcript
    }

    # Return final JSON
    return final_response


# ---------- Chat endpoint ----------
class ChatRequest(BaseModel):
    transcript_id: str
    messages: List[Dict]


@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    """
    Allows follow-up Q&A referencing the saved transcript+report.
    """
    transcript_obj = load_transcript(request.transcript_id)
    if not transcript_obj:
        logger.warning(f"Transcript not found for id: {request.transcript_id}")
        raise HTTPException(status_code=404, detail="Transcript not found in temp files")

    report = transcript_obj.get("report", {})
    transcript_text = transcript_obj.get("transcript_text", "Transcript not available.")
    oci_emotion = transcript_obj.get("oci_emotion", "N/A")

    # Build system prompt
    system_prompt_parts = [
        "You are a helpful assistant analyzing a call transcript.",
        "Here is the context for the call:",
        f"\n--- Transcript Snippet (start) ---\n{transcript_text[:500]}...\n--- Transcript Snippet (end) ---",
        f"\n--- Call Analysis Report ---",
        f"Feedback: {report.get('feedback', 'N/A')}",
        f"Key Topics: {'; '.join(report.get('keyTopics', ['N/A']))}",
        f"Detected Emotions: {'; '.join(report.get('emotions', ['N/A']))}",
        f"Overall Sentiment: {report.get('sentiment', 'N/A')}",
        f"Call Output/Resolution: {report.get('output', 'N/A')}",
        f"Risk Words: {report.get('riskWords', 'N/A')}",
        f"Summary: {report.get('summary', 'N/A')}",
        f"Additional OCI Sentiment: {oci_emotion}",
        "\nBased on all this information, answer the user's questions concisely."
    ]
    system_prompt = "\n".join(system_prompt_parts)

    conversation = [{"role": "system", "content": system_prompt}]
    conversation.extend(request.messages)

    payload = {
        "model": "YourModelNameOrPath",  # Adjust
        "messages": conversation,
        "temperature": 0.7,
        "max_tokens": 300
    }

    try:
        endpoint = f"{LMSTUDIO_BASE_URL}/v1/chat/completions"
        logger.info(f"Sending chat request to LLM for transcript {request.transcript_id}")
        response = requests.post(endpoint, json=payload, timeout=90)
        response.raise_for_status()
        data = response.json()

        assistant_reply = data.get("choices", [{}])[0].get("message", {}).get("content")
        if not assistant_reply:
            logger.warning("LLM returned empty reply for chat request.")
            return {"assistant_message": "Sorry, I couldn't generate a response."}

        return {"assistant_message": assistant_reply}

    except requests.exceptions.RequestException as req_err:
        logger.error(f"Exception calling LLM during chat: {req_err}")
        raise HTTPException(status_code=503, detail=f"LLM service unavailable: {str(req_err)}")
    except Exception as e:
        logger.error(f"Unexpected exception during chat: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# ---------- Test OCI endpoint ----------
@app.get("/test_oci")
def test_oci_call():
    """
    Quick test route for checking OCI doc-level sentiment.
    """
    if not language_client:
        logger.error("OCI language client not configured.")
        return {"error": "OCI client not configured."}

    text = """Alex:
    Good morning! This is Alex calling from Quick Tech Solutions. ... (long text omitted)"""

    documents = [TextDocument(key="doc1", text=text, language_code="en")]
    sentiment_request = BatchDetectLanguageSentimentsDetails(documents=documents)

    try:
        response = language_client.batch_detect_language_sentiments(
            batch_detect_language_sentiments_details=sentiment_request
        )
        logger.info(f"/test_oci response data: {response.data}")
        return response.data
    except Exception as ex:
        logger.error(f"/test_oci exception: {ex}", exc_info=True)
        return {"error": str(ex)}


# ---------- Run server if executed directly ----------
if __name__ == "__main__":
    logger.info("Starting FastAPI server on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)







