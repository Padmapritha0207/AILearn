"use client"

import { useState, useMemo } from "react"
import { ToolCard } from "./tool-card"
import { Search, X } from "lucide-react"

const tools = [
  {
    name: "Gemini API",
    description: "Google's most capable AI model for text, code, and multimodal tasks. Build intelligent applications with state-of-the-art AI.",
    category: "LLM",
    slug: "gemini-api",
    bgColor: "#1a73e8",
    textColor: "#ffffff",
    abbreviation: "G",
  },
  {
    name: "ChatGPT",
    description: "OpenAI's conversational AI assistant. Master prompt engineering and unlock the full potential of GPT models.",
    category: "Chatbot",
    slug: "chatgpt",
    bgColor: "#10a37f",
    textColor: "#ffffff",
    abbreviation: "C",
  },
  {
    name: "Stable Diffusion",
    description: "Open-source image generation model. Create stunning visuals from text descriptions with full control.",
    category: "Image Gen",
    slug: "stable-diffusion",
    bgColor: "#6366f1",
    textColor: "#ffffff",
    abbreviation: "SD",
  },
  {
    name: "GitHub Copilot",
    description: "AI-powered code completion and generation. Accelerate your development workflow with intelligent suggestions.",
    category: "Code",
    slug: "github-copilot",
    bgColor: "#238636",
    textColor: "#ffffff",
    abbreviation: "GH",
  },
  {
    name: "Midjourney",
    description: "Premium AI art generation through Discord. Create breathtaking artwork with simple text prompts.",
    category: "Image Gen",
    slug: "midjourney",
    bgColor: "#000000",
    textColor: "#ffffff",
    abbreviation: "MJ",
  },
  {
    name: "Runway ML",
    description: "AI-powered video editing and generation. Transform your video content with cutting-edge machine learning tools.",
    category: "Video",
    slug: "runway-ml",
    bgColor: "#111111",
    textColor: "#00ff88",
    abbreviation: "RW",
  },
  {
    name: "LangChain",
    description: "Framework for developing LLM-powered applications. Build complex AI workflows with modular components.",
    category: "Framework",
    slug: "langchain",
    bgColor: "#1C3A5E",
    textColor: "#ffffff",
    abbreviation: "LC",
  },
  {
    name: "Hugging Face",
    description: "The AI community's home for models, datasets, and applications. Access thousands of pre-trained models.",
    category: "Platform",
    slug: "hugging-face",
    bgColor: "#FF9D00",
    textColor: "#ffffff",
    abbreviation: "HF",
  },
  {
    name: "Claude AI",
    description: "Anthropic's helpful, harmless, and honest AI assistant. Excel at analysis, writing, and complex reasoning tasks.",
    category: "LLM",
    slug: "claude-ai",
    bgColor: "#C17B3E",
    textColor: "#ffffff",
    abbreviation: "CL",
  },
]

const categories = ["All", "LLM", "Chatbot", "Image Gen", "Code", "Video", "Framework", "Platform"]

export function ToolsGrid() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch =
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase()) ||
        tool.category.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        activeCategory === "All" || tool.category === activeCategory

      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory])

  return (
    <section id="tools" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Search Bar */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="relative max-w-xl mx-auto w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search AI tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {search && (
          <p className="text-center text-sm text-muted-foreground mb-6">
            {filtered.length === 0
              ? "No tools found for your search"
              : `Found ${filtered.length} tool${filtered.length !== 1 ? "s" : ""} for "${search}"`}
          </p>
        )}

        {/* Tools Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => (
              <div
                key={tool.slug}
                className="transform transition-all duration-300"
              >
                <ToolCard {...tool} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-4xl">🔍</p>
            <p className="text-lg font-medium text-foreground">No tools found</p>
            <p className="text-sm text-muted-foreground">
              Try searching for "image", "code", "LLM" or a specific tool name
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All") }}
              className="text-sm text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </section>
  )
}