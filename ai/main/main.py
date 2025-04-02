# # import sys
# # import os
# # import json
# # import uuid
# # import requests
# # import whisper
# # import uvicorn

# # from fastapi import FastAPI, File, UploadFile, HTTPException
# # from fastapi.middleware.cors import CORSMiddleware
# # from starlette.responses import StreamingResponse



# # import oci
# # from oci.config import from_file
# # from oci.ai_language import AIServiceLanguageClient
# # from oci.ai_language.models import (
# #     BatchDetectLanguageSentimentsDetails,
# #     TextDocument
# # )

# # # Import our temp storage utility
# # from temp_storage import save_transcript, load_transcript

# # # -----------------------------
# # # Pydantic model for Chat Request
# # # -----------------------------
# # from pydantic import BaseModel
# # from typing import List, Dict

# # app = FastAPI()

# # # CORS Setup
# # origins = ["http://localhost:3000"]  # Adjust if needed
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=origins,
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # # LM Studio base URL (or fallback)
# # LMSTUDIO_BASE_URL = os.environ.get("LMSTUDIO_URL") or "http://localhost:1234"

# # # OCI setup
# # oci_config = from_file()
# # language_client = AIServiceLanguageClient(oci_config)

# # def sse_format(message: str) -> str:
# #     """
# #     Helper to format a message as SSE data.
# #     Every SSE event ends with a double newline.
# #     """
# #     return f"data: {message}\n\n"

# # @app.get("/")
# # def read_root():
# #     return {"message": "Hello from FastAPI with Docker Compose"}

# # def generate_summary_with_llm(transcript_text: str) -> str:
# #     """
# #     Send the transcript to your LLM to get a concise summary.
# #     Adjust the prompt, model, and other parameters as needed.
# #     """
# #     endpoint = f"{LMSTUDIO_BASE_URL}/v1/chat/completions"

# #     prompt = (
# #         "You are a helpful assistant. Given the following call transcript, "
# #         "please generate a concise summary that covers key points, overall tone, and important details:\n\n"
# #         f"{transcript_text}\n"
# #     )

# #     payload = {
# #         "model": "YourModelNameOrPath",  # Adjust to match your loaded LM Studio model
# #         "messages": [
# #             {"role": "system", "content": "You are a helpful assistant."},
# #             {"role": "user", "content": prompt}
# #         ],
# #         "temperature": 0.7
# #     }

# #     try:
# #         response = requests.post(endpoint, json=payload, timeout=30)
# #         response.raise_for_status()
# #         data = response.json()
# #         # Extract the summary text
# #         summary_text = data["choices"][0]["message"]["content"]
# #         return summary_text
# #     except Exception as e:
# #         print("ERROR generating summary with LLM:", e, file=sys.stderr)
# #         return "No summary (error calling LLM)."

# # @app.post("/upload", response_class=StreamingResponse)
# # async def upload_audio(file: UploadFile = File(...)):
# #     """
# #     Single endpoint that returns SSE messages during the upload/analysis process.
# #     The frontend must manually consume the streamed data.
# #     """

# #     async def event_generator():
# #         # 1) Inform that file arrived
# #         yield sse_format("audio file received, saving locally...")

# #         # Save file to disk
# #         temp_filename = f"temp_{uuid.uuid4()}_{file.filename}"
# #         with open(temp_filename, "wb") as f:
# #             f.write(await file.read())

# #         yield sse_format("file saved, now transcribing with Whisper...")

# #         # 2) Transcribe using Whisper
# #         model = whisper.load_model("base")  # or "small", "medium", etc.
# #         result = model.transcribe(temp_filename)
# #         transcript_text = result["text"]
# #         transcript_text = """Alex:
# #         Good morning! This is Alex calling from Quick Tech Solutions. How are you doing today?

# #         Jamie:
# #         Hi Alex, I’m doing well, thank you. What can I do for you?

# #         Alex:
# #         That's wonderful to hear, Jamie! I’m excited to share some news about our latest eco-friendly home appliances. 
# #         Our new line not only helps you save on energy costs but also brings a modern touch to your home—all while 
# #         being environmentally responsible.

# #         Jamie:
# #         That sounds really interesting. Can you tell me more about the features?

# #         Alex:
# #         Absolutely! For instance, our smart thermostat adjusts automatically to your schedule, learning your preferences 
# #         to optimize comfort and efficiency. Plus, it comes with a user-friendly app that puts complete control at your 
# #         fingertips. We’re currently offering an exclusive promotion that makes this upgrade even more appealing!

# #         Jamie:
# #         I love the sound of that. It seems like a great way to enhance home comfort and save money.

# #         Alex:
# #         Exactly, Jamie! At Quick Tech Solutions, our goal is to create a win-win situation where you enjoy both luxury 
# #         and savings. Would you be interested in a short, personalized demo to see how these features work in real time?

# #         Jamie:
# #         Yes, that would be great. When can we schedule it?

# #         Alex:
# #         Fantastic! I have some openings later this week. How does Thursday afternoon at 2 PM sound?

# #         Jamie:
# #         That works perfectly for me.

# #         Alex:
# #         Great! I’ll send you an email confirmation with all the details right away. Thank you so much for your time 
# #         today, Jamie. I truly appreciate the opportunity to show you how our innovative products can make a difference 
# #         in your home. I look forward to our demo on Thursday!

# #         Jamie:
# #         Thank you, Alex. I’m looking forward to it as well!

# #         Alex:
# #         Have a wonderful day, Jamie! Talk soon.
# #         """

# #         yield sse_format("whisper transcription complete.")

# #         # 3) Prepare OCI Sentiment request
# #         yield sse_format("reaching OCI services for sentiment analysis...")
# #         documents = [
# #             TextDocument(
# #                 key="doc1",
# #                 text=transcript_text,
# #                 language_code="en"
# #             )
# #         ]
# #         sentiment_request = BatchDetectLanguageSentimentsDetails(documents=documents)

# #         # 4) Call OCI
# #         emotion_text = "Unknown"
# #         aspects_json_str = None
# #         try:
# #             response = language_client.batch_detect_language_sentiments(
# #                 batch_detect_language_sentiments_details=sentiment_request
# #             )
# #             yield sse_format("OCI is analyzing emotion...")

# #             if response.data.documents and len(response.data.documents) > 0:
# #                 doc_result = response.data.documents[0]

# #                 if hasattr(doc_result.document_sentiment, "label"):
# #                     emotion_text = doc_result.document_sentiment.label
# #                 elif doc_result.aspects:
# #                     emotion_text = doc_result.aspects[0].sentiment
# #                 else:
# #                     emotion_text = "No document-level sentiment found"

# #                 if doc_result.aspects:
# #                     aspects_json_str = json.dumps([
# #                         {
# #                             "text": a.text,
# #                             "sentiment": a.sentiment,
# #                             "scores": a.scores
# #                         } for a in doc_result.aspects
# #                     ])
# #         except Exception as ex:
# #             print("DEBUG: Exception calling OCI:", ex, file=sys.stderr)
# #             yield sse_format("OCI sentiment analysis failed.")
# #             emotion_text = "Unknown"

# #         yield sse_format("reaching LLM services for summary generation...")

# #         # 5) Generate the summary via LLM
# #         summary_text = generate_summary_with_llm(transcript_text)
# #         yield sse_format("summary generated by AI.")

# #         # 6) Instead of DB, store in temp JSON
# #         aspects_list = json.loads(aspects_json_str) if aspects_json_str else []
# #         transcript_id = save_transcript(
# #             transcript_text=transcript_text,
# #             summary_text=summary_text,
# #             emotion_text=emotion_text,
# #             aspects_list=aspects_list
# #         )

# #         # Remove temp file
# #         os.remove(temp_filename)

# #         yield sse_format("generating final insights...")

# #         # 7) Finally, yield the JSON with the full data (same SSE approach)
# #         final_payload = {
# #             "id": transcript_id,
# #             "transcript": transcript_text,
# #             "summary": summary_text,
# #             "emotion": emotion_text,
# #             "aspects": aspects_list
# #         }
# #         yield sse_format(json.dumps(final_payload))

# #     # Return a streaming response of SSE data
# #     return StreamingResponse(event_generator(), media_type="text/event-stream")


# # class ChatRequest(BaseModel):
# #     # Note: use string for ID now, since we're using UUIDs
# #     transcript_id: str
# #     messages: List[Dict]

# # # -----------------------------
# # # 2) Chat endpoint
# # # -----------------------------
# # @app.post("/chat")
# # def chat_endpoint(request: ChatRequest):
# #     # Instead of DB, load from temp JSON
# #     transcript_obj = load_transcript(request.transcript_id)
# #     if not transcript_obj:
# #         raise HTTPException(status_code=404, detail="Transcript not found in temp files")

# #     # Build system context
# #     system_prompt = (
# #         "You have the following context:\n\n"
# #         f"Transcript: {transcript_obj['transcript_text']}\n"
# #         f"Summary: {transcript_obj['summary_text']}\n"
# #         f"Emotion: {transcript_obj['emotion_text']}\n\n"
# #         "The user will ask questions or make requests based on this transcript. Provide helpful answers."
# #     )

# #     conversation = [{"role": "system", "content": system_prompt}]
# #     conversation.extend(request.messages)

# #     payload = {
# #         "model": "YourModelNameOrPath",  # Adjust to match your loaded LM Studio model
# #         "messages": conversation,
# #         "temperature": 0.7
# #     }

# #     try:
# #         endpoint = f"{LMSTUDIO_BASE_URL}/v1/chat/completions"
# #         response = requests.post(endpoint, json=payload, timeout=90)
# #         if response.status_code != 200:
# #             return {"error": f"LLM error. Status: {response.status_code}"}
# #         data = response.json()
# #         assistant_reply = data["choices"][0]["message"]["content"]
# #         return {"assistant_message": assistant_reply}
# #     except Exception as e:
# #         return {"error": f"Exception calling LLM: {str(e)}"}


# # # -----------------------------
# # # 3) Test OCI endpoint
# # # -----------------------------
# # @app.get("/test_oci")
# # def test_oci_call():
# #     """
# #     Quick test route to see if OCI returns a normal doc-level sentiment for known text.
# #     """
# #     text = """Alex:
# # Good morning! This is Alex calling from Quick Tech Solutions. How are you doing today?

# # Jamie:
# # Are you seriously asking me that? After everything your company has put me through? I’ve spent hours on hold, been transferred a dozen times, and still have no solution.

# # Alex:
# # I'm really sorry to hear that, Jamie. I’d be happy to look into this and try to resolve it right away. Can you tell me a bit more about what happened?

# # Jamie:
# # What happened is I bought one of your so-called smart dishwashers and it broke after five days. Five. Days. Since then, I’ve been promised a replacement, a refund, a technician—you name it. None of that happened. I’ve been lied to, ignored, and completely disrespected as a customer.

# # Alex:
# # That’s absolutely not the experience we want our customers to have. Let me check your file and—

# # Jamie:
# # Don’t even bother reading off the same script everyone else has. I’ve heard it all. We're escalating it. We'll get back to you. Thank you for your patience. It’s insulting at this point. Just admit you sold me a broken product and don’t want to fix it.

# # Alex:
# # I understand you're upset, and you have every right to be. What you’ve experienced is unacceptable. I’ll personally make sure this gets handled today.

# # Jamie:
# # You said that last week. And the week before. Every time someone says they’re taking care of it, nothing happens. I’m done playing nice. If I don’t get a refund within 48 hours, I’m filing a complaint with the Better Business Bureau, disputing the charge with my bank, and leaving a detailed review everywhere I can.

# # Alex:
# # That’s completely understandable. Let me at least get the process moving again while we're on the call. I’ll also put in a high-priority note so your case gets addressed within the hour.

# # Jamie:
# # I’ll believe it when I see it. So far, all I’ve gotten from Quick Tech Solutions is broken promises and endless apologies that mean nothing.

# # Alex:
# # You shouldn’t have to go through that. I’m genuinely sorry. I’ll stay on top of this until you receive confirmation. You have my word.

# # Jamie:
# # Your word doesn’t mean anything to me unless I see results. I’ve wasted enough time on this disaster.

# # Alex:
# # Understood. You’ll hear back from me directly before the end of the day with a resolution.

# # Jamie:
# # Good. You’d better follow through this time.

# # Alex:
# # Thank you for your time, Jamie. I really do appreciate your patience.

# # Jamie:
# # I’m not being patient. I’m being very clear. Fix it.

# # Alex:
# # Got it. You’ll hear from me soon.

# # Jamie:
# # You’d better. Goodbye.
# # """


# #     documents = [
# #         TextDocument(
# #             key="doc1",
# #             text=text,
# #             language_code="en"
# #         )
# #     ]
# #     sentiment_request = BatchDetectLanguageSentimentsDetails(documents=documents)

# #     try:
# #         response = language_client.batch_detect_language_sentiments(
# #             batch_detect_language_sentiments_details=sentiment_request
# #         )
# #         print("DEBUG /test_oci response:", response.data, file=sys.stderr)
# #         return response.data
# #     except Exception as ex:
# #         print("DEBUG /test_oci exception:", ex, file=sys.stderr)
# #         return {"error": str(ex)}

# # # Run server if executed directly
# # if __name__ == "__main__":
# #     uvicorn.run(app, host="0.0.0.0", port=8000)






# import sys
# import os
# import json
# import uuid
# import requests
# import whisper
# import uvicorn

# from fastapi import FastAPI, File, UploadFile, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from starlette.responses import StreamingResponse

# import oci
# from oci.config import from_file
# from oci.ai_language import AIServiceLanguageClient
# from oci.ai_language.models import (
#     BatchDetectLanguageSentimentsDetails,
#     TextDocument
# )

# # Import our temp storage utility
# from temp_storage import save_transcript, load_transcript

# # -----------------------------
# # Pydantic model for Chat Request
# # -----------------------------
# from pydantic import BaseModel
# from typing import List, Dict

# app = FastAPI()

# # CORS Setup
# origins = ["http://localhost:3000"]  # Adjust if needed
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # LM Studio base URL (or fallback)
# LMSTUDIO_BASE_URL = os.environ.get("LMSTUDIO_URL") or "http://localhost:1234"

# # OCI setup
# oci_config = from_file()
# language_client = AIServiceLanguageClient(oci_config)

# def sse_format(message: str) -> str:
#     """
#     Helper to format a message as SSE data.
#     Every SSE event ends with a double newline.
#     """
#     return f"data: {message}\n\n"

# @app.get("/")
# def read_root():
#     return {"message": "Hello from FastAPI with Docker Compose"}

# def generate_report_with_llm(transcript_text: str) -> dict:
#     """
#     Sends the transcript to your LLM and asks for a full report object in JSON format,
#     containing feedback, keyTopics, emotions, sentiment, output, riskWords, and summary.
#     Returns a Python dict with these fields.
#     """
#     endpoint = f"{LMSTUDIO_BASE_URL}/v1/chat/completions"

#     # The user-facing prompt instructing the LLM to return JSON with the required fields.
#     prompt = (
#         "You are a helpful assistant. You will be given a call transcript. "
#         "Your task is to analyze the conversation and produce a JSON object "
#         "with the following structure (in valid JSON):\n\n"
#         "```\n"
#         "{\n"
#         '  "feedback": "...",\n'
#         '  "keyTopics": ["...","..."],\n'
#         '  "emotions": ["...","..."],\n'
#         '  "sentiment": "...",\n'
#         '  "output": "...",\n'
#         '  "riskWords": "...",\n'
#         '  "summary": "..."\n'
#         "}\n"
#         "```\n\n"
#         "Where:\n"
#         "- feedback: short text describing the customer's or agent's feedback.\n"
#         "- keyTopics: array of main topics or issues discussed.\n"
#         "- emotions: array describing the emotional flow or states.\n"
#         "- sentiment: overall sentiment or tone.\n"
#         "- output: the resolution or next steps.\n"
#         "- riskWords: any risk or cautionary details identified.\n"
#         "- summary: a concise paragraph summarizing the entire call.\n\n"
#         "Please ONLY return valid JSON, with no additional commentary.\n\n"
#         f"Call Transcript:\n{transcript_text}\n"
#     )

#     payload = {
#         "model": "YourModelNameOrPath",  # Adjust to match your loaded LM Studio model
#         "messages": [
#             {"role": "system", "content": "You are a helpful assistant."},
#             {"role": "user", "content": prompt}
#         ],
#         "temperature": 0.7
#     }

#     try:
#         response = requests.post(endpoint, json=payload, timeout=30)
#         response.raise_for_status()
#         data = response.json()

#         # The LLM's JSON string is in data["choices"][0]["message"]["content"]
#         llm_json_str = data["choices"][0]["message"]["content"]

#         # Parse the JSON. Handle exceptions if the LLM doesn't return valid JSON.
#         try:
#             report_dict = json.loads(llm_json_str)
#         except json.JSONDecodeError:
#             # If JSON decoding fails, store raw text or handle it gracefully
#             report_dict = {
#                 "feedback": "LLM returned invalid JSON",
#                 "keyTopics": [],
#                 "emotions": [],
#                 "sentiment": "",
#                 "output": "",
#                 "riskWords": "",
#                 "summary": llm_json_str
#             }

#         return report_dict

#     except Exception as e:
#         print("ERROR generating report with LLM:", e, file=sys.stderr)
#         # Return default placeholders in case of error
#         return {
#             "feedback": "No feedback (error calling LLM).",
#             "keyTopics": [],
#             "emotions": [],
#             "sentiment": "N/A",
#             "output": "N/A",
#             "riskWords": "N/A",
#             "summary": "No summary (error calling LLM)."
#         }

# @app.post("/upload", response_class=StreamingResponse)
# async def upload_audio(file: UploadFile = File(...)):
#     """
#     Single endpoint that returns SSE messages during the upload/analysis process.
#     The frontend must manually consume the streamed data.
#     """
#     async def event_generator():
#         # 1) Inform that file arrived
#         yield sse_format("audio file received, saving locally...")

#         # Save file to disk
#         temp_filename = f"temp_{uuid.uuid4()}_{file.filename}"
#         with open(temp_filename, "wb") as f:
#             f.write(await file.read())

#         yield sse_format("file saved, now transcribing with Whisper...")

#         # 2) Transcribe using Whisper
#         model = whisper.load_model("base")  # or "small", "medium", etc.
#         result = model.transcribe(temp_filename)
#         transcript_text = result["text"]

#         # For testing, you might override transcript_text if needed:
#         transcript_text = """Alex:
#         Good morning! This is Alex calling from Quick Tech Solutions. How are you doing today?

#         Jamie:
#         Hi Alex, I’m doing well, thank you. What can I do for you?

#         Alex:
#         That's wonderful to hear, Jamie! I’m excited to share some news about our latest eco-friendly home appliances. 
#         Our new line not only helps you save on energy costs but also brings a modern touch to your home—all while 
#         being environmentally responsible.

#         Jamie:
#         That sounds really interesting. Can you tell me more about the features?

#         Alex:
#         Absolutely! For instance, our smart thermostat adjusts automatically to your schedule, learning your preferences 
#         to optimize comfort and efficiency. Plus, it comes with a user-friendly app that puts complete control at your 
#         fingertips. We’re currently offering an exclusive promotion that makes this upgrade even more appealing!

#         Jamie:
#         I love the sound of that. It seems like a great way to enhance home comfort and save money.

#         Alex:
#         Exactly, Jamie! At Quick Tech Solutions, our goal is to create a win-win situation where you enjoy both luxury 
#         and savings. Would you be interested in a short, personalized demo to see how these features work in real time?

#         Jamie:
#         Yes, that would be great. When can we schedule it?

#         Alex:
#         Fantastic! I have some openings later this week. How does Thursday afternoon at 2 PM sound?

#         Jamie:
#         That works perfectly for me.

#         Alex:
#         Great! I’ll send you an email confirmation with all the details right away. Thank you so much for your time 
#         today, Jamie. I truly appreciate the opportunity to show you how our innovative products can make a difference 
#         in your home. I look forward to our demo on Thursday!

#         Jamie:
#         Thank you, Alex. I’m looking forward to it as well!

#         Alex:
#         Have a wonderful day, Jamie! Talk soon.
#         """

#         yield sse_format("whisper transcription complete.")

#         # 3) Prepare OCI Sentiment request
#         yield sse_format("reaching OCI services for sentiment analysis...")
#         documents = [
#             TextDocument(
#                 key="doc1",
#                 text=transcript_text,
#                 language_code="en"
#             )
#         ]
#         sentiment_request = BatchDetectLanguageSentimentsDetails(documents=documents)

#         # 4) Call OCI
#         emotion_text = "Unknown"
#         aspects_json_str = None
#         try:
#             response = language_client.batch_detect_language_sentiments(
#                 batch_detect_language_sentiments_details=sentiment_request
#             )
#             yield sse_format("OCI is analyzing emotion...")

#             if response.data.documents and len(response.data.documents) > 0:
#                 doc_result = response.data.documents[0]

#                 if hasattr(doc_result.document_sentiment, "label"):
#                     emotion_text = doc_result.document_sentiment.label
#                 elif doc_result.aspects:
#                     emotion_text = doc_result.aspects[0].sentiment
#                 else:
#                     emotion_text = "No document-level sentiment found"

#                 if doc_result.aspects:
#                     aspects_json_str = json.dumps([
#                         {
#                             "text": a.text,
#                             "sentiment": a.sentiment,
#                             "scores": a.scores
#                         } for a in doc_result.aspects
#                     ])
#         except Exception as ex:
#             print("DEBUG: Exception calling OCI:", ex, file=sys.stderr)
#             yield sse_format("OCI sentiment analysis failed.")
#             emotion_text = "Unknown"

#         yield sse_format("reaching LLM services for full report generation...")

#         # 5) Generate the full report (feedback, keyTopics, emotions, sentiment, etc.)
#         report_dict = generate_report_with_llm(transcript_text)
#         yield sse_format("report generated by AI.")

#         # 6) Save everything. We will not pass 'full_report' here, since
#         #    the temp_storage.save_transcript() doesn't support it by default.
#         transcript_id = save_transcript(
#             transcript_text=transcript_text,
#             summary_text=report_dict.get("summary", ""),
#             emotion_text=report_dict.get("sentiment", ""),
#             aspects_list=json.loads(aspects_json_str) if aspects_json_str else []
#         )

#         # Remove the temp file
#         os.remove(temp_filename)

#         yield sse_format("generating final insights...")

#         # 7) Build final payload to send back via SSE
#         final_payload = {
#             "id": transcript_id,
#             "transcript": transcript_text,
#             "report": report_dict
#         }

#         yield sse_format(json.dumps(final_payload))

#     # Return a streaming response of SSE data
#     return StreamingResponse(event_generator(), media_type="text/event-stream")


# class ChatRequest(BaseModel):
#     # Note: use string for ID now, since we're using UUIDs
#     transcript_id: str
#     messages: List[Dict]

# # -----------------------------
# # 2) Chat endpoint
# # -----------------------------
# @app.post("/chat")
# def chat_endpoint(request: ChatRequest):
#     # Instead of DB, load from temp JSON
#     transcript_obj = load_transcript(request.transcript_id)
#     if not transcript_obj:
#         raise HTTPException(status_code=404, detail="Transcript not found in temp files")

#     # Build system context
#     system_prompt = (
#         "You have the following context:\n\n"
#         f"Transcript: {transcript_obj['transcript_text']}\n"
#         f"Summary: {transcript_obj['summary_text']}\n"
#         f"Emotion: {transcript_obj['emotion_text']}\n\n"
#         "The user will ask questions or make requests based on this transcript. Provide helpful answers."
#     )

#     conversation = [{"role": "system", "content": system_prompt}]
#     conversation.extend(request.messages)

#     payload = {
#         "model": "YourModelNameOrPath",  # Adjust to match your loaded LM Studio model
#         "messages": conversation,
#         "temperature": 0.7
#     }

#     try:
#         endpoint = f"{LMSTUDIO_BASE_URL}/v1/chat/completions"
#         response = requests.post(endpoint, json=payload, timeout=90)
#         if response.status_code != 200:
#             return {"error": f"LLM error. Status: {response.status_code}"}
#         data = response.json()
#         assistant_reply = data["choices"][0]["message"]["content"]
#         return {"assistant_message": assistant_reply}
#     except Exception as e:
#         return {"error": f"Exception calling LLM: {str(e)}"}


# # -----------------------------
# # 3) Test OCI endpoint
# # -----------------------------
# @app.get("/test_oci")
# def test_oci_call():
#     """
#     Quick test route to see if OCI returns a normal doc-level sentiment for known text.
#     """
#     text = """Alex:
#     Good morning! This is Alex calling from Quick Tech Solutions. How are you doing today?

#     Jamie:
#     Are you seriously asking me that? After everything your company has put me through? I’ve spent hours on hold, been transferred a dozen times, and still have no solution.

#     Alex:
#     I'm really sorry to hear that, Jamie. I’d be happy to look into this and try to resolve it right away. Can you tell me a bit more about what happened?

#     Jamie:
#     What happened is I bought one of your so-called smart dishwashers and it broke after five days. Five. Days. Since then, I’ve been promised a replacement, a refund, a technician—you name it. None of that happened. I’ve been lied to, ignored, and completely disrespected as a customer.

#     Alex:
#     That’s absolutely not the experience we want our customers to have. Let me check your file and—

#     Jamie:
#     Don’t even bother reading off the same script everyone else has. I’ve heard it all. We're escalating it. We'll get back to you. Thank you for your patience. It’s insulting at this point. Just admit you sold me a broken product and don’t want to fix it.

#     Alex:
#     I understand you're upset, and you have every right to be. What you’ve experienced is unacceptable. I’ll personally make sure this gets handled today.

#     Jamie:
#     You said that last week. And the week before. Every time someone says they’re taking care of it, nothing happens. I’m done playing nice. If I don’t get a refund within 48 hours, I’m filing a complaint with the Better Business Bureau, disputing the charge with my bank, and leaving a detailed review everywhere I can.

#     Alex:
#     That’s completely understandable. Let me at least get the process moving again while we're on the call. I’ll also put in a high-priority note so your case gets addressed within the hour.

#     Jamie:
#     I’ll believe it when I see it. So far, all I’ve gotten from Quick Tech Solutions is broken promises and endless apologies that mean nothing.

#     Alex:
#     You shouldn’t have to go through that. I’m genuinely sorry. I’ll stay on top of this until you receive confirmation. You have my word.

#     Jamie:
#     Your word doesn’t mean anything to me unless I see results. I’ve wasted enough time on this disaster.

#     Alex:
#     Understood. You’ll hear back from me directly before the end of the day with a resolution.

#     Jamie:
#     Good. You’d better follow through this time.

#     Alex:
#     Thank you for your time, Jamie. I really do appreciate your patience.

#     Jamie:
#     I’m not being patient. I’m being very clear. Fix it.

#     Alex:
#     Got it. You’ll hear from me soon.

#     Jamie:
#     You’d better. Goodbye.
#     """

#     documents = [
#         TextDocument(
#             key="doc1",
#             text=text,
#             language_code="en"
#         )
#     ]
#     sentiment_request = BatchDetectLanguageSentimentsDetails(documents=documents)

#     try:
#         response = language_client.batch_detect_language_sentiments(
#             batch_detect_language_sentiments_details=sentiment_request
#         )
#         print("DEBUG /test_oci response:", response.data, file=sys.stderr)
#         return response.data
#     except Exception as ex:
#         print("DEBUG /test_oci exception:", ex, file=sys.stderr)
#         return {"error": str(ex)}

# # Run server if executed directly
# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)




import sys
import os
import json
import uuid
import requests
import whisper
import uvicorn
import logging # Added for better logging

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
# Assuming temp_storage.py has been updated like:
# def save_transcript(transcript_id, transcript_text, report_data, oci_emotion, oci_aspects): ...
# def load_transcript(transcript_id): -> returns {'id': ..., 'transcript_text': ..., 'report': ..., 'oci_emotion': ..., 'oci_aspects': ...}
from temp_storage import save_transcript, load_transcript

# Pydantic model for Chat Request
from pydantic import BaseModel
from typing import List, Dict, Any # Added Any

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


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
try:
    oci_config = from_file()
    language_client = AIServiceLanguageClient(oci_config)
    logger.info("OCI SDK configured successfully.")
except Exception as e:
    logger.error(f"Failed to configure OCI SDK: {e}")
    language_client = None # Ensure client is None if setup fails

def sse_format(message: str) -> str:
    """
    Helper to format a message as SSE data.
    Every SSE event ends with a double newline.
    """
    return f"data: {message}\n\n"

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI with Docker Compose"}


# --- Updated LLM Interaction ---
def create_llm_prompt(transcript_text: str) -> str:
    """Creates the detailed prompt for the LLM."""
    prompt = f"""
You are an expert call analyst. Based on the provided call transcript, generate a structured report containing the following sections: Feedback, Key Topics, Emotions Detected, Sentiment, Output (Resolution), and Summary.

Analyze the transcript below:
--- START TRANSCRIPT ---
{transcript_text}
--- END TRANSCRIPT ---

Generate your analysis strictly in the following JSON format. Do not include any text before or after the JSON object:

{{
  "feedback": "Provide specific feedback mentioned by the customer or observed about the agent's handling of the call (e.g., agent politeness, process issues, clarity).",
  "keyTopics": [
    "List the main subjects discussed as an array of strings.",
    "Example: 'Billing inquiry', 'Technical support for X product', 'Account update'"
  ],
  "emotions": [
    "Describe the key emotions detected during the call, especially from the customer, as an array of strings.",
    "Example: '1. Customer started frustrated.', '2. Agent showed empathy.', '3. Customer ended call satisfied.'"
  ],
  "sentiment": "Provide an overall sentiment assessment (e.g., Positive, Negative, Neutral, Mixed) followed by a brief justification based on the interaction.",
  "output": "Describe the final resolution or outcome of the call at the point it ended. What are the next steps, if any?",
  "summary": "Provide a concise summary paragraph covering the call's purpose, main discussion points, and outcome."
}}

Ensure the output is a single, valid JSON object.
"""
    return prompt

def generate_call_report_with_llm(transcript_text: str) -> Dict[str, Any]:
    """
    Send the transcript to the LLM to get a structured report (JSON).
    Adjust the model and other parameters as needed.
    """
    endpoint = f"{LMSTUDIO_BASE_URL}/v1/chat/completions"
    prompt = create_llm_prompt(transcript_text)

    # --- Default error structure ---
    default_report = {
        "feedback": "Error: Could not generate feedback.",
        "keyTopics": ["Error: Could not generate key topics."],
        "emotions": ["Error: Could not generate emotions."],
        "sentiment": "Error: Could not generate sentiment.",
        "output": "Error: Could not generate output.",
        "summary": "Error: Could not generate summary."
    }

    payload = {
        "model": "YourModelNameOrPath",  # <<< ADJUST THIS to your actual model name in LM Studio
        "messages": [
            {"role": "system", "content": "You are an expert call analyst generating JSON reports."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.5, # Slightly lower temp might help with structured output
        # Consider adding response_format if your LLM/LM Studio supports it
        # "response_format": { "type": "json_object" } # Example for OpenAI compatible APIs
    }

    try:
        logger.info(f"Sending request to LLM at {endpoint}")
        response = requests.post(endpoint, json=payload, timeout=120) # Increased timeout
        response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
        data = response.json()

        # Extract the LLM's response content
        llm_response_content = data.get("choices", [{}])[0].get("message", {}).get("content")

        if not llm_response_content:
            logger.error("LLM response content is empty.")
            return default_report

        # --- Attempt to parse the JSON response ---
        try:
            # Clean potential markdown code fences
            if llm_response_content.strip().startswith("```json"):
                llm_response_content = llm_response_content.strip()[7:]
            if llm_response_content.strip().endswith("```"):
                llm_response_content = llm_response_content.strip()[:-3]

            logger.debug(f"Attempting to parse LLM JSON response: {llm_response_content}")
            report_data = json.loads(llm_response_content.strip())

            # Basic validation (check if expected keys exist)
            expected_keys = ["feedback", "keyTopics", "emotions", "sentiment", "output", "summary"]
            if not all(key in report_data for key in expected_keys):
                logger.warning("LLM JSON response missing some expected keys.")
                # Fill missing keys with default error messages
                for key in expected_keys:
                    report_data.setdefault(key, f"Error: Missing '{key}' from LLM response.")
                return report_data # Return partially filled data

            logger.info("Successfully parsed structured report from LLM.")
            return report_data

        except json.JSONDecodeError as json_err:
            logger.error(f"Failed to parse LLM response as JSON: {json_err}")
            logger.error(f"Raw LLM response content: {llm_response_content}")
            # Attempt to add the raw text to the summary field in case of parsing failure
            error_report = default_report.copy()
            error_report["summary"] = f"Error parsing LLM response. Raw content: {llm_response_content}"
            return error_report
        except Exception as parse_exc:
             logger.error(f"Unexpected error parsing LLM response: {parse_exc}")
             logger.error(f"Raw LLM response content: {llm_response_content}")
             error_report = default_report.copy()
             error_report["summary"] = f"Unexpected error parsing LLM response. Raw content: {llm_response_content}"
             return error_report


    except requests.exceptions.RequestException as req_err:
        logger.error(f"ERROR generating report with LLM (RequestException): {req_err}")
        return default_report
    except Exception as e:
        logger.error(f"ERROR generating report with LLM (General Exception): {e}", exc_info=True)
        return default_report
# --- End Updated LLM Interaction ---


@app.post("/upload", response_class=StreamingResponse)
async def upload_audio(file: UploadFile = File(...)):
    """
    Single endpoint that returns SSE messages during the upload/analysis process.
    The frontend must manually consume the streamed data.
    """

    async def event_generator():
        # 1) Inform that file arrived
        yield sse_format(json.dumps({"status": "received", "message": "Audio file received, saving locally..."}))

        # Save file to disk
        temp_filename = f"temp_{uuid.uuid4()}_{os.path.splitext(file.filename)[0]}.wav" # Ensure .wav or suitable format
        try:
            with open(temp_filename, "wb") as f:
                content = await file.read()
                f.write(content)
            logger.info(f"Saved uploaded file to {temp_filename}")
            yield sse_format(json.dumps({"status": "saved", "message": "File saved, now transcribing with Whisper..."}))
        except Exception as e:
            logger.error(f"Failed to save uploaded file: {e}")
            yield sse_format(json.dumps({"status": "error", "message": f"Failed to save file: {e}"}))
            return # Stop processing

        # 2) Transcribe using Whisper
        transcript_text = ""
        try:
            logger.info("Loading Whisper model...")
            # Consider loading model outside the request for performance if app runs continuously
            model = whisper.load_model("base")  # or "small", "medium", etc.
            logger.info("Starting transcription...")
            result = model.transcribe(temp_filename, fp16=False) # fp16=False can help compatibility
            transcript_text = result["text"]
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
             
            logger.info("Whisper transcription complete.")
            yield sse_format(json.dumps({"status": "transcribed", "message": "Whisper transcription complete."}))
        except Exception as e:
            logger.error(f"Whisper transcription failed: {e}", exc_info=True)
            yield sse_format(json.dumps({"status": "error", "message": f"Whisper transcription failed: {e}"}))
            # Clean up temp file even on error
            if os.path.exists(temp_filename):
                os.remove(temp_filename)
            return # Stop processing

        # 3) Prepare OCI Sentiment request (if client is available)
        oci_emotion_text = "N/A"
        oci_aspects_list = []
        if language_client:
            yield sse_format(json.dumps({"status": "oci_sentiment_start", "message": "Reaching OCI services for sentiment analysis..."}))
            documents = [
                TextDocument(
                    key="doc1",
                    text=transcript_text,
                    language_code="en" # Or detect language first
                )
            ]
            sentiment_request = BatchDetectLanguageSentimentsDetails(documents=documents)

            # 4) Call OCI
            try:
                response = language_client.batch_detect_language_sentiments(
                    batch_detect_language_sentiments_details=sentiment_request
                )
                logger.info("Received response from OCI Sentiment Analysis.")
                yield sse_format(json.dumps({"status": "oci_sentiment_analyzing", "message": "OCI analyzing sentiment..."}))

                if response.data.documents and len(response.data.documents) > 0:
                    doc_result = response.data.documents[0]

                    # Extract primary sentiment label
                    if hasattr(doc_result, 'document_sentiment') and hasattr(doc_result.document_sentiment, 'label'):
                         oci_emotion_text = doc_result.document_sentiment.label
                    elif doc_result.aspects: # Fallback to first aspect sentiment if no doc level
                         oci_emotion_text = doc_result.aspects[0].sentiment
                    else:
                         oci_emotion_text = "Neutral (default)" # Or other default

                    # Extract aspects
                    if doc_result.aspects:
                        oci_aspects_list = [
                            {
                                "text": a.text,
                                "sentiment": a.sentiment,
                                "scores": a.scores # Be careful: scores might be large/complex
                            } for a in doc_result.aspects
                        ]
                else:
                    logger.warning("OCI Sentiment response contained no document results.")
                    oci_emotion_text = "Unknown (No OCI Data)"

                yield sse_format(json.dumps({"status": "oci_sentiment_complete", "message": "OCI sentiment analysis complete."}))

            except Exception as ex:
                logger.error(f"Exception calling OCI Sentiment: {ex}", exc_info=True)
                yield sse_format(json.dumps({"status": "error", "message": f"OCI sentiment analysis failed: {ex}"}))
                oci_emotion_text = "Error (OCI Call Failed)"
        else:
             logger.warning("OCI language client not available. Skipping OCI sentiment analysis.")
             yield sse_format(json.dumps({"status": "oci_sentiment_skip", "message": "OCI client not configured. Skipping OCI analysis."}))


        # 5) Generate the structured report via LLM
        yield sse_format(json.dumps({"status": "llm_report_start", "message": "Reaching LLM for structured report generation..."}))
        report_data = generate_call_report_with_llm(transcript_text)
        yield sse_format(json.dumps({"status": "llm_report_complete", "message": "Structured report generated by AI."}))

        # 6) Instead of DB, store in temp JSON
        # *Crucially*, the data saved needs to match what `load_transcript` expects.
        # We'll save the transcript text, the LLM's report dictionary, and the OCI results.
        transcript_id = str(uuid.uuid4()) # Generate ID here
        try:
            logger.info(f"Saving transcript {transcript_id} to temporary storage.")
            # --- Pass structured data to save_transcript ---
            # Modify this call based on your actual `save_transcript` signature in temp_storage.py
            # Assuming save_transcript(id, text, report_dict, oci_emotion, oci_aspects)
            save_transcript(
                transcript_id=transcript_id,
                transcript_text=transcript_text,
                report_data=report_data, # Pass the whole dictionary generated by the LLM
                oci_emotion=oci_emotion_text,
                oci_aspects=oci_aspects_list
            )
            logger.info(f"Successfully saved transcript {transcript_id}.")
        except Exception as e:
             logger.error(f"Failed to save transcript {transcript_id}: {e}", exc_info=True)
             yield sse_format(json.dumps({"status": "error", "message": f"Failed to save transcript data: {e}"}))
             # Clean up temp file even on error
             if os.path.exists(temp_filename):
                 os.remove(temp_filename)
             return # Stop processing

        # Remove temp audio file *after* successful processing and saving
        try:
            if os.path.exists(temp_filename):
                os.remove(temp_filename)
                logger.info(f"Removed temporary audio file: {temp_filename}")
        except Exception as e:
            logger.warning(f"Could not remove temporary file {temp_filename}: {e}")


        yield sse_format(json.dumps({"status": "generating_final", "message": "Generating final insights..."}))

        # 7) Finally, yield the JSON with the full data (same SSE approach)
        # Structure this to match the desired frontend format, including the nested 'report'
        final_payload = {
            "id": transcript_id,
            "transcript_text": transcript_text, # Keep raw transcript if needed
            # OCI results (can be used for cross-checking or separate display)
            "emotion": oci_emotion_text,
            "aspects": oci_aspects_list,
            # The structured report generated by the LLM
            "report": report_data # Embed the LLM's generated dictionary here
            # Add other top-level fields from your example if needed (type, duration, rating)
            # These would likely come from elsewhere (metadata, user input?)
            # "type": "Soporte Técnico", # Example placeholder
            # "duration": "7 min", # Example placeholder
            # "rating": 80, # Example placeholder
        }
        logger.info(f"Sending final payload for transcript {transcript_id}")
        # Send the final payload as the last message
        yield sse_format(json.dumps({"status": "complete", "data": final_payload}))

    # Return a streaming response of SSE data
    return StreamingResponse(event_generator(), media_type="text/event-stream")


class ChatRequest(BaseModel):
    transcript_id: str
    messages: List[Dict]

# -----------------------------
# 2) Chat endpoint (Updated Context)
# -----------------------------
@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    logger.info(f"Received chat request for transcript_id: {request.transcript_id}")
    # Instead of DB, load from temp JSON
    # Assuming load_transcript returns a dict like:
    # {'id': ..., 'transcript_text': ..., 'report': {...}, 'oci_emotion': ..., 'oci_aspects': ...}
    transcript_obj = load_transcript(request.transcript_id)
    if not transcript_obj:
        logger.warning(f"Transcript not found for id: {request.transcript_id}")
        raise HTTPException(status_code=404, detail="Transcript not found in temp files")

    # Build system context using the structured report
    report = transcript_obj.get('report', {}) # Get the report dict, default to empty if missing
    transcript_text = transcript_obj.get('transcript_text', 'Transcript not available.')
    oci_emotion = transcript_obj.get('oci_emotion', 'N/A')

    # --- Create more detailed system prompt ---
    system_prompt_parts = [
        "You are a helpful assistant analyzing a call transcript.",
        "Here is the context for the call:",
        f"\n--- Transcript Snippet (start) ---\n{transcript_text[:500]}...\n--- Transcript Snippet (end) ---", # Keep it brief
        f"\n--- Call Analysis Report ---",
        f"Feedback: {report.get('feedback', 'N/A')}",
        f"Key Topics: {'; '.join(report.get('keyTopics', ['N/A']))}",
        f"Detected Emotions: {'; '.join(report.get('emotions', ['N/A']))}",
        f"Overall Sentiment: {report.get('sentiment', 'N/A')}",
        f"Call Output/Resolution: {report.get('output', 'N/A')}",
        f"Summary: {report.get('summary', 'N/A')}",
        f"Additional OCI Sentiment: {oci_emotion}",
        "\nBased on all this information, answer the user's questions concisely."
    ]
    system_prompt = "\n".join(system_prompt_parts)
    # --- End detailed system prompt ---


    conversation = [{"role": "system", "content": system_prompt}]
    # Append user messages, ensuring not too long? (Optional)
    conversation.extend(request.messages)

    payload = {
        "model": "YourModelNameOrPath",  # <<< ADJUST THIS to your actual model name
        "messages": conversation,
        "temperature": 0.7,
        "max_tokens": 300 # Limit response length for chat
    }

    try:
        endpoint = f"{LMSTUDIO_BASE_URL}/v1/chat/completions"
        logger.info(f"Sending chat request to LLM for transcript {request.transcript_id}")
        response = requests.post(endpoint, json=payload, timeout=90) # Keep reasonable timeout
        response.raise_for_status() # Check for HTTP errors

        data = response.json()
        assistant_reply = data.get("choices", [{}])[0].get("message", {}).get("content")

        if not assistant_reply:
             logger.warning(f"LLM returned empty reply for chat request on transcript {request.transcript_id}")
             return {"assistant_message": "Sorry, I couldn't generate a response."}

        logger.info(f"Received chat reply from LLM for transcript {request.transcript_id}")
        return {"assistant_message": assistant_reply}

    except requests.exceptions.RequestException as req_err:
        logger.error(f"Exception calling LLM during chat for {request.transcript_id}: {req_err}")
        raise HTTPException(status_code=503, detail=f"LLM service unavailable: {str(req_err)}")
    except Exception as e:
        logger.error(f"Unexpected exception during chat for {request.transcript_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error during chat: {str(e)}")


# -----------------------------
# 3) Test OCI endpoint (Unchanged, but added logging)
# -----------------------------
@app.get("/test_oci")
def test_oci_call():
    """
    Quick test route to see if OCI returns a normal doc-level sentiment for known text.
    """
    # Text content remains the same...
    text = """Alex:
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

    logger.info("Executing /test_oci endpoint")
    if not language_client:
        logger.error("OCI language client not configured in /test_oci.")
        return {"error": "OCI client not configured."}

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

# Run server if executed directly
if __name__ == "__main__":
    logger.info("Starting FastAPI server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)