"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatIsItSection } from "./lesson/what-is-it"
import { FlowDiagramSection } from "./lesson/flow-diagram"
import { VideoSection } from "./lesson/video-section"
import { CodeSection } from "./lesson/code-section"
import { ChallengeSection } from "./lesson/challenge-section"
import { ImageSection } from "./lesson/image-section"
import { CodeRunner } from "./lesson/code-runner"
import { QuizSection } from "./lesson/quiz-section"
import { AskAI } from "./lesson/ask-ai"
import { KeyFactsTicker } from "./lesson/key-facts-ticker"

const toolData: Record<string, { name: string; logoUrl?: string; abbreviation?: string }> = {
  "gemini-api": {
    name: "Gemini API",
    logoUrl: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
  },
  "chatgpt": { name: "ChatGPT", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  "stable-diffusion": { name: "Stable Diffusion", abbreviation: "SD" },
  "github-copilot": { name: "GitHub Copilot", abbreviation: "GH" },
  "midjourney": { name: "Midjourney", abbreviation: "MJ" },
  "runway-ml": { name: "Runway ML", abbreviation: "RW" },
  "langchain": { name: "LangChain", abbreviation: "LC" },
  "hugging-face": { name: "Hugging Face", logoUrl: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg" },
  "claude-ai": { name: "Claude AI", abbreviation: "CL" },
}

const loadingSteps = [
  "Asking Gemini...",
  "Building flow diagram...",
  "Finding videos...",
  "Creating challenge...",
]

const fallbackData: Record<string, any> = {
  "gemini-api": {
    what_is_it: "Gemini API is Google's most advanced multimodal AI model, capable of understanding text, code, images, audio, and video. It powers applications from chatbots to complex reasoning systems. Developers use it to build next-generation AI applications.",
    flow_diagram: [
      { step: 1, title: "Get API Key", description: "Sign up at Google AI Studio and create your API key" },
      { step: 2, title: "Install SDK", description: "Install google-genai package in your project" },
      { step: 3, title: "Initialize Client", description: "Configure the client with your API key" },
      { step: 4, title: "Send Request", description: "Send text, image or multimodal request to Gemini" },
      { step: 5, title: "Get Response", description: "Receive and process the AI generated response" },
    ],
    code_example: `from google import genai\n\nclient = genai.Client(api_key="YOUR_API_KEY")\n\nresponse = client.models.generate_content(\n    model="gemini-2.0-flash",\n    contents="Explain AI in simple terms"\n)\nprint(response.text)`,
    challenge: { title: "Build a Q&A Bot", description: "Create a simple question answering bot using Gemini API that can answer questions about any topic", hint: "Start with the code example above and add a loop to keep asking questions" },
    key_facts: ["Gemini is Google's most capable AI model family", "It can process text, images, audio and video simultaneously", "Gemini 2.0 Flash is optimized for speed and efficiency"]
  },
  "chatgpt": {
    what_is_it: "ChatGPT is OpenAI's conversational AI built on GPT architecture. It excels at natural language understanding, creative writing, and coding assistance. Millions of users rely on it daily for productivity and learning.",
    flow_diagram: [
      { step: 1, title: "User Input", description: "User types a message or question" },
      { step: 2, title: "Tokenization", description: "Text is converted into tokens for processing" },
      { step: 3, title: "Model Processing", description: "GPT model processes tokens through neural layers" },
      { step: 4, title: "Response Generation", description: "Model generates response token by token" },
      { step: 5, title: "Output Display", description: "Response is streamed back to the user" },
    ],
    code_example: `from openai import OpenAI\n\nclient = OpenAI(api_key="YOUR_API_KEY")\n\nresponse = client.chat.completions.create(\n  model="gpt-4",\n  messages=[{"role": "user", "content": "Hello!"}]\n)\nprint(response.choices[0].message.content)`,
    challenge: { title: "Build a Chat Application", description: "Create a simple chat application that maintains conversation history using ChatGPT API", hint: "Store messages in a list and pass them all with each API call" },
    key_facts: ["ChatGPT reached 1 million users in just 5 days", "It's trained on data up to a specific cutoff date", "GPT-4 can process both text and images"]
  },
  "stable-diffusion": {
    what_is_it: "Stable Diffusion is an open-source text-to-image AI model that generates stunning images from text descriptions. Unlike proprietary tools, it can run locally on your computer. It gives users complete control over the image generation process.",
    flow_diagram: [
      { step: 1, title: "Text Prompt", description: "User writes a description of the desired image" },
      { step: 2, title: "Tokenize", description: "Text is converted into numerical tokens" },
      { step: 3, title: "Noise Generation", description: "Random noise image is created as starting point" },
      { step: 4, title: "Denoising", description: "Model gradually removes noise guided by text" },
      { step: 5, title: "Final Image", description: "Clean image matching the text prompt is produced" },
    ],
    code_example: `from diffusers import StableDiffusionPipeline\nimport torch\n\npipe = StableDiffusionPipeline.from_pretrained(\n    "runwayml/stable-diffusion-v1-5"\n)\n\nimage = pipe("A beautiful sunset over mountains").images[0]\nimage.save("output.png")`,
    challenge: { title: "Generate Art Series", description: "Create a series of 5 images with the same subject but different artistic styles", hint: "Add style keywords like 'oil painting', 'watercolor', 'photorealistic' to your prompts" },
    key_facts: ["Stable Diffusion can run on consumer GPUs", "It was trained on billions of image-text pairs", "The model is completely open source and free to use"]
  },
  "github-copilot": {
    what_is_it: "GitHub Copilot is an AI-powered code completion tool that suggests entire lines and functions as you type. Trained on billions of lines of code, it understands context deeply. It helps developers write code faster and with fewer bugs.",
    flow_diagram: [
      { step: 1, title: "Write Code", description: "Developer starts writing code in their editor" },
      { step: 2, title: "Context Analysis", description: "Copilot analyzes surrounding code and comments" },
      { step: 3, title: "AI Processing", description: "Codex model generates relevant suggestions" },
      { step: 4, title: "Suggestions Shown", description: "Code completions appear as ghost text" },
      { step: 5, title: "Accept/Reject", description: "Developer accepts with Tab or dismisses suggestion" },
    ],
    code_example: `# GitHub Copilot works inside your IDE\n# Just start typing and it suggests code!\n\n# Function to calculate fibonacci sequence\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(10))`,
    challenge: { title: "Build With Copilot", description: "Use GitHub Copilot to build a simple REST API with at least 3 endpoints using only comments as guidance", hint: "Write detailed comments describing what each function should do before letting Copilot complete it" },
    key_facts: ["GitHub Copilot is free for students with GitHub Education", "It supports over 20 programming languages", "Copilot can write entire functions from just a comment"]
  },
  "midjourney": {
    what_is_it: "Midjourney is a premium AI art generator accessed through Discord that creates stunning visuals from text prompts. Known for its distinctive artistic aesthetic and quality, it makes professional-grade artwork accessible to everyone.",
    flow_diagram: [
      { step: 1, title: "Join Discord", description: "Access Midjourney through Discord server" },
      { step: 2, title: "Write Prompt", description: "Use /imagine command with descriptive text" },
      { step: 3, title: "AI Processing", description: "Midjourney generates 4 image variations" },
      { step: 4, title: "Select & Refine", description: "Upscale or vary your favorite option" },
      { step: 5, title: "Download", description: "Save your final high-resolution artwork" },
    ],
    code_example: `# Midjourney Prompt Examples\n\n# Basic prompt\n/imagine a serene mountain lake at sunset\n\n# Advanced with parameters\n/imagine portrait of a warrior --style raw --ar 16:9 --v 6\n\n# Artistic style\n/imagine city skyline, cyberpunk aesthetic, neon lights --q 2`,
    challenge: { title: "Create a Visual Story", description: "Generate a series of 4 images that tell a coherent story using Midjourney", hint: "Keep consistent style parameters across all prompts for visual coherence" },
    key_facts: ["Midjourney v6 produces photorealistic images", "It uses Discord as its primary interface", "Over 15 million users create art with Midjourney"]
  },
  "runway-ml": {
    what_is_it: "Runway ML is a creative AI platform that brings powerful video generation and editing tools to creators. From text-to-video to background removal, it provides filmmakers with previously impossible capabilities.",
    flow_diagram: [
      { step: 1, title: "Input", description: "Provide text prompt or upload reference media" },
      { step: 2, title: "Select Tool", description: "Choose from video generation, editing or effects" },
      { step: 3, title: "AI Processing", description: "Runway's models process your creative input" },
      { step: 4, title: "Preview", description: "Review generated or edited video content" },
      { step: 5, title: "Export", description: "Download final video in your desired format" },
    ],
    code_example: `import runwayml\n\nclient = runwayml.RunwayML(api_key="YOUR_API_KEY")\n\ntask = client.image_to_video.create(\n    model='gen3a_turbo',\n    prompt_image="https://example.com/image.jpg",\n    prompt_text="The scene comes to life"\n)\nprint(task.id)`,
    challenge: { title: "Create a Short Film", description: "Use Runway ML to create a 10-second video clip from a text description of a scene", hint: "Be very descriptive about camera movement, lighting and subject motion in your prompt" },
    key_facts: ["Runway ML can generate video from just text", "It's used by major film studios and creators", "Gen-2 model can create realistic 4-second clips"]
  },
  "langchain": {
    what_is_it: "LangChain is a powerful framework for building applications powered by large language models. It provides modular components for chains, agents, and memory. Developers use it to create sophisticated AI workflows easily.",
    flow_diagram: [
      { step: 1, title: "Define Chain", description: "Set up sequence of LLM calls and tools" },
      { step: 2, title: "Add Memory", description: "Configure conversation history storage" },
      { step: 3, title: "Connect Tools", description: "Attach search, calculators or custom tools" },
      { step: 4, title: "Run Agent", description: "Agent decides which tools to use automatically" },
      { step: 5, title: "Get Result", description: "Final response combining all tool outputs" },
    ],
    code_example: `from langchain_google_genai import ChatGoogleGenerativeAI\nfrom langchain.chains import ConversationChain\nfrom langchain.memory import ConversationBufferMemory\n\nllm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")\nmemory = ConversationBufferMemory()\nchain = ConversationChain(llm=llm, memory=memory)\n\nresponse = chain.predict(input="Tell me about AI")\nprint(response)`,
    challenge: { title: "Build a Research Agent", description: "Create a LangChain agent that can search the web and summarize findings on any topic", hint: "Use the DuckDuckGoSearchTool and combine it with a summarization chain" },
    key_facts: ["LangChain supports all major LLM providers", "It has over 50,000 GitHub stars", "LangChain agents can use hundreds of built-in tools"]
  },
  "hugging-face": {
    what_is_it: "Hugging Face is the leading open-source AI community platform hosting thousands of models and datasets. It makes discovering, sharing and deploying machine learning solutions easy for everyone.",
    flow_diagram: [
      { step: 1, title: "Find Model", description: "Browse thousands of models on the Hub" },
      { step: 2, title: "Install Library", description: "pip install transformers datasets" },
      { step: 3, title: "Load Model", description: "Use pipeline or AutoModel to load" },
      { step: 4, title: "Run Inference", description: "Pass input data to the model" },
      { step: 5, title: "Get Output", description: "Receive predictions or generated content" },
    ],
    code_example: `from transformers import pipeline\n\n# Sentiment analysis\nclassifier = pipeline("sentiment-analysis")\nresult = classifier("I love building AI apps!")\nprint(result)\n\n# Text generation\ngenerator = pipeline("text-generation", model="gpt2")\ntext = generator("AI is transforming", max_length=50)\nprint(text[0]['generated_text'])`,
    challenge: { title: "Build a Sentiment Analyzer", description: "Create a web app that analyzes the sentiment of product reviews using Hugging Face models", hint: "Use the 'sentiment-analysis' pipeline and test with at least 10 different reviews" },
    key_facts: ["Hugging Face hosts over 350,000 models", "It has over 5 million registered users", "The Transformers library has 100,000+ GitHub stars"]
  },
  "claude-ai": {
    what_is_it: "Claude AI is Anthropic's conversational assistant designed to be helpful, harmless, and honest. It excels at nuanced analysis, creative writing, and complex reasoning while maintaining strong safety guidelines.",
    flow_diagram: [
      { step: 1, title: "User Message", description: "User sends a message or question to Claude" },
      { step: 2, title: "Safety Check", description: "Constitutional AI filters check the request" },
      { step: 3, title: "Processing", description: "Claude's model processes the full context" },
      { step: 4, title: "Response Draft", description: "Model generates a helpful response" },
      { step: 5, title: "Output", description: "Safe and helpful response delivered to user" },
    ],
    code_example: `import anthropic\n\nclient = anthropic.Anthropic(api_key="YOUR_API_KEY")\n\nmessage = client.messages.create(\n    model="claude-3-5-sonnet-20241022",\n    max_tokens=1024,\n    messages=[\n        {"role": "user", "content": "Explain quantum computing simply"}\n    ]\n)\nprint(message.content[0].text)`,
    challenge: { title: "Build a Writing Assistant", description: "Create a writing assistant using Claude API that can improve any text the user provides", hint: "Ask Claude to identify issues and provide specific improvements with explanations" },
    key_facts: ["Claude was trained using Constitutional AI techniques", "It has a 200,000 token context window", "Anthropic focuses heavily on AI safety research"]
  }
}

const defaultFallback = (tool: string) => ({
  what_is_it: `${tool} is an innovative AI tool that's transforming how developers and creators work. It provides powerful capabilities through an easy-to-use API. Thousands of developers use it to build amazing applications.`,
  flow_diagram: [
    { step: 1, title: "Setup", description: `Create account and get API access for ${tool}` },
    { step: 2, title: "Install", description: "Install the required SDK or library" },
    { step: 3, title: "Configure", description: "Set up authentication and configuration" },
    { step: 4, title: "Make Request", description: "Send your first API request" },
    { step: 5, title: "Get Response", description: "Process and display the response" },
  ],
  code_example: `# Getting started with ${tool}\nprint("Hello from ${tool}!")`,
  challenge: {
    title: "Build Your First App",
    description: `Create a simple application that demonstrates the core features of ${tool}`,
    hint: "Start with the official documentation and build something small first"
  },
  key_facts: [
    `${tool} is used by thousands of developers worldwide`,
    `${tool} provides easy-to-use APIs for integration`,
    `${tool} is constantly being updated with new features`
  ]
})

export function LessonContent({ tool }: { tool: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [visibleSections, setVisibleSections] = useState<number[]>([])
  const [lessonData, setLessonData] = useState<any>(null)
  const [videos, setVideos] = useState<any[]>([])

  const toolInfo = toolData[tool] || { name: tool, abbreviation: tool.slice(0, 2).toUpperCase() }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [tool])

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) return prev + 1
        clearInterval(stepInterval)
        return prev
      })
    }, 800)

    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8080/api/lesson/stream/${tool}`)
        if (!response.ok) throw new Error("API failed")

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let data: any = {}

        while (true) {
          const { done, value } = await reader!.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n').filter(line => line.trim())
          for (const line of lines) {
            try {
              const parsed = JSON.parse(line)
              if (parsed.type === 'error') throw new Error(parsed.content)
              if (parsed.type === 'text') data.what_is_it = parsed.content
              if (parsed.type === 'flow_diagram') data.flow_diagram = parsed.content
              if (parsed.type === 'code') data.code_example = parsed.content
              if (parsed.type === 'challenge') data.challenge = parsed.content
              if (parsed.type === 'facts') data.key_facts = parsed.content
            } catch (e) {}
          }
        }

        if (!data.what_is_it) throw new Error("No data received")
        setLessonData(data)

      } catch (error) {
        console.log("Using fallback data")
        setLessonData(fallbackData[tool] || defaultFallback(tool))
      }

      try {
        const videoResponse = await fetch(`http://127.0.0.1:8080/api/videos/${tool}`)
        const videoData = await videoResponse.json()
        setVideos(videoData.videos || [])
      } catch (e) {
        setVideos([])
      }

      setIsLoading(false)
    }

    fetchData()
    return () => clearInterval(stepInterval)
  }, [tool])

  useEffect(() => {
    if (!isLoading) {
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((section, index) => {
        setTimeout(() => {
          setVisibleSections((prev) => [...prev, section])
        }, index * 400)
      })
    }
  }, [isLoading])

  return (
    <div className="pt-24 pb-20">
      {/* ✅ Floating back button — always visible */}
      <Link href="/">
        <button className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg hover:bg-primary/90 transition-all hover:scale-105">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </Link>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        

        <div className="mb-8 flex items-center gap-4">
          {toolInfo.logoUrl ? (
            <img src={toolInfo.logoUrl} alt={toolInfo.name} className="h-12 w-12 object-contain" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-lg font-bold text-primary">
              {toolInfo.abbreviation}
            </div>
          )}
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{toolInfo.name}</h1>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-6 text-lg font-medium text-foreground">
              Generating your visual lesson...
            </p>
            <div className="mt-8 space-y-3">
              {loadingSteps.map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    index <= currentStep ? "opacity-100" : "opacity-30"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : index === currentStep ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <span className="text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && lessonData && (
          <div className="space-y-8">
            {[
              <WhatIsItSection key="what" tool={tool} data={lessonData.what_is_it} />,
              <KeyFactsTicker key="ticker" tool={tool} />,
              <ImageSection key="image" tool={tool} />,
              <FlowDiagramSection key="flow" tool={tool} data={lessonData.flow_diagram} />,
              <VideoSection key="video" tool={tool} videos={videos} />,
              <CodeSection key="code" tool={tool} data={lessonData.code_example} />,
              <CodeRunner key="runner" tool={tool} />,
              <ChallengeSection key="challenge" tool={tool} data={lessonData.challenge} />,
              <QuizSection key="quiz" tool={tool} />,
              <AskAI key="askai" tool={tool} />,
            ].map((section, index) => (
              <div
                key={index}
                className={`transform transition-all duration-500 ${
                  visibleSections.includes(index)
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                {section}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}