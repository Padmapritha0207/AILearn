"use client"

import { useState, useRef } from "react"
import { Play, Loader2, RotateCcw } from "lucide-react"

const starterCode: Record<string, string> = {
  "gemini-api": `name = "Gemini"\nprint(f"Hello from {name} AI!")\nprint("I can process text, images, audio and video!")\n\nfor i in range(3):\n    print(f"Gemini capability {i+1}: Amazing!")`,
  "chatgpt": `messages = ["Hello!", "How are you?", "Tell me a joke"]\n\nfor i, msg in enumerate(messages):\n    print(f"Message {i+1}: {msg}")\n\nprint("\\nChatGPT processes these messages!")`,
  "stable-diffusion": `prompts = [\n    "A beautiful sunset over mountains",\n    "A futuristic city at night",\n    "A cute robot in a garden"\n]\n\nprint("Stable Diffusion Image Prompts:")\nfor i, prompt in enumerate(prompts, 1):\n    print(f"{i}. {prompt}")`,
  "github-copilot": `def greet(name):\n    return f"Hello, {name}! Welcome to coding!"\n\ndef add_numbers(a, b):\n    return a + b\n\ndef is_even(n):\n    return n % 2 == 0\n\nprint(greet("Developer"))\nprint(f"2 + 3 = {add_numbers(2, 3)}")\nprint(f"Is 4 even? {is_even(4)}")`,
  "midjourney": `styles = ["photorealistic", "oil painting", "watercolor", "cyberpunk"]\nsubject = "a majestic dragon"\n\nprint("Midjourney Prompt Generator:")\nprint("-" * 40)\nfor style in styles:\n    print(f"/imagine {subject}, {style} style")`,
  "runway-ml": `video_effects = ["slow motion", "time lapse", "background removal", "style transfer"]\n\nprint("Runway ML Video Effects:")\nfor i, effect in enumerate(video_effects, 1):\n    print(f"{i}. {effect} - AI powered!")`,
  "langchain": `conversation = []\n\ndef add_message(role, content):\n    conversation.append({"role": role, "content": content})\n    print(f"{role.upper()}: {content}")\n\nadd_message("human", "What is LangChain?")\nadd_message("ai", "LangChain is a framework for LLM apps!")\nadd_message("human", "What can it do?")\nadd_message("ai", "It can chain LLMs, use tools, and more!")\n\nprint(f"\\nTotal messages: {len(conversation)}")`,
  "hugging-face": `models = {\n    "text-classification": "distilbert-base-uncased",\n    "translation": "Helsinki-NLP/opus-mt-en-fr",\n    "summarization": "facebook/bart-large-cnn"\n}\n\nprint("Popular Hugging Face Models:")\nfor task, model in models.items():\n    print(f"\\nTask: {task}")\n    print(f"Model: {model}")`,
  "claude-ai": `features = [\n    "200K token context window",\n    "Constitutional AI training",\n    "Helpful, harmless, honest",\n    "Code analysis and generation",\n    "Creative writing"\n]\n\nprint("Claude AI Key Features:")\nprint("=" * 30)\nfor i, feature in enumerate(features, 1):\n    print(f"{i}. {feature}")\n\nprint("\\nClaude is built by Anthropic!")`
}

const defaultCode = (tool: string) => `print("Learning about ${tool}!")\n\nfeatures = ["Easy to use", "Powerful", "AI-powered"]\n\nfor feature in features:\n    print(f"${tool} is: {feature}")\n\nprint("\\nStart building with ${tool} today!")`

declare global {
  interface Window {
    loadPyodide: any
    pyodide: any
  }
}

export function CodeRunner({ tool }: { tool?: string }) {
  const starter = tool ? (starterCode[tool] || defaultCode(tool)) : `print("Hello World!")`
  const [userCode, setUserCode] = useState(starter)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [pyodideLoading, setPyodideLoading] = useState(false)
  const [pyodideReady, setPyodideReady] = useState(false)
  const pyodideRef = useRef<any>(null)

  // ✅ No auto-load useEffect — Pyodide loads only when user clicks Run

  const loadPyodideIfNeeded = (): Promise<void> => {
    return new Promise((resolve) => {
      if (pyodideRef.current) {
        resolve()
        return
      }

      setPyodideLoading(true)

      if ((window as any).loadPyodide) {
        // Script already loaded, just initialize
        ;(window as any).loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
        }).then((pyodide: any) => {
          pyodideRef.current = pyodide
          setPyodideReady(true)
          setPyodideLoading(false)
          resolve()
        })
        return
      }

      // Load script first
      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
      script.onload = async () => {
        const pyodide = await (window as any).loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
        })
        pyodideRef.current = pyodide
        setPyodideReady(true)
        setPyodideLoading(false)
        resolve()
      }
      script.onerror = () => {
        setPyodideLoading(false)
        resolve()
      }
      document.head.appendChild(script)
    })
  }

  const runCode = async () => {
    setIsRunning(true)
    setHasRun(true)
    setOutput("")

    // Load Pyodide if not ready yet
    if (!pyodideRef.current) {
      setOutput("Loading Python engine... please wait ⏳")
      await loadPyodideIfNeeded()

      if (!pyodideRef.current) {
        setOutput("Failed to load Python engine. Please check your internet connection.")
        setIsRunning(false)
        return
      }
    }

    try {
      pyodideRef.current.runPython(`
import sys
import io
sys.stdout = io.StringIO()
      `)

      pyodideRef.current.runPython(userCode)

      const result = pyodideRef.current.runPython(`
output = sys.stdout.getvalue()
sys.stdout = sys.__stdout__
output
      `)

      setOutput(result || "Code ran successfully with no output!")
    } catch (e: any) {
      setOutput(`Error: ${e.message}`)
    }

    setIsRunning(false)
  }

  const resetCode = () => {
    setUserCode(starter)
    setOutput("")
    setHasRun(false)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Interactive Code Runner
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {pyodideLoading
              ? "⏳ Loading Python engine..."
              : pyodideReady
              ? "✅ Python ready! Edit and run code in your browser!"
              : "Click Run Code to start the Python engine!"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetCode}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded border border-border"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
          <button
            onClick={runCode}
            disabled={isRunning || pyodideLoading}
            className="flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-4 py-1.5 rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isRunning || pyodideLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {pyodideLoading ? "Loading..." : isRunning ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>

      <textarea
        value={userCode}
        onChange={(e) => setUserCode(e.target.value)}
        className="w-full h-48 bg-muted rounded-lg p-4 text-sm font-mono text-foreground border border-border focus:outline-none focus:border-primary resize-none mt-4"
        spellCheck={false}
      />

      {hasRun && (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Output:</p>
          <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 min-h-16 whitespace-pre-wrap">
            {isRunning || pyodideLoading ? (
              <span className="text-muted-foreground">Running...</span>
            ) : (
              output || "No output"
            )}
          </div>
        </div>
      )}
    </div>
  )
}