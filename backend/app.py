from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
import requests
import json
import time
import os
from dotenv import load_dotenv

from google import genai
from google.genai import types

# ─── Load Environment Variables ────────────────────
# Force it to look in the exact same directory as this current python file
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, ".env")

load_dotenv(dotenv_path=env_path)

# Correctly fetch the keys by their VARIABLE NAMES (left side of the '=' in .env)
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Stop the app from launching if the keys are missing
if not GEMINI_API_KEY:
    raise ValueError("Missing GEMINI_API_KEY in .env file!")
if not YOUTUBE_API_KEY:
    raise ValueError("Missing YOUTUBE_API_KEY in .env file!")

# Initialize the Gemini Client using the secure key
client = genai.Client(api_key=GEMINI_API_KEY)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use the correct free tier model!
MODEL = "gemini-2.5-flash-lite"

# ─── Pydantic Schemas for Gemini ───────────────────────────
class FlowStep(BaseModel):
    step: int
    title: str
    description: str

class ChallengeInfo(BaseModel):
    title: str
    description: str
    hint: str

class LessonSchema(BaseModel):
    what_is_it: str
    flow_diagram: list[FlowStep]
    code_example: str
    challenge: ChallengeInfo
    key_facts: list[str]


# ─── Test Endpoints ───────────────────────────────
@app.get("/")
async def root():
    return {"message": "AILearn Backend is running!"}

@app.get("/test")
async def test():
    return {"status": "working", "message": "Backend is alive!"}

@app.get("/api/test/gemini")
async def test_gemini():
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents="Say hello in one sentence!"
        )
        return {"response": response.text}
    except Exception as e:
        return {"error": str(e)}


# ─── Main Lesson Stream ───────────────────────────
@app.get("/api/lesson/stream/{tool}")
async def stream_lesson(tool: str):
    async def generate():
        try:
            prompt = f"You are AILearn. Create a complete, beginner-friendly lesson about '{tool}'."
            
            response = client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=LessonSchema,
                ),
            )

            data = json.loads(response.text)

            yield json.dumps({
                "type": "text",
                "section": "what_is_it",
                "content": data.get("what_is_it", f"{tool} is a powerful tool.")
            }) + "\n"
            
            time.sleep(0.5)

            yield json.dumps({
                "type": "flow_diagram",
                "section": "how_it_works",
                "content": data.get("flow_diagram", [])
            }) + "\n"
            
            time.sleep(0.5)

            yield json.dumps({
                "type": "code",
                "section": "try_code",
                "content": data.get("code_example", "# Example code here"),
                "language": "python"
            }) + "\n"
            
            time.sleep(0.5)

            yield json.dumps({
                "type": "challenge",
                "section": "challenge",
                "content": data.get("challenge", {})
            }) + "\n"
            
            time.sleep(0.5)

            yield json.dumps({
                "type": "facts",
                "section": "key_facts",
                "content": data.get("key_facts", [])
            }) + "\n"

        except Exception as e:
            yield json.dumps({
                "type": "error",
                "content": str(e)
            }) + "\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


# ─── YouTube Videos ───────────────────────────────
@app.get("/api/videos/{tool}")
async def get_videos(tool: str):
    try:
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            "part": "snippet",
            "q": f"{tool} tutorial beginners",
            "maxResults": 3,
            "type": "video",
            "key": YOUTUBE_API_KEY
        }
        response = requests.get(url, params=params)
        data = response.json()
        videos = []
        for item in data.get("items", []):
            videos.append({
                "id": item["id"]["videoId"],
                "title": item["snippet"]["title"],
                "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                "channel": item["snippet"]["channelTitle"]
            })
        if not videos:
            return {"videos": []}
        return {"videos": videos}
    except Exception as e:
        return {"error": str(e)}


# ─── Ask Question ─────────────────────────────────
@app.get("/api/ask/{tool}")
async def ask_question(tool: str, question: str):
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=f"""You are AILearn, teaching about {tool}.
            Student asks: "{question}"
            Answer in 3-4 simple sentences. No jargon."""
        )
        return {"answer": response.text}
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
