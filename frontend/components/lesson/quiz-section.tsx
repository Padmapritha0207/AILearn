"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react"

const quizData: Record<string, any[]> = {
  "gemini-api": [
    { question: "What type of AI model is Gemini?", options: ["Text-only model", "Multimodal model", "Image-only model", "Audio-only model"], correct: 1 },
    { question: "Which company created Gemini?", options: ["OpenAI", "Anthropic", "Google", "Meta"], correct: 2 },
    { question: "What is the latest fast version of Gemini?", options: ["gemini-1.0", "gemini-pro", "gemini-2.0-flash", "gemini-lite"], correct: 2 },
    { question: "Which SDK should you use for Gemini API?", options: ["google.generativeai (old)", "google.genai (new)", "openai", "anthropic"], correct: 1 },
    { question: "What can Gemini process besides text?", options: ["Only images", "Only audio", "Text only", "Text, images, audio and video"], correct: 3 },
  ],
  "chatgpt": [
    { question: "Who created ChatGPT?", options: ["Google", "Anthropic", "OpenAI", "Meta"], correct: 2 },
    { question: "What does GPT stand for?", options: ["General Purpose Technology", "Generative Pre-trained Transformer", "Global Processing Tool", "Guided Prediction Technology"], correct: 1 },
    { question: "What is a 'token' in ChatGPT?", options: ["A password", "A small chunk of text (~4 chars)", "A full sentence", "An image"], correct: 1 },
    { question: "What parameter controls creativity in ChatGPT?", options: ["max_tokens", "top_p", "temperature", "frequency_penalty"], correct: 2 },
    { question: "What is the context window of GPT-4 Turbo?", options: ["4K tokens", "16K tokens", "32K tokens", "128K tokens"], correct: 3 },
  ],
  "stable-diffusion": [
    { question: "What does Stable Diffusion generate?", options: ["Text", "Audio", "Images from text", "Video"], correct: 2 },
    { question: "What is the starting point of image generation?", options: ["A blank canvas", "Random Gaussian noise", "A rough sketch", "A color palette"], correct: 1 },
    { question: "What model encodes your text prompt?", options: ["GPT", "BERT", "CLIP", "T5"], correct: 2 },
    { question: "What does CFG scale control?", options: ["Image size", "Generation speed", "How closely to follow the prompt", "Color saturation"], correct: 2 },
    { question: "Stable Diffusion is:", options: ["Proprietary and paid", "Open source and free", "Only available via API", "Requires cloud GPU always"], correct: 1 },
  ],
  "github-copilot": [
    { question: "What is GitHub Copilot?", options: ["A git client", "An AI code completion tool", "A code review tool", "A deployment tool"], correct: 1 },
    { question: "Which AI model powers GitHub Copilot?", options: ["GPT-4", "Codex", "Gemini", "Claude"], correct: 1 },
    { question: "How do you accept a Copilot suggestion?", options: ["Enter", "Space", "Tab", "Ctrl+A"], correct: 2 },
    { question: "Copilot is free for:", options: ["Everyone", "Companies only", "Students with GitHub Education", "Pro users only"], correct: 2 },
    { question: "What improves Copilot suggestions the most?", options: ["Fast internet", "Clear comments and variable names", "Dark theme", "More RAM"], correct: 1 },
  ],
  "midjourney": [
    { question: "How do you access Midjourney?", options: ["Website", "Mobile app", "Discord", "VS Code"], correct: 2 },
    { question: "What command starts image generation?", options: ["/create", "/generate", "/imagine", "/draw"], correct: 2 },
    { question: "What does --ar control?", options: ["Art style", "Aspect ratio", "Animation rate", "Artistic rendering"], correct: 1 },
    { question: "What does U1 button do after generation?", options: ["Undo", "Upscale image 1", "Update settings", "Use different model"], correct: 1 },
    { question: "Which model encodes text in Midjourney?", options: ["GPT", "BERT", "CLIP", "T5"], correct: 2 },
  ],
  "runway-ml": [
    { question: "What is Runway ML primarily used for?", options: ["Text generation", "Code completion", "Video generation and editing", "Audio synthesis"], correct: 2 },
    { question: "What is Runway's latest video model?", options: ["Gen-1", "Gen-2", "Gen-3 Alpha", "Gen-4"], correct: 2 },
    { question: "How long can Gen-3 generate videos?", options: ["1 second", "5-10 seconds", "1 minute", "5 minutes"], correct: 1 },
    { question: "What does Act-One do in Runway?", options: ["Creates action scenes", "Drives character expressions from video", "Adds sound effects", "Generates scripts"], correct: 1 },
    { question: "Runway ML is mainly used by:", options: ["Data scientists", "Filmmakers and content creators", "Mobile developers", "Game developers"], correct: 1 },
  ],
  "langchain": [
    { question: "What is LangChain?", options: ["A blockchain platform", "A framework for LLM applications", "A programming language", "A database tool"], correct: 1 },
    { question: "What does LCEL stand for?", options: ["Large Context Embedding Layer", "LangChain Expression Language", "Linear Chain Execution Logic", "Language Chain Event Loop"], correct: 1 },
    { question: "Which operator connects chains in LCEL?", options: ["+ (plus)", "-> (arrow)", "| (pipe)", "& (ampersand)"], correct: 2 },
    { question: "What is an Agent in LangChain?", options: ["A human assistant", "AI that decides which tools to use", "A database connector", "A UI component"], correct: 1 },
    { question: "What does Memory in LangChain do?", options: ["Saves files", "Stores conversation history", "Caches API calls", "Logs errors"], correct: 1 },
  ],
  "hugging-face": [
    { question: "What is Hugging Face?", options: ["A social network", "An AI model hub and community", "A cloud provider", "A programming framework"], correct: 1 },
    { question: "What is the main library for models?", options: ["tensorflow", "pytorch", "transformers", "scikit-learn"], correct: 2 },
    { question: "What does AutoTokenizer do?", options: ["Automatically writes tokens", "Loads the correct tokenizer for any model", "Creates new vocabularies", "Translates text"], correct: 1 },
    { question: "What is fine-tuning?", options: ["Adjusting image quality", "Training a pre-trained model on specific data", "Reducing model size", "Speeding up inference"], correct: 1 },
    { question: "How many models does Hugging Face host?", options: ["1,000+", "10,000+", "100,000+", "500,000+"], correct: 3 },
  ],
  "claude-ai": [
    { question: "Who created Claude AI?", options: ["Google", "OpenAI", "Anthropic", "Meta"], correct: 2 },
    { question: "What is Constitutional AI?", options: ["A legal framework", "Training AI with principles to be safe", "A government regulation", "A coding standard"], correct: 1 },
    { question: "What is Claude's context window size?", options: ["8K tokens", "32K tokens", "100K tokens", "200K tokens"], correct: 3 },
    { question: "What does RLHF stand for?", options: ["Reinforcement Learning from Human Feedback", "Recursive Learning for High Fidelity", "Random Learning from Historical Facts", "Rapid Learning for Human Features"], correct: 0 },
    { question: "Claude is designed to be:", options: ["Fast only", "Helpful, harmless and honest", "Creative only", "Code-focused only"], correct: 1 },
  ],
}

const defaultQuiz = (tool: string) => [
  { question: `What type of tool is ${tool}?`, options: ["A database", "An AI tool", "A framework", "A language"], correct: 1 },
  { question: `Who would benefit most from ${tool}?`, options: ["Only experts", "Only beginners", "Developers and creators", "Only researchers"], correct: 2 },
  { question: `${tool} is primarily used for:`, options: ["Gaming", "AI-powered tasks", "File storage", "Networking"], correct: 1 },
  { question: `How do you get started with ${tool}?`, options: ["Buy hardware", "Get API access and install SDK", "Learn assembly language", "Buy a subscription only"], correct: 1 },
  { question: `${tool} is an example of:`, options: ["Old technology", "Modern AI innovation", "Database software", "Operating system"], correct: 1 },
]

export function QuizSection({ tool }: { tool: string }) {
  const questions = quizData[tool] || defaultQuiz(tool)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [finished, setFinished] = useState(false)

  const score = answers.filter(Boolean).length

  const launchConfetti = () => {
    const colors = ["#4F8EF7", "#9B6DFF", "#00C9A7", "#FF6B6B", "#FFD700", "#FF6B9D"]
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement("div")
      confetti.style.cssText = `
        position: fixed;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -20px;
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
        z-index: 9999;
        pointer-events: none;
        animation: confettiFall ${Math.random() * 2 + 2}s linear forwards;
        transform: rotate(${Math.random() * 360}deg);
      `
      document.body.appendChild(confetti)
      setTimeout(() => confetti.remove(), 4000)
    }
  }

  useEffect(() => {
    if (finished && score === questions.length) {
      launchConfetti()
    }
  }, [finished, score])

  const handleAnswer = (index: number) => {
    if (selected !== null) return
    setSelected(index)
    const isCorrect = index === questions[current].correct
    const newAnswers = [...answers, isCorrect]
    setAnswers(newAnswers)

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent(current + 1)
        setSelected(null)
      } else {
        setFinished(true)
      }
    }, 1200)
  }

  const reset = () => {
    setCurrent(0)
    setSelected(null)
    setAnswers([])
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <Trophy className="h-16 w-16 text-yellow-500" />
          <h2 className="text-2xl font-bold text-foreground">Quiz Complete!</h2>
          <div className="text-6xl font-bold" style={{
            color: score >= 4 ? "#00C9A7" : score >= 3 ? "#FFD700" : "#FF6B6B"
          }}>
            {score}/{questions.length}
          </div>
          <p className="text-muted-foreground text-center">
            {score === 5 ? "🏆 Perfect score! You're an expert!" :
             score >= 4 ? "🌟 Excellent! Almost perfect!" :
             score >= 3 ? "👍 Good job! Keep learning!" :
             score >= 2 ? "📚 Keep studying, you'll get it!" :
             "💪 Don't give up! Review the lesson and try again!"}
          </p>
          <div className="flex gap-2 mt-2">
            {answers.map((correct, i) => (
              correct
                ? <CheckCircle key={i} className="h-6 w-6 text-green-500" />
                : <XCircle key={i} className="h-6 w-6 text-red-500" />
            ))}
          </div>
          <button
            onClick={reset}
            className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const q = questions[current]

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Test Your Knowledge</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Question {current + 1} of {questions.length}
          </p>
        </div>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className="h-2 w-8 rounded-full transition-all"
              style={{
                backgroundColor: i < answers.length
                  ? answers[i] ? "#00C9A7" : "#FF6B6B"
                  : i === current ? "#4F8EF7" : "#1e1e3a"
              }}
            />
          ))}
        </div>
      </div>

      <p className="text-lg font-medium text-foreground mb-6">{q.question}</p>

      <div className="grid gap-3">
        {q.options.map((option: string, i: number) => {
          let style = "border-border bg-muted/30 text-foreground hover:border-primary hover:bg-primary/10"
          if (selected !== null) {
            if (i === q.correct) style = "border-green-500 bg-green-500/10 text-green-400"
            else if (i === selected && i !== q.correct) style = "border-red-500 bg-red-500/10 text-red-400"
            else style = "border-border bg-muted/20 text-muted-foreground opacity-50"
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all ${style}`}
            >
              <span className="mr-3 text-muted-foreground">
                {["A", "B", "C", "D"][i]}.
              </span>
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}