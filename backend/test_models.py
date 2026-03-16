import os
from dotenv import load_dotenv
from google import genai

# Load .env variables
current_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path=os.path.join(current_dir, ".env"))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("Error: Missing GEMINI_API_KEY in .env file!")
else:
    client = genai.Client(api_key=GEMINI_API_KEY)
    
    print("Available Models:")
    print("-" * 50)
    
    # Use the client to list models and filter only for ones that support generateContent
    for m in client.models.list():
        if 'generateContent' in m.supported_actions:
            print(f"- {m.name}")
