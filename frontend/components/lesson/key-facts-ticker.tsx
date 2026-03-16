"use client"

import { useEffect, useRef } from "react"

const allFacts: Record<string, string[]> = {
  "gemini-api": [
    "🧠 Gemini can process text, images, audio and video simultaneously",
    "⚡ Gemini 2.0 Flash responds in under 1 second",
    "🌍 Gemini supports over 40 languages",
    "📦 Gemini has a 1 million token context window",
    "🔑 Free tier gives 15 requests per minute",
  ],
  "chatgpt": [
    "🚀 ChatGPT reached 1 million users in just 5 days",
    "🧠 GPT-4 has an estimated 1.76 trillion parameters",
    "📝 1 token is roughly 4 characters of text",
    "💬 ChatGPT handles over 10 million queries per day",
    "🌍 Available in over 160 countries worldwide",
  ],
  "stable-diffusion": [
    "🎨 Stable Diffusion generates images in under 10 seconds",
    "💻 Can run on a consumer GPU with 4GB VRAM",
    "🔓 Completely open source and free to use",
    "📸 Trained on over 5 billion image-text pairs",
    "🌊 Uses 50 denoising steps by default",
  ],
  "github-copilot": [
    "⚡ Copilot can write entire functions from a comment",
    "🎓 Free for students with GitHub Education",
    "💻 Supports over 70 programming languages",
    "📈 Developers are 55% faster with Copilot",
    "🔍 Trained on 54 million+ GitHub repositories",
  ],
  "midjourney": [
    "🎨 Over 15 million users create art with Midjourney",
    "⚡ Generates 4 image variations in about 60 seconds",
    "🖼️ v6 produces near-photorealistic images",
    "💬 Accessed entirely through Discord",
    "🌟 Used by professional artists and designers worldwide",
  ],
  "runway-ml": [
    "🎬 Gen-3 creates videos in under 30 seconds",
    "🎥 Used by major Hollywood film studios",
    "⏱️ Can generate up to 10 seconds of video",
    "🖼️ Supports image-to-video generation",
    "🌟 Over 3 million creators use Runway ML",
  ],
  "langchain": [
    "⭐ Over 90,000 GitHub stars and counting",
    "🔧 Supports all major LLM providers",
    "🤖 Agents can use hundreds of built-in tools",
    "🔗 LCEL makes chaining LLMs incredibly simple",
    "📦 Over 1 million weekly npm downloads",
  ],
  "hugging-face": [
    "🤗 Hosts over 500,000 free AI models",
    "👥 Over 5 million registered users worldwide",
    "⭐ Transformers library has 130,000+ GitHub stars",
    "📊 Over 50,000 datasets available for free",
    "🚀 New models added every single day",
  ],
  "claude-ai": [
    "📚 200,000 token context window — reads entire books!",
    "🛡️ Built with Constitutional AI for safety",
    "🏆 Scores highest on coding benchmarks",
    "🧠 Trained using Reinforcement Learning from Human Feedback",
    "✍️ Excels at nuanced analysis and creative writing",
  ],
}

const defaultFacts = (tool: string) => [
  `🚀 ${tool} is used by millions of developers worldwide`,
  `⚡ ${tool} is constantly updated with new features`,
  `🌍 ${tool} has a large and active community`,
  `🔧 ${tool} provides easy-to-use APIs and SDKs`,
  `🏆 ${tool} is trusted by top companies globally`,
]

export function KeyFactsTicker({ tool }: { tool: string }) {
  const facts = allFacts[tool] || defaultFacts(tool)
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ticker = tickerRef.current
    if (!ticker) return

    let position = 0
    let animId: number

    const animate = () => {
      position -= 0.5
      if (Math.abs(position) >= ticker.scrollWidth / 2) {
        position = 0
      }
      ticker.style.transform = `translateX(${position}px)`
      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [tool])

  const duplicatedFacts = [...facts, ...facts]

  return (
    <div className="rounded-xl border border-border bg-card p-4 overflow-hidden">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-bold text-primary uppercase tracking-widest px-2 py-1 rounded bg-primary/10 border border-primary/20 shrink-0">
          ⚡ Key Facts
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="overflow-hidden">
        <div ref={tickerRef} className="flex gap-8 whitespace-nowrap">
          {duplicatedFacts.map((fact, i) => (
            <span key={i} className="text-sm text-muted-foreground shrink-0">
              {fact}
              <span className="mx-4 text-border">|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}