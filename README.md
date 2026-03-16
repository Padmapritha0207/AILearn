# 🧠 AILearn — Learn Any AI Tool Visually

> Transform how you learn AI tools with interactive visual lessons powered by Gemini AI

## 🎯 What is AILearn?

AILearn is an AI-powered visual learning platform that teaches users how to use popular AI tools through interactive lessons, diagrams, videos, quizzes and an AI tutor.

## ✨ Features

- 🧠 **Interactive Architecture** — Animated neural network with clickable nodes (3 difficulty levels)
- 📝 **AI Generated Lessons** — Powered by Gemini 2.5 Flash
- 🎬 **YouTube Videos** — 3 relevant tutorial videos per tool
- 🗺️ **Flow Diagrams** — Step-by-step visual breakdown
- 💻 **Live Code Runner** — Run Python code directly in browser
- ❓ **Quiz Section** — 5 MCQ questions with confetti on perfect score
- 🤖 **Ask AI Tutor** — Real-time chat with Gemini
- ⚡ **Key Facts Ticker** — Scrolling facts like a news ticker
- 🔍 **Search & Filter** — Find tools by name or category

## 🛠️ Tech Stack

### Frontend
- Next.js 15 + TypeScript
- Tailwind CSS
- Pyodide (Python in browser)

### Backend
- Python + FastAPI
- Google Gemini 2.5 Flash (Google GenAI SDK)
- YouTube Data API v3
- Google Cloud Run

## 🤖 AI Tools Covered

1. Gemini API
2. ChatGPT
3. Stable Diffusion
4. GitHub Copilot
5. Midjourney
6. Runway ML
7. LangChain
8. Hugging Face
9. Claude AI

## 🚀 Getting Started

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `backend/.env`:
```
GEMINI_API_KEY=your_gemini_key
YOUTUBE_API_KEY=your_youtube_key
```

## 📁 Project Structure
```
AILearn/
├── backend/
│   ├── app.py
│   ├── .env
│   └── requirements.txt
└── frontend/
    ├── app/
    ├── components/
    └── public/
```

## 🏆 Hackathon

Built for Google Gemini API Developer Competition 2026.

**Category:** Creative Storyteller — Multimodal Interleaved Output

**Requirements Met:**
- ✅ Gemini model (gemini-2.5-flash)
- ✅ Google GenAI SDK
- ✅ Google Cloud Service (Cloud Run)
- ✅ Multimodal output (text + diagrams + videos + code)

## 📄 License
MIT License