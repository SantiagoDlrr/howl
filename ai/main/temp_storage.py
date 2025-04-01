import os
import json
import uuid

# Folder to store all temporary transcript files
TEMP_FOLDER = "temp_data"

# Ensure the folder exists on startup
os.makedirs(TEMP_FOLDER, exist_ok=True)

def save_transcript(transcript_text, summary_text, emotion_text, aspects_list=None):
    """
    Saves the given transcript data to a JSON file and returns its unique ID.
    We use a random UUID, but you could choose any unique scheme.
    """
    transcript_id = str(uuid.uuid4())  # unique identifier
    if aspects_list is None:
        aspects_list = []

    data = {
        "id": transcript_id,
        "transcript_text": transcript_text,
        "summary_text": summary_text,
        "emotion_text": emotion_text,
        "aspects": aspects_list
    }

    file_path = os.path.join(TEMP_FOLDER, f"transcript_{transcript_id}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return transcript_id

def load_transcript(transcript_id):
    """
    Retrieves a transcript from a JSON file by ID. Returns None if not found.
    """
    file_path = os.path.join(TEMP_FOLDER, f"transcript_{transcript_id}.json")
    if not os.path.exists(file_path):
        return None

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data
