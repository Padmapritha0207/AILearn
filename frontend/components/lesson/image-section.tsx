"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { X, BookOpen, Lightbulb, Code2 } from "lucide-react"

const nodeDetails: Record<string, Record<string, any>> = {
  "gemini-api": {
    "Your App": {
      title: "Your Application",
      beginner: "This is YOUR code! Your app sends requests to Gemini and receives AI-powered responses back. Think of it like ordering food — you place the order and receive your meal!",
      intermediate: "Your app communicates with Gemini via HTTP REST API calls. You send JSON payloads containing your prompts and receive structured responses with generated content.",
      advanced: "The client SDK handles authentication, request serialization, retry logic, and streaming. You can use async/await patterns for non-blocking I/O operations.",
      example: `from google import genai\nclient = genai.Client(api_key="KEY")\nresponse = client.models.generate_content(\n    model="gemini-2.0-flash",\n    contents="Hello!"\n)\nprint(response.text)`,
      color: "#4F8EF7"
    },
    "Gemini API": {
      title: "Gemini API Gateway",
      beginner: "The Gemini API is Google's door to their AI. You send it your question or image, and it routes your request to the right AI model automatically!",
      intermediate: "The API gateway handles authentication via API keys, rate limiting, load balancing across model instances, and request routing to appropriate model variants.",
      advanced: "Implements OAuth 2.0 and API key authentication. Supports streaming responses via Server-Sent Events. Rate limits: 15 RPM free tier, unlimited with billing.",
      example: `# API Endpoint\nhttps://generativelanguage.googleapis.com\n  /v1beta/models/gemini-2.0-flash:generateContent\n\n# Headers needed\nContent-Type: application/json\nAuthorization: Bearer YOUR_API_KEY`,
      color: "#9B6DFF"
    },
    "Text Model": {
      title: "Text Processing Model",
      beginner: "This part of Gemini reads and understands text. Give it a question in plain English and it understands exactly what you mean and generates a perfect response!",
      intermediate: "The text encoder converts input tokens into high-dimensional embedding vectors using transformer architecture with multi-head self-attention mechanisms.",
      advanced: "Uses SentencePiece tokenization with ~32K token vocabulary. Embeddings are 4096-dimensional vectors processed through 32 transformer layers with rotary position encoding.",
      example: `response = client.models.generate_content(\n    model="gemini-2.0-flash",\n    contents="Explain quantum computing"\n)\nprint(response.text)\n# Output: "Quantum computing uses quantum bits..."`,
      color: "#00C9A7"
    },
    "Vision Model": {
      title: "Vision Processing Model",
      beginner: "This part lets Gemini SEE images! You can send it photos and it can describe them, answer questions about them, or read text in images instantly!",
      intermediate: "The vision encoder uses a ViT (Vision Transformer) architecture that divides images into patches and processes them as tokens alongside text tokens.",
      advanced: "Processes images up to 3072x3072 pixels divided into 16x16 patches. Each patch becomes a 768-dimensional token. Supports up to 16 images per request.",
      example: `import PIL.Image\nimage = PIL.Image.open("photo.jpg")\nresponse = client.models.generate_content(\n    model="gemini-2.0-flash",\n    contents=[image, "What's in this image?"]\n)\nprint(response.text)`,
      color: "#00C9A7"
    },
    "Audio Model": {
      title: "Audio Processing Model",
      beginner: "Gemini can LISTEN! This part processes audio files, transcribes speech, and understands the content of what's being said in over 97 languages!",
      intermediate: "Audio is processed using mel-spectrogram features extracted at 16kHz sampling rate. The model supports multiple languages and handles background noise.",
      advanced: "Supports audio files up to 9.5 hours. Uses custom audio encoder generating embeddings compatible with the text transformer. 97 languages supported.",
      example: `import pathlib\naudio = pathlib.Path("audio.mp3")\nresponse = client.models.generate_content(\n    model="gemini-2.0-flash",\n    contents=[\n        {"mime_type":"audio/mp3",\n         "data": audio.read_bytes()},\n        "Transcribe this audio"\n    ]\n)`,
      color: "#00C9A7"
    },
    "Response": {
      title: "AI Generated Response",
      beginner: "This is Gemini's answer! It can be text, code, structured data, or a description of an image. The final output after all the AI processing!",
      intermediate: "Responses include generated content, safety ratings, finish reason, and usage metadata. Supports streaming for real-time token delivery.",
      advanced: "Response includes candidates array, safety_ratings, usage_metadata (prompt_tokens, candidates_tokens). Supports function calling and structured JSON output.",
      example: `response = client.models.generate_content(...)\n\n# Get the text\nprint(response.text)\n\n# Check safety ratings\nprint(response.candidates[0].safety_ratings)\n\n# Check token usage\nprint(response.usage_metadata.total_token_count)`,
      color: "#FF6B6B"
    },
  },
  "chatgpt": {
    "User Input": {
      title: "User Input",
      beginner: "This is what YOU type to ChatGPT! It reads your message and tries to understand exactly what you want. The clearer your question, the better the answer!",
      intermediate: "Input is formatted as a messages array with roles (system, user, assistant) enabling multi-turn conversations with full context preserved.",
      advanced: "Supports up to 128K context window in GPT-4 Turbo. Input can include text, images (GPT-4V), and structured function definitions for tool calling.",
      example: `messages = [\n    {"role": "system",\n     "content": "You are a helpful assistant"},\n    {"role": "user",\n     "content": "Explain machine learning"}\n]`,
      color: "#4F8EF7"
    },
    "Tokenizer": {
      title: "Tokenizer",
      beginner: "Before ChatGPT reads your text, it breaks it into tiny pieces called 'tokens'. A token is roughly 4 characters or 3/4 of a word. This is how AI reads text!",
      intermediate: "GPT uses Byte-Pair Encoding (BPE) tokenization. Common words become single tokens while rare words are split into subword pieces for efficiency.",
      advanced: "GPT-4 uses cl100k_base tokenizer with 100,256 token vocabulary. 'Hello world' = 2 tokens. Code and special characters may use more tokens per character.",
      example: `import tiktoken\nenc = tiktoken.encoding_for_model("gpt-4")\ntokens = enc.encode("Hello, world!")\nprint(tokens)\n# [9906, 11, 1917, 0]\nprint(len(tokens))  # 4 tokens\n# ~$0.00004 at GPT-4 pricing!`,
      color: "#9B6DFF"
    },
    "GPT Model": {
      title: "GPT Neural Network",
      beginner: "This is ChatGPT's brain! A massive neural network trained on huge amounts of text that learned to predict what word comes next in any situation.",
      intermediate: "GPT uses a decoder-only transformer. It processes all input tokens simultaneously and generates output tokens one at a time autoregressively.",
      advanced: "GPT-4 has ~1.8 trillion parameters across 120 transformer layers. Uses multi-query attention for efficiency. Trained with RLHF for alignment.",
      example: `from openai import OpenAI\nclient = OpenAI(api_key="KEY")\nresponse = client.chat.completions.create(\n    model="gpt-4",\n    messages=[{"role":"user",\n               "content":"Explain AI"}],\n    temperature=0.7,\n    max_tokens=500\n)`,
      color: "#00C9A7"
    },
    "Attention": {
      title: "Attention Mechanism",
      beginner: "Attention helps ChatGPT focus on important words. When answering 'What color is the big red ball?', it focuses on 'red' and 'ball' to answer about color!",
      intermediate: "Multi-head self-attention lets the model attend to different parts of input simultaneously. Each head learns different relationship patterns.",
      advanced: "GPT-4 uses 96 attention heads with 128 dimensions each. Implements rotary position embeddings (RoPE). Flash Attention 2 for memory-efficient computation.",
      example: `# Attention formula:\n# Attention(Q,K,V) = \n#   softmax(QK^T / sqrt(d_k)) * V\n\n# Q = Query: "what am I looking for?"\n# K = Key: "what do I contain?"\n# V = Value: "what do I output?"\n# d_k = dimension of key vectors`,
      color: "#FF6B6B"
    },
    "Layers": {
      title: "Transformer Layers",
      beginner: "ChatGPT has many layers stacked together. Each layer understands your text a little better. More layers = smarter AI with deeper understanding!",
      intermediate: "Each transformer layer: multi-head attention + feed-forward network + layer normalization. Deeper layers capture more abstract concepts.",
      advanced: "GPT-4 has 120 transformer layers. Each layer: attention (96 heads) + FFN (4x hidden size). Residual connections prevent vanishing gradients.",
      example: `# Each transformer layer does:\n# 1. x = LayerNorm(x)\n# 2. x = x + MultiHeadAttention(x)\n# 3. x = LayerNorm(x)\n# 4. x = x + FeedForward(x)\n\n# Repeated 120 times in GPT-4!\n# Each repeat = deeper understanding`,
      color: "#FF6B6B"
    },
    "Response": {
      title: "Generated Response",
      beginner: "ChatGPT's answer! It generates text one word at a time, each word chosen based on everything it has read. Like a very smart autocomplete!",
      intermediate: "Tokens sampled from probability distribution using temperature and top-p parameters. Lower temperature = more focused, higher = more creative.",
      advanced: "Token generation uses nucleus sampling (top-p). Logit bias suppresses specific tokens. Function calling returns structured JSON for tool use.",
      example: `response = client.chat.completions.create(\n    model="gpt-4",\n    messages=[...],\n    temperature=0.7,  # creativity (0-2)\n    top_p=0.9,        # diversity\n    max_tokens=1000\n)\nprint(response.choices[0].message.content)\nprint(response.usage.total_tokens)`,
      color: "#FFD700"
    },
  },
  "stable-diffusion": {
    "Text Prompt": {
      title: "Text Prompt",
      beginner: "The description you write of the image you want! The more detailed your description, the better the result. Include style, mood, colors, and subject!",
      intermediate: "Prompts are processed by CLIP text encoder. Negative prompts specify what to exclude. Prompt weighting adjusts importance of specific words.",
      advanced: "Token limit: 77 tokens per prompt. Textual inversion embeds new concepts. LoRA fine-tunes specific styles. CFG scale 7-15 balances adherence vs creativity.",
      example: `# Good prompt structure:\n"A majestic dragon flying over\n snow-covered mountains at sunset,\n digital art style, 4K, detailed,\n cinematic lighting, trending on artstation"\n\n# Negative prompt:\n"blurry, low quality, distorted"`,
      color: "#4F8EF7"
    },
    "Text Encoder": {
      title: "CLIP Text Encoder",
      beginner: "Converts your text description into numbers the AI understands. Like translating English into the AI's secret mathematical language!",
      intermediate: "CLIP encodes text into 768-dimensional vectors capturing semantic meaning. These vectors guide the entire image generation process.",
      advanced: "OpenAI ViT-L/14 CLIP trained on 400M image-text pairs. Text embeddings guide denoising via cross-attention in U-Net at each diffusion step.",
      example: `from transformers import CLIPTextModel, CLIPTokenizer\n\ntokenizer = CLIPTokenizer.from_pretrained(\n    "openai/clip-vit-large-patch14")\ntext_encoder = CLIPTextModel.from_pretrained(\n    "openai/clip-vit-large-patch14")\n\ntokens = tokenizer("a sunset over mountains")\nembeddings = text_encoder(tokens.input_ids)`,
      color: "#9B6DFF"
    },
    "Random Noise": {
      title: "Random Gaussian Noise",
      beginner: "The starting point! Stable Diffusion begins with a completely random noisy image and gradually cleans it up into your picture. Like starting with TV static!",
      intermediate: "Pure Gaussian noise in latent space (64x64 for 512px). The noise schedule controls how much noise is removed at each denoising step.",
      advanced: "Operates in 4-channel 8x compressed latent space. DDIM, DPM++, Euler schedulers offer speed/quality tradeoffs from 10-150 steps.",
      example: `import torch\n\n# Generate random starting noise\nlatents = torch.randn(\n    (1, 4, 64, 64),  # batch, channels, h, w\n    generator=torch.Generator().manual_seed(42)\n)\n\n# This is what the AI starts with!\n# Just random numbers - no image yet`,
      color: "#FF6B6B"
    },
    "Latent Space": {
      title: "Latent Space",
      beginner: "A compressed mathematical space where images are represented as numbers. Instead of millions of pixels, AI works in a smaller 'idea space' that's much faster!",
      intermediate: "VAE encoder compresses 512x512x3 pixel images into 64x64x4 latent tensors — 48x compression while preserving visual information.",
      advanced: "KL-regularized VAE with perceptual loss. Semantic structure in latent space means nearby points produce similar images. Interpolation creates smooth transitions.",
      example: `from diffusers import AutoencoderKL\nvae = AutoencoderKL.from_pretrained("...")\n\n# Encode image to latent space\nwith torch.no_grad():\n    latent = vae.encode(image).latent_dist.sample()\n    latent = latent * 0.18215  # scaling factor\n\n# 512x512x3 → 64x64x4 (48x smaller!)`,
      color: "#00C9A7"
    },
    "U-Net": {
      title: "U-Net Denoiser",
      beginner: "The main AI brain of Stable Diffusion! It looks at the noisy image AND your text description, then figures out exactly what noise to remove to reveal your image!",
      intermediate: "U-Net with skip connections processes noisy latents conditioned on text embeddings via cross-attention. Predicts noise to subtract at each step.",
      advanced: "860M parameter U-Net with ResNet blocks, spatial transformers. CFG scale 7-15 balances quality vs prompt adherence. 20-50 denoising steps typical.",
      example: `from diffusers import UNet2DConditionModel\n\nunet = UNet2DConditionModel.from_pretrained("...")\n\n# Predict noise to remove\nnoise_pred = unet(\n    latents,           # noisy image\n    timestep,          # how noisy\n    encoder_hidden_states=text_embeddings  # your prompt\n).sample`,
      color: "#FFD700"
    },
    "Image": {
      title: "Generated Image Output",
      beginner: "Your final AI-generated image! After many denoising steps guided by your text, a unique image appears that has never existed before in the world!",
      intermediate: "VAE decoder reconstructs full resolution image from latent. Upscalers like ESRGAN can increase resolution to 4K quality.",
      advanced: "Output: 512x512 base (or 1024x1024 SDXL). Hires fix, tiling, and outpainting extend capabilities. ControlNet adds pose/depth control.",
      example: `# Final step: decode latent to image\nwith torch.no_grad():\n    image = vae.decode(\n        latents / 0.18215\n    ).sample\n\n# Convert to PIL image\nimage = (image / 2 + 0.5).clamp(0, 1)\nimage = transforms.ToPILImage()(image[0])\nimage.save("output.png")`,
      color: "#00C9A7"
    },
  },
  "github-copilot": {
    "Developer": {
      title: "You — The Developer",
      beginner: "That's YOU! You write code in your editor and GitHub Copilot watches what you type and suggests what code should come next. Like a super smart autocomplete!",
      intermediate: "Your coding patterns, comments, and context teach Copilot what you need. Clear variable names and comments dramatically improve suggestion quality.",
      advanced: "Copilot analyzes your entire open file, related files, and imports to understand project context. 55% faster task completion shown in GitHub research.",
      example: `# Just start typing a comment like this:\n# Function to validate email address\n\n# Copilot will suggest:\ndef validate_email(email: str) -> bool:\n    import re\n    pattern = r'^[\\w.-]+@[\\w.-]+\\.\\w+$'\n    return bool(re.match(pattern, email))`,
      color: "#4F8EF7"
    },
    "VS Code": {
      title: "VS Code Editor",
      beginner: "The code editor where you write your programs. GitHub Copilot lives inside VS Code as an extension, watching your code and offering helpful suggestions!",
      intermediate: "Copilot extension streams suggestions from OpenAI API as ghost text. Tab accepts, Escape dismisses, Alt+] cycles through multiple alternatives.",
      advanced: "Language Server Protocol integration gives Copilot access to AST, symbol tables, and type info for context-aware suggestions across 70+ languages.",
      example: `# Install Copilot:\n# 1. Open VS Code\n# 2. Press Ctrl+Shift+X\n# 3. Search "GitHub Copilot"\n# 4. Click Install\n# 5. Sign in with GitHub\n\n# Keyboard shortcuts:\n# Tab = accept suggestion\n# Alt+] = next suggestion\n# Esc = dismiss`,
      color: "#9B6DFF"
    },
    "Copilot AI": {
      title: "GitHub Copilot AI Engine",
      beginner: "The AI brain behind Copilot! Trained on billions of lines of public GitHub code, it learned all the patterns that great programmers use!",
      intermediate: "Based on OpenAI Codex (GPT-3 fine-tuned on code). Processes your current file context and generates statistically likely code completions.",
      advanced: "Codex trained on 54M+ GitHub repos. Uses fill-in-the-middle (FIM) training objective. Copilot X integrates GPT-4 for chat and PR descriptions.",
      example: `# Copilot understands intent from comments:\n\n# Sort list of users by age, oldest first\nusers.sort(key=lambda x: x['age'], reverse=True)\n\n# Connect to PostgreSQL database\nimport psycopg2\nconn = psycopg2.connect(\n    host="localhost", database="mydb",\n    user="admin", password="secret"\n)`,
      color: "#00C9A7"
    },
    "Code Context": {
      title: "Code Context Analysis",
      beginner: "Copilot reads everything in your current file — function names, variable names, and comments — to understand what kind of code you need next!",
      intermediate: "Analyzes surrounding code, open tabs, imports, and file names. More descriptive names = better suggestions. Good naming is crucial!",
      advanced: "Context window processes ~6000 tokens of surrounding code. Semantic similarity search identifies relevant code patterns across your project.",
      example: `# Context clues Copilot uses:\n\nclass BankAccount:  # class name = context\n    def __init__(self, balance: float):\n        self.balance = balance\n    \n    def deposit(self, amount):  # method name\n        # Copilot knows this should add\n        # to balance and validate amount!\n        if amount > 0:\n            self.balance += amount`,
      color: "#FF6B6B"
    },
    "Training Data": {
      title: "Training Data",
      beginner: "Copilot learned from reading billions of lines of real code on GitHub! It learned patterns, best practices, and common solutions from millions of developers!",
      intermediate: "Trained on public GitHub repos filtered for quality. Learned language syntax, common algorithms, API usage patterns, and documentation styles.",
      advanced: "54M+ repositories across 80+ languages. Deduplication, PII removal, and quality filtering applied. Continuously updated with new public code.",
      example: `# Examples Copilot learned from:\n\n# Pattern: Error handling\ntry:\n    result = risky_operation()\nexcept ValueError as e:\n    logger.error(f"Error: {e}")\n    raise\n\n# Pattern: Context manager\nwith open('file.txt', 'r') as f:\n    content = f.read()`,
      color: "#FF6B6B"
    },
    "Suggestion": {
      title: "Code Suggestion",
      beginner: "The grayed-out code that appears as you type! Press Tab to accept it. Copilot can complete single lines, entire functions, or even whole classes!",
      intermediate: "Suggestions appear as ghost text with multiple alternatives available via Alt+]. Copilot Chat offers conversational code generation and explanation.",
      advanced: "Copilot X adds PR descriptions, test generation, and security vulnerability detection. Copilot Workspace plans entire features from issue descriptions.",
      example: `# After typing the function signature:\ndef calculate_bmi(weight_kg: float,\n                  height_m: float) -> float:\n    # Copilot suggests:\n    """\n    Calculate Body Mass Index.\n    BMI = weight(kg) / height(m)^2\n    """\n    return weight_kg / (height_m ** 2)`,
      color: "#FFD700"
    },
  },
  "midjourney": {
    "Text Prompt": {
      title: "Creative Text Prompt",
      beginner: "The description of the artwork you want! Be creative and detailed. Include style, mood, lighting, and subject for amazing results!",
      intermediate: "Prompts support aspect ratios (--ar 16:9), quality (--q 2), version (--v 6), and style (--style raw). Negative prompts use --no.",
      advanced: "Multi-prompts with :: weights (dragon::2 fire::1), --stylize controls artistic interpretation, --chaos adds variety, --seed for reproducibility.",
      example: `# Basic prompt:\n/imagine a wizard's library at midnight\n\n# Advanced prompt:\n/imagine ethereal fairy queen,\n forest background, golden hour,\n oil painting style, intricate details,\n highly detailed --ar 9:16 --v 6 --q 2\n\n# With negative prompt:\n/imagine ... --no blurry, low quality`,
      color: "#4F8EF7"
    },
    "CLIP Model": {
      title: "CLIP Understanding",
      beginner: "CLIP understands BOTH images and text at the same time! It knows 'sunset' looks orange and warm, 'ocean' looks blue. It connects words to visual ideas!",
      intermediate: "Contrastive Language-Image Pre-training aligns text and image in shared embedding space. Guides diffusion toward images matching text semantics.",
      advanced: "ViT-L/14 CLIP with 427M parameters trained on 400M image-text pairs. Text embeddings steer diffusion via cross-attention with guidance scale 5-10.",
      example: `# CLIP knows visual concepts:\n# "sunset" → warm oranges, sky, horizon\n# "gothic" → dark tones, ornate details\n# "photorealistic" → sharp, detailed\n# "impressionist" → soft brush strokes\n\n# Combining concepts:\n"gothic cathedral, golden sunset"\n# = dark + ornate + warm + glowing`,
      color: "#9B6DFF"
    },
    "Style Engine": {
      title: "Aesthetic Style Engine",
      beginner: "Midjourney's secret sauce! It learned the style of thousands of famous artists and art movements. This is what makes Midjourney images so uniquely beautiful!",
      intermediate: "Proprietary aesthetic model trained on curated artwork. --stylize (0-1000) controls how strongly aesthetic preferences are applied.",
      advanced: "Midjourney v6 improved CLIP guidance with aesthetic scoring. Style references (--sref) transfer visual style from reference images to new generations.",
      example: `# Reference specific artists:\n/imagine portrait --sref artist_url\n\n# Style keywords that work great:\n"by Greg Rutkowski"  # fantasy realism\n"Studio Ghibli style"  # anime\n"Bauhaus design"  # geometric\n"daguerreotype"  # old photo style\n"vaporwave aesthetic"  # retro digital`,
      color: "#FF6B6B"
    },
    "Diffusion": {
      title: "Diffusion Process",
      beginner: "The actual image creation! Starts with random noise and slowly removes it while following your text. Like a sculptor revealing a statue from marble!",
      intermediate: "Iterative denoising with 25-50 steps. Each step removes noise guided by CLIP embeddings, gradually revealing coherent imagery.",
      advanced: "Custom diffusion architecture with classifier-free guidance. Upscaling pipeline creates high-resolution details in multiple passes. 60s generation time.",
      example: `# Visualizing the process:\n# Step 1:  ████████  (pure noise)\n# Step 10: ▓▓▓░░░░░  (rough shapes)\n# Step 25: ▓▓▓▓▒▒▒░  (composition)\n# Step 40: ▓▓▓▓▓▓▒▒  (details forming)\n# Step 50: ▓▓▓▓▓▓▓▓  (final image!)\n\n# Each step = remove a bit of noise\n# guided by your text prompt`,
      color: "#00C9A7"
    },
    "Upscaler": {
      title: "AI Upscaler",
      beginner: "Takes the initial small image and makes it much bigger and more detailed! Like zooming in but actually adding real detail, not just blur!",
      intermediate: "Midjourney generates 4 initial 512px variations. Upscalers (U1-U4) enhance selected image to 1024px+ with added detail and sharpness.",
      advanced: "Subtle and Creative upscale options. Redo upscale tries different enhancements. 2x and 4x upscaling for maximum resolution output with V6.",
      example: `# After /imagine generates 4 images:\n# U1 U2 = upscale image 1 or 2\n# U3 U4 = upscale image 3 or 4\n# V1 V2 = create variations of 1 or 2\n# V3 V4 = create variations of 3 or 4\n\n# After upscaling:\n# "Vary (Subtle)" = small changes\n# "Vary (Strong)" = bigger changes\n# "Zoom Out" = expand the canvas`,
      color: "#FFD700"
    },
    "Artwork": {
      title: "Final Artwork",
      beginner: "Your unique AI-generated masterpiece! Every Midjourney image is completely unique. You're creating art with words — a totally new kind of creativity!",
      intermediate: "Final 1024x1024 (or custom aspect ratio) image ready to download. All images available in your Midjourney gallery online.",
      advanced: "Paid plan images are owned by you commercially. Outpainting extends canvas. Vary (Region) edits specific areas. Multi-prompts create complex compositions.",
      example: `# Getting the most from your artwork:\n\n# 1. Download full resolution\n# 2. Open image on website for options\n# 3. Use "Vary (Region)" to fix issues\n# 4. Use "Zoom Out 2x" to see more\n# 5. Save prompt + seed for variations\n\n# --seed 12345 = same style later!`,
      color: "#FF6B6B"
    },
  },
  "runway-ml": {
    "Input Media": {
      title: "Input Media",
      beginner: "What you give to Runway! This could be a text description, an existing video, or a reference image. Runway transforms what you provide into stunning video!",
      intermediate: "Supports text prompts, image references, video uploads for editing/transformation, and style references for consistent visual output.",
      advanced: "Accepts MP4, MOV, GIF for video; JPEG, PNG for images. Resolution up to 4K input. API accepts base64 encoded media or URLs.",
      example: `import requests, base64\n\n# Load image for image-to-video\nwith open("my_image.jpg", "rb") as f:\n    image_data = base64.b64encode(\n        f.read()).decode("utf-8")\n\n# Or use a URL directly:\nimage_url = "https://example.com/img.jpg"`,
      color: "#4F8EF7"
    },
    "Text Prompt": {
      title: "Motion Text Prompt",
      beginner: "Describe the video you want to create or the motion you want to add! Be specific about movement, camera angles, and visual style!",
      intermediate: "Motion prompts describe camera movement (pan left, zoom in), subject actions, and environmental changes over time in the video.",
      advanced: "Prompt engineering for video: specify temporal dynamics, camera trajectories, lighting changes, and subject motion with precise vocabulary.",
      example: `# Great motion prompts:\n\n"Camera slowly zooms in while\n subject turns to face camera,\n soft bokeh background, golden hour"\n\n"Flowers bloom in time-lapse,\n sunlight shifts dramatically,\n cinematic color grade"\n\n"Ocean waves crash in slow motion,\n spray catches the light, 4K detail"`,
      color: "#9B6DFF"
    },
    "Gen-3 Model": {
      title: "Gen-3 Alpha Model",
      beginner: "Runway's most powerful AI! It understands how the physical world works — how objects move, how light behaves, how cameras pan and zoom. Physics-aware AI!",
      intermediate: "Temporal diffusion model trained on millions of video clips. Understands physics, motion continuity, and temporal coherence across frames.",
      advanced: "Transformer-based with temporal attention mechanisms. Trained with video prediction objectives ensuring motion consistency and physical plausibility.",
      example: `import runwayml\n\nclient = runwayml.RunwayML(api_key="KEY")\n\n# Generate video from image + prompt\ntask = client.image_to_video.create(\n    model="gen3a_turbo",\n    prompt_image=image_url,\n    prompt_text="Camera slowly zooms in",\n    duration=5,  # seconds\n    ratio="1280:768"\n)`,
      color: "#00C9A7"
    },
    "Renderer": {
      title: "Video Renderer",
      beginner: "Turns the AI's plan into actual video frames! Takes all the calculations and converts them into smooth video you can watch and download.",
      intermediate: "Renders frames at target resolution (720p/1080p), applies temporal smoothing, color grading, and motion interpolation for smooth 24fps playback.",
      advanced: "GPU-accelerated pipeline with SSIM/LPIPS quality metrics. Frame interpolation from 24fps base. HDR color space support for cinematic output.",
      example: `# Poll for completion:\nimport time\n\ntask_id = task.id\nwhile True:\n    task = client.tasks.retrieve(task_id)\n    if task.status == "SUCCEEDED":\n        print("Video URL:", task.output[0])\n        break\n    elif task.status == "FAILED":\n        print("Error:", task.failure)\n        break\n    time.sleep(5)`,
      color: "#FF6B6B"
    },
    "Video": {
      title: "Generated Video",
      beginner: "Your AI-generated video! Runway creates clips up to 10 seconds that can be combined, extended, or used directly in your projects. Cinema-quality AI video!",
      intermediate: "Output: H.264 MP4, up to 1080p at 24fps. Gen-3 Turbo: 5-10 second clips in ~30 seconds. Multi-motion brush adds different movements to regions.",
      advanced: "Act-One drives character expressions from video reference. Motion Brush controls specific regions independently. Director Mode enables precise cinematic camera control.",
      example: `# Download and use your video:\nimport requests\n\nvideo_url = task.output[0]\nresponse = requests.get(video_url)\n\nwith open("my_video.mp4", "wb") as f:\n    f.write(response.content)\n\nprint("Video saved! Duration: 5 seconds")\nprint("Resolution: 1280x768 (HD)")`,
      color: "#FFD700"
    },
  },
  "langchain": {
    "User Query": {
      title: "User Query",
      beginner: "The question or task you give your LangChain app! LangChain figures out which AI tools and data sources to use to give you the best possible answer.",
      intermediate: "Input parsed and routed to appropriate chain or agent. Query understanding determines whether to use retrieval, tools, or direct LLM generation.",
      advanced: "Input validation with Pydantic models. Query routing logic uses semantic classification. Structured output schemas ensure downstream compatibility.",
      example: `from langchain_google_genai import ChatGoogleGenerativeAI\nfrom langchain.schema import HumanMessage\n\nllm = ChatGoogleGenerativeAI(\n    model="gemini-2.0-flash")\n\n# Simple query\nresponse = llm.invoke(\n    "What is machine learning?")\nprint(response.content)`,
      color: "#4F8EF7"
    },
    "Memory": {
      title: "Conversation Memory",
      beginner: "LangChain can remember previous conversations! Without memory, every message starts fresh. With memory, the AI builds on what you've discussed before!",
      intermediate: "Multiple memory types: ConversationBufferMemory (full history), ConversationSummaryMemory (summarized), VectorStoreRetrieverMemory (semantic search).",
      advanced: "Memory backed by Redis, PostgreSQL, or vector stores. Token-aware truncation prevents context overflow. Entity memory tracks named entities.",
      example: `from langchain.memory import (\n    ConversationBufferMemory)\nfrom langchain.chains import (\n    ConversationChain)\n\nmemory = ConversationBufferMemory()\nchain = ConversationChain(\n    llm=llm, memory=memory)\n\nchain.predict(input="My name is Alice")\nchain.predict(input="What's my name?")\n# Output: "Your name is Alice!"`,
      color: "#9B6DFF"
    },
    "Tools": {
      title: "Agent Tools",
      beginner: "Special abilities the AI can use! Tools include web search, calculator, code runner, and more. Each tool solves a specific type of problem!",
      intermediate: "Tools defined with name, description, and function. Agent decides which tools to use. Custom tools extend capabilities infinitely.",
      advanced: "Tool schemas use JSON Schema for validation. Async tools enable parallel execution. Toolkits bundle related tools (SQL, GitHub, Jira toolkits).",
      example: `from langchain.tools import DuckDuckGoSearchRun\nfrom langchain.agents import (\n    initialize_agent, AgentType)\n\nsearch = DuckDuckGoSearchRun()\ntools = [search]\n\nagent = initialize_agent(\n    tools, llm,\n    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION\n)\n\nagent.run(\n    "What happened in AI news today?")`,
      color: "#9B6DFF"
    },
    "LLM Agent": {
      title: "LLM Agent",
      beginner: "The AI brain that decides what to do! It reads your question, thinks which tools to use, uses them, looks at results, and figures out the final answer!",
      intermediate: "ReAct (Reasoning + Acting) agent iteratively reasons about tool use. OpenAI Functions agent uses structured function calling for reliable tool selection.",
      advanced: "Plan-and-execute agents for complex multi-step tasks. LangGraph enables stateful, cyclic workflows. Custom architectures with LCEL chains.",
      example: `# Agent reasoning process:\n# Question: "What's the weather in Paris?"\n\n# Thought: I need current weather data\n# Action: search("Paris weather today")\n# Observation: "Paris: 22°C, partly cloudy"\n# Thought: I have the answer now\n# Final Answer: "Paris is 22°C and\n#               partly cloudy today!"`,
      color: "#00C9A7"
    },
    "Chain": {
      title: "LangChain Chain",
      beginner: "A sequence of steps the AI follows! Like a recipe — first do this, then that, then this. Chains connect multiple AI operations into one smooth workflow!",
      intermediate: "LCEL (LangChain Expression Language) composes chains with | pipe operator. Parallel chains, conditional branching, and error handling built-in.",
      advanced: "Runnable interface enables streaming, batch processing, and async. RunnableParallel executes multiple chains simultaneously for speed.",
      example: `from langchain.prompts import ChatPromptTemplate\nfrom langchain_core.output_parsers import StrOutputParser\n\n# Build a chain with LCEL pipe operator\nprompt = ChatPromptTemplate.from_template(\n    "Explain {topic} simply")\n\nchain = prompt | llm | StrOutputParser()\n\n# Run the chain\nresult = chain.invoke({"topic": "AI"})\nprint(result)`,
      color: "#FF6B6B"
    },
    "Output": {
      title: "Final Output",
      beginner: "The final answer you receive! LangChain combines results from all tools and AI thinking into one clear, helpful response tailored to your question!",
      intermediate: "Output parsers structure LLM responses into typed objects. Streaming enables real-time display. Callbacks enable logging and monitoring.",
      advanced: "Pydantic output parsers with retry logic. Streaming with async generators. LangSmith integration for production observability and debugging.",
      example: `from langchain.output_parsers import (\n    PydanticOutputParser)\nfrom pydantic import BaseModel\n\nclass MovieReview(BaseModel):\n    title: str\n    rating: float\n    summary: str\n\nparser = PydanticOutputParser(\n    pydantic_object=MovieReview)\n\n# Now LLM output is structured!\nreview = chain.invoke("Review Inception")\nprint(review.rating)  # 9.5`,
      color: "#FFD700"
    },
  },
  "hugging-face": {
    "Input Data": {
      title: "Input Data",
      beginner: "Whatever you feed into the model! Text, images, audio, or code. Hugging Face models can process almost any type of data you can imagine!",
      intermediate: "Data preprocessing varies by modality: text needs tokenization, images need normalization/resizing, audio needs resampling to target rate.",
      advanced: "Datasets library: 50,000+ ready-to-use datasets. DataCollators handle batch creation. Streaming datasets for large-scale processing.",
      example: `from datasets import load_dataset\n\n# Load a dataset directly\ndataset = load_dataset(\n    "imdb", split="train")\n\n# Or use your own data\nmy_data = {\n    "text": ["I love this!", "Bad movie"],\n    "label": [1, 0]\n}\n\nprint(dataset[0])\n# {'text': 'Great film...', 'label': 1}`,
      color: "#4F8EF7"
    },
    "Tokenizer": {
      title: "Tokenizer",
      beginner: "Converts text into numbers the model understands! Every model has its own special tokenizer trained with it. They're not interchangeable between models!",
      intermediate: "AutoTokenizer loads the correct tokenizer automatically. Handles padding, truncation, and special tokens ([CLS], [SEP], [PAD]) automatically.",
      advanced: "BPE, WordPiece, SentencePiece algorithms. Fast tokenizers in Rust via HF Tokenizers library, 10-100x faster than Python versions.",
      example: `from transformers import AutoTokenizer\n\ntokenizer = AutoTokenizer.from_pretrained(\n    "bert-base-uncased")\n\ntext = "Hello, I love AI!"\ntokens = tokenizer(\n    text,\n    padding=True,\n    truncation=True,\n    return_tensors="pt"\n)\nprint(tokens['input_ids'])\n# tensor([[101, 7592, 1010, ...]])`,
      color: "#9B6DFF"
    },
    "Model Hub": {
      title: "Hugging Face Hub",
      beginner: "The world's largest collection of AI models! Over 500,000 free models for any task. Like an app store but for AI — browse, download, and use instantly!",
      intermediate: "Models versioned with Git LFS. Model cards document training data, performance, and limitations. Community creates variations and fine-tunes.",
      advanced: "Hub API for programmatic discovery, upload, and deployment. Safetensors format for secure loading. Spaces for interactive demos.",
      example: `from transformers import pipeline\n\n# One line to use any model!\nclassifier = pipeline(\n    "sentiment-analysis",\n    model="distilbert-base-uncased-finetuned-sst-2-english"\n)\n\nresult = classifier("I love coding!")\nprint(result)\n# [{'label': 'POSITIVE', 'score': 0.9998}]`,
      color: "#FFD700"
    },
    "Fine-tuned": {
      title: "Fine-tuned Models",
      beginner: "Models specially trained for a specific task! Like a doctor who studied general medicine then specialized in cardiology. More specific = more accurate!",
      intermediate: "Fine-tuning updates model weights on task-specific data. PEFT methods like LoRA fine-tune with minimal compute (train only 1% of parameters!).",
      advanced: "LoRA adds low-rank matrices to attention layers. QLoRA enables 4-bit quantized fine-tuning on consumer GPUs. RLHF aligns with human preferences.",
      example: `from transformers import TrainingArguments, Trainer\n\ntraining_args = TrainingArguments(\n    output_dir="./results",\n    num_train_epochs=3,\n    per_device_train_batch_size=16,\n    learning_rate=2e-5,\n)\n\ntrainer = Trainer(\n    model=model,\n    args=training_args,\n    train_dataset=train_data,\n)\ntrainer.train()  # Fine-tune!`,
      color: "#00C9A7"
    },
    "Pre-trained": {
      title: "Pre-trained Base Models",
      beginner: "Giant AI models trained by big companies on massive data! They've already learned general knowledge that you can build on for your specific task!",
      intermediate: "Pre-trained on large unlabeled datasets using self-supervised objectives (masked language modeling, next sentence prediction, contrastive learning).",
      advanced: "BERT: MLM + NSP. GPT: causal LM. T5: span corruption. These objectives create rich representations transferable to downstream tasks.",
      example: `from transformers import AutoModel\n\n# Load pre-trained BERT\nmodel = AutoModel.from_pretrained(\n    "bert-base-uncased")\n\n# Model info:\nprint(f"Parameters: {model.num_parameters():,}")\n# Parameters: 110,000,000 (110M!)\n\n# Trained on 3.3 billion words\n# Wikipedia + BookCorpus datasets`,
      color: "#00C9A7"
    },
    "Prediction": {
      title: "Model Prediction",
      beginner: "The final output! Could be classification, generated text, translation, or detected objects — whatever task you asked for, perfectly formatted!",
      intermediate: "Pipeline API wraps preprocessing, inference, and postprocessing. Supports batch inference for processing multiple inputs simultaneously.",
      advanced: "Logits → probabilities via softmax. Beam search for text generation. Confidence scores for classification. Bounding boxes for detection.",
      example: `# Multiple task examples:\n\n# Translation\ntranslator = pipeline("translation_en_to_fr")\nresult = translator("Hello, how are you?")\n# [{'translation_text': 'Bonjour, comment'}]\n\n# Text generation  \ngenerator = pipeline("text-generation")\ntext = generator("Once upon a time",\n                 max_length=50)\nprint(text[0]['generated_text'])`,
      color: "#FF6B6B"
    },
  },
  "claude-ai": {
    "User Input": {
      title: "User Input",
      beginner: "What you say to Claude! Any question, task, or conversation. Claude is designed to understand nuanced requests and give genuinely helpful, thoughtful responses!",
      intermediate: "Supports text, images (Claude 3+), and documents via API. System prompts set Claude's behavior. Multi-turn conversations maintain full context.",
      advanced: "200K token context window. Supports tool use/function calling, computer use (Claude 3.5), and vision across all major image formats.",
      example: `import anthropic\n\nclient = anthropic.Anthropic(api_key="KEY")\n\nmessage = client.messages.create(\n    model="claude-3-5-sonnet-20241022",\n    max_tokens=1024,\n    system="You are a helpful teacher",\n    messages=[{\n        "role": "user",\n        "content": "Explain neural networks"\n    }]\n)`,
      color: "#4F8EF7"
    },
    "Safety Filter": {
      title: "Constitutional AI Safety",
      beginner: "Claude's built-in safety system! Before responding, it checks if the response is helpful, harmless, and honest. Safety is part of Claude's core, not an afterthought!",
      intermediate: "Multi-stage filtering: input screening, generation-time safety, and output review. Refusal decisions explained with alternatives when possible.",
      advanced: "Interpretability research identifies safety-relevant features in activations. Adversarial training for sleeper agent resistance. Extensive red-teaming.",
      example: `# Claude's safety principles:\n\n# 1. Be helpful\n#    "I'll explain this clearly..."\n\n# 2. Be harmless  \n#    "I can't help with that because..."\n#    "But I can help you with X instead"\n\n# 3. Be honest\n#    "I'm not certain, but I think..."\n#    "I might be wrong about this..."`,
      color: "#FF6B6B"
    },
    "Constitutional AI": {
      title: "Constitutional AI",
      beginner: "Anthropic taught Claude a set of principles (like a constitution). Claude learned to critique its own responses and improve them based on these principles!",
      intermediate: "CAI uses AI feedback instead of only human feedback. Model critiques responses against constitutional principles, then revises to be more helpful.",
      advanced: "Two-phase: supervised learning from constitutional revisions, then RLHF with AI-generated preference data. Reduces need for human labelers on harmful content.",
      example: `# Constitutional AI process:\n\n# Step 1: Generate initial response\n# "Here's how to make explosives..."\n\n# Step 2: Critique against principles\n# "This violates 'be harmless' - revise"\n\n# Step 3: Revised response\n# "I can't provide that, but I can\n#  explain the chemistry of reactions\n#  in a safe, educational context..."`,
      color: "#9B6DFF"
    },
    "Claude Model": {
      title: "Claude Neural Model",
      beginner: "Claude's AI brain! Trained on vast amounts of text. Claude is especially good at nuanced analysis, creative writing, careful reasoning, and following complex instructions!",
      intermediate: "Transformer-based trained with Constitutional AI. Excels at long-context tasks (200K tokens!), coding, math, and complex multi-step instructions.",
      advanced: "Claude 3.5 Sonnet scores highest on coding benchmarks. 200K context = entire codebases. MoE architecture for efficiency at scale.",
      example: `# Claude's impressive capabilities:\n\n# 1. Long context (200K tokens)\n#    Can read entire books and codebases!\n\n# 2. Code (best on HumanEval)\nresponse = client.messages.create(\n    model="claude-3-5-sonnet-20241022",\n    messages=[{\n        "role": "user",\n        "content": "Debug this code: [paste code]"\n    }]\n)`,
      color: "#00C9A7"
    },
    "RLHF": {
      title: "Reinforcement Learning from Human Feedback",
      beginner: "Humans rated Claude's responses as helpful or not, and Claude learned from this! Like a student getting grades and improving based on teacher feedback!",
      intermediate: "Human trainers compare response pairs, training a reward model. PPO optimizes Claude to generate higher-reward responses over time.",
      advanced: "Constitutional AI augments RLHF with AI-generated feedback, reducing human labeling costs. Debate and amplification for superhuman task evaluation.",
      example: `# RLHF training process:\n\n# 1. Generate multiple responses to a prompt\nresponse_A = "Here's a detailed explanation..."\nresponse_B = "Short answer: yes"\n\n# 2. Human rates A > B (more helpful)\n# 3. Train reward model: score(A) > score(B)\n# 4. Use PPO to optimize Claude toward A\n\n# After millions of comparisons:\n# Claude learns what "helpful" means!`,
      color: "#FFD700"
    },
    "Response": {
      title: "Claude's Response",
      beginner: "Claude's carefully crafted answer! Claude aims to be genuinely helpful while being honest about limitations and avoiding harmful outputs. Quality over speed!",
      intermediate: "Streaming via SSE. Response includes stop_reason, usage statistics, and optional tool_use blocks for function calling workflows.",
      advanced: "Configurable max_tokens, temperature, top_p, top_k. Extended thinking mode for complex reasoning. Batch API for 50% cost reduction.",
      example: `print(message.content[0].text)\n# Claude's response here\n\n# Check usage:\nprint(message.usage.input_tokens)   # prompt tokens\nprint(message.usage.output_tokens)  # response tokens\n\n# Streaming example:\nwith client.messages.stream(\n    model="claude-3-5-sonnet-20241022",\n    max_tokens=1024,\n    messages=[{"role":"user","content":"Hi"}]\n) as stream:\n    for text in stream.text_stream:\n        print(text, end="", flush=True)`,
      color: "#4F8EF7"
    },
  },
}

const getNodeDetails = (tool: string, nodeLabel: string) => {
  const toolDetails = nodeDetails[tool]
  if (toolDetails && toolDetails[nodeLabel]) {
    return toolDetails[nodeLabel]
  }
  return {
    title: nodeLabel,
    beginner: `${nodeLabel} is a key component in ${tool}'s architecture that processes and transforms data through the AI pipeline.`,
    intermediate: `In ${tool}'s system, ${nodeLabel} applies learned transformations using neural network layers optimized for this specific task.`,
    advanced: `${nodeLabel} implements attention mechanisms, normalization layers, and residual connections to transform input representations efficiently.`,
    example: `# ${nodeLabel} in ${tool}\n# This component processes data\n# and passes it to the next layer\noutput = ${nodeLabel.toLowerCase().replace(/\s+/g, '_')}(input_data)`,
    color: "#4F8EF7"
  }
}

const toolConfigs: Record<string, any> = {
  "gemini-api": {
    title: "Gemini API Architecture",
    subtitle: "👆 Click any glowing node to learn what it does!",
    nodes: [
      { id: 1, x: 80, y: 180, label: "Your App", color: "#4F8EF7", icon: "💻" },
      { id: 2, x: 260, y: 180, label: "Gemini API", color: "#9B6DFF", icon: "🔑" },
      { id: 3, x: 460, y: 80, label: "Text Model", color: "#00C9A7", icon: "📝" },
      { id: 4, x: 460, y: 180, label: "Vision Model", color: "#00C9A7", icon: "👁️" },
      { id: 5, x: 460, y: 280, label: "Audio Model", color: "#00C9A7", icon: "🎵" },
      { id: 6, x: 650, y: 180, label: "Response", color: "#FF6B6B", icon: "✨" },
    ],
    edges: [
      { from: 1, to: 2 }, { from: 2, to: 3 },
      { from: 2, to: 4 }, { from: 2, to: 5 },
      { from: 3, to: 6 }, { from: 4, to: 6 }, { from: 5, to: 6 },
    ]
  },
  "chatgpt": {
    title: "ChatGPT Architecture",
    subtitle: "👆 Click any glowing node to learn what it does!",
    nodes: [
      { id: 1, x: 80, y: 180, label: "User Input", color: "#4F8EF7", icon: "👤" },
      { id: 2, x: 240, y: 180, label: "Tokenizer", color: "#9B6DFF", icon: "🔤" },
      { id: 3, x: 400, y: 180, label: "GPT Model", color: "#00C9A7", icon: "🧠" },
      { id: 4, x: 560, y: 100, label: "Attention", color: "#FF6B6B", icon: "👀" },
      { id: 5, x: 560, y: 260, label: "Layers", color: "#FF6B6B", icon: "📚" },
      { id: 6, x: 700, y: 180, label: "Response", color: "#FFD700", icon: "💬" },
    ],
    edges: [
      { from: 1, to: 2 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 3, to: 5 },
      { from: 4, to: 6 }, { from: 5, to: 6 },
    ]
  },
  "stable-diffusion": {
    title: "Stable Diffusion Architecture",
    subtitle: "👆 Click any glowing node to learn what it does!",
    nodes: [
      { id: 1, x: 80, y: 180, label: "Text Prompt", color: "#4F8EF7", icon: "📝" },
      { id: 2, x: 240, y: 180, label: "Text Encoder", color: "#9B6DFF", icon: "🔤" },
      { id: 3, x: 400, y: 90, label: "Random Noise", color: "#FF6B6B", icon: "🌊" },
      { id: 4, x: 400, y: 270, label: "Latent Space", color: "#00C9A7", icon: "🌌" },
      { id: 5, x: 560, y: 180, label: "U-Net", color: "#FFD700", icon: "🧠" },
      { id: 6, x: 700, y: 180, label: "Image", color: "#00C9A7", icon: "🖼️" },
    ],
    edges: [
      { from: 1, to: 2 }, { from: 2, to: 5 },
      { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 6 },
    ]
  },
  "github-copilot": {
    title: "GitHub Copilot Architecture",
    subtitle: "👆 Click any glowing node to learn what it does!",
    nodes: [
      { id: 1, x: 80, y: 180, label: "Developer", color: "#4F8EF7", icon: "👨‍💻" },
      { id: 2, x: 240, y: 180, label: "VS Code", color: "#9B6DFF", icon: "📝" },
      { id: 3, x: 400, y: 180, label: "Copilot AI", color: "#00C9A7", icon: "🤖" },
      { id: 4, x: 560, y: 100, label: "Code Context", color: "#FF6B6B", icon: "📋" },
      { id: 5, x: 560, y: 260, label: "Training Data", color: "#FF6B6B", icon: "📚" },
      { id: 6, x: 700, y: 180, label: "Suggestion", color: "#FFD700", icon: "✨" },
    ],
    edges: [
      { from: 1, to: 2 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 3, to: 5 },
      { from: 4, to: 6 }, { from: 5, to: 6 },
    ]
  },
  "midjourney": {
    title: "Midjourney Architecture",
    subtitle: "👆 Click any glowing node to learn what it does!",
    nodes: [
      { id: 1, x: 80, y: 180, label: "Text Prompt", color: "#4F8EF7", icon: "✍️" },
      { id: 2, x: 240, y: 180, label: "CLIP Model", color: "#9B6DFF", icon: "📎" },
      { id: 3, x: 400, y: 90, label: "Style Engine", color: "#FF6B6B", icon: "🎨" },
      { id: 4, x: 400, y: 270, label: "Diffusion", color: "#00C9A7", icon: "🌊" },
      { id: 5, x: 560, y: 180, label: "Upscaler", color: "#FFD700", icon: "⬆️" },
      { id: 6, x: 700, y: 180, label: "Artwork", color: "#FF6B6B", icon: "🖼️" },
    ],
    edges: [
      { from: 1, to: 2 }, { from: 2, to: 3 },
      { from: 2, to: 4 }, { from: 3, to: 5 },
      { from: 4, to: 5 }, { from: 5, to: 6 },
    ]
  },
  "runway-ml": {
    title: "Runway ML Architecture",
    subtitle: "👆 Click any glowing node to learn what it does!",
    nodes: [
      { id: 1, x: 80, y: 180, label: "Input Media", color: "#4F8EF7", icon: "🎬" },
      { id: 2, x: 240, y: 100, label: "Text Prompt", color: "#9B6DFF", icon: "📝" },
      { id: 3, x: 240, y: 260, label: "Reference", color: "#9B6DFF", icon: "🖼️" },
      { id: 4, x: 430, y: 180, label: "Gen-3 Model", color: "#00C9A7", icon: "🧠" },
      { id: 5, x: 590, y: 180, label: "Renderer", color: "#FF6B6B", icon: "⚙️" },
      { id: 6, x: 720, y: 180, label: "Video", color: "#FFD700", icon: "🎥" },
    ],
    edges: [
      { from: 1, to: 4 }, { from: 2, to: 4 },
      { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 6 },
    ]
  },
  "langchain": {
    title: "LangChain Architecture",
    subtitle: "👆 Click any glowing node to learn what it does!",
    nodes: [
      { id: 1, x: 80, y: 180, label: "User Query", color: "#4F8EF7", icon: "❓" },
      { id: 2, x: 240, y: 100, label: "Memory", color: "#9B6DFF", icon: "🧠" },
      { id: 3, x: 240, y: 260, label: "Tools", color: "#9B6DFF", icon: "🔧" },
      { id: 4, x: 420, y: 180, label: "LLM Agent", color: "#00C9A7", icon: "🤖" },
      { id: 5, x: 580, y: 180, label: "Chain", color: "#FF6B6B", icon: "⛓️" },
      { id: 6, x: 720, y: 180, label: "Output", color: "#FFD700", icon: "✅" },
    ],
    edges: [
      { from: 1, to: 4 }, { from: 2, to: 4 },
      { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 6 },
    ]
  },
  "hugging-face": {
    title: "Hugging Face Architecture",
    subtitle: "👆 Click any glowing node to learn what it does!",
    nodes: [
      { id: 1, x: 80, y: 180, label: "Input Data", color: "#4F8EF7", icon: "📊" },
      { id: 2, x: 240, y: 180, label: "Tokenizer", color: "#9B6DFF", icon: "✂️" },
      { id: 3, x: 400, y: 180, label: "Model Hub", color: "#FFD700", icon: "🤗" },
      { id: 4, x: 560, y: 100, label: "Fine-tuned", color: "#00C9A7", icon: "🎯" },
      { id: 5, x: 560, y: 260, label: "Pre-trained", color: "#00C9A7", icon: "📦" },
      { id: 6, x: 700, y: 180, label: "Prediction", color: "#FF6B6B", icon: "🎉" },
    ],
    edges: [
      { from: 1, to: 2 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 3, to: 5 },
      { from: 4, to: 6 }, { from: 5, to: 6 },
    ]
  },
  "claude-ai": {
    title: "Claude AI Architecture",
    subtitle: "👆 Click any glowing node to learn what it does!",
    nodes: [
      { id: 1, x: 80, y: 180, label: "User Input", color: "#4F8EF7", icon: "👤" },
      { id: 2, x: 240, y: 180, label: "Safety Filter", color: "#FF6B6B", icon: "🛡️" },
      { id: 3, x: 410, y: 90, label: "Constitutional AI", color: "#9B6DFF", icon: "📜" },
      { id: 4, x: 410, y: 270, label: "Claude Model", color: "#00C9A7", icon: "🧠" },
      { id: 5, x: 580, y: 180, label: "RLHF", color: "#FFD700", icon: "🎯" },
      { id: 6, x: 720, y: 180, label: "Response", color: "#4F8EF7", icon: "💬" },
    ],
    edges: [
      { from: 1, to: 2 }, { from: 2, to: 3 },
      { from: 2, to: 4 }, { from: 3, to: 5 },
      { from: 4, to: 5 }, { from: 5, to: 6 },
    ]
  },
}

const defaultConfig = (tool: string) => ({
  title: `${tool} Architecture`,
  subtitle: "👆 Click any glowing node to learn what it does!",
  nodes: [
    { id: 1, x: 80, y: 180, label: "Input", color: "#4F8EF7", icon: "📥" },
    { id: 2, x: 280, y: 180, label: "Process", color: "#9B6DFF", icon: "⚙️" },
    { id: 3, x: 480, y: 100, label: "AI Model", color: "#00C9A7", icon: "🧠" },
    { id: 4, x: 480, y: 260, label: "Memory", color: "#FF6B6B", icon: "💾" },
    { id: 5, x: 660, y: 180, label: "Output", color: "#FFD700", icon: "📤" },
  ],
  edges: [
    { from: 1, to: 2 }, { from: 2, to: 3 },
    { from: 2, to: 4 }, { from: 3, to: 5 }, { from: 4, to: 5 },
  ]
})

export function ImageSection({ tool }: { tool: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const hoveredNodeRef = useRef<string | null>(null)
  const selectedNodeRef = useRef<any>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner")

  const diagram = toolConfigs[tool] || defaultConfig(tool)

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (800 / rect.width),
      y: (e.clientY - rect.top) * (360 / rect.height),
    }
  }, [])

  const findNode = useCallback((x: number, y: number) => {
    return diagram.nodes.find((n: any) => {
      const dx = x - n.x
      const dy = y - n.y
      return Math.sqrt(dx * dx + dy * dy) < 48
    })
  }, [diagram])

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e)
    if (!coords) return
    const node = findNode(coords.x, coords.y)
    if (node) {
      const details = getNodeDetails(tool, node.label)
      const newSelected = { ...node, details }
      selectedNodeRef.current = newSelected
      setSelectedNode(newSelected)
    } else {
      selectedNodeRef.current = null
      setSelectedNode(null)
    }
  }, [tool, getCanvasCoords, findNode])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e)
    if (!coords) return
    const node = findNode(coords.x, coords.y)
    hoveredNodeRef.current = node ? node.label : null
    if (canvasRef.current) {
      canvasRef.current.style.cursor = node ? "pointer" : "default"
    }
  }, [getCanvasCoords, findNode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 360

    const animate = () => {
      const t = Date.now() / 1000
      const hoveredLabel = hoveredNodeRef.current
      const selectedLabel = selectedNodeRef.current?.label

      ctx.clearRect(0, 0, 800, 360)

      // Background
      const bg = ctx.createRadialGradient(400, 180, 0, 400, 180, 400)
      bg.addColorStop(0, "#0f0f1a")
      bg.addColorStop(1, "#080810")
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, 800, 360)

      // Floating particles
      for (let i = 0; i < 25; i++) {
        const px = (Math.sin(t * 0.3 + i * 2.1) * 0.5 + 0.5) * 800
        const py = (Math.cos(t * 0.2 + i * 1.7) * 0.5 + 0.5) * 360
        const alpha = (Math.sin(t + i) * 0.5 + 0.5) * 0.1
        ctx.beginPath()
        ctx.arc(px, py, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(79, 142, 247, ${alpha})`
        ctx.fill()
      }

      // Draw edges
      diagram.edges.forEach((edge: any, i: number) => {
        const from = diagram.nodes.find((n: any) => n.id === edge.from)
        const to = diagram.nodes.find((n: any) => n.id === edge.to)
        if (!from || !to) return

        const dx = to.x - from.x
        const dy = to.y - from.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const nx = dx / dist
        const ny = dy / dist
        const startX = from.x + nx * 46
        const startY = from.y + ny * 46
        const endX = to.x - nx * 46
        const endY = to.y - ny * 46

        // Line
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = from.color + "44"
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Moving signal dot
        const pos = ((t * 0.5 + i * 0.37) % 1)
        const sx = startX + (endX - startX) * pos
        const sy = startY + (endY - startY) * pos
        const alpha = Math.sin(pos * Math.PI)
        ctx.beginPath()
        ctx.arc(sx, sy, 3, 0, Math.PI * 2)
        ctx.fillStyle = from.color
        ctx.globalAlpha = alpha * 0.9
        ctx.shadowBlur = 10
        ctx.shadowColor = from.color
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.shadowBlur = 0

        // Arrowhead
        const angle = Math.atan2(endY - startY, endX - startX)
        ctx.beginPath()
        ctx.moveTo(endX, endY)
        ctx.lineTo(endX - 10 * Math.cos(angle - 0.4), endY - 10 * Math.sin(angle - 0.4))
        ctx.lineTo(endX - 10 * Math.cos(angle + 0.4), endY - 10 * Math.sin(angle + 0.4))
        ctx.closePath()
        ctx.fillStyle = from.color + "99"
        ctx.fill()
      })

      // Draw nodes
      diagram.nodes.forEach((node: any) => {
        const isHovered = hoveredLabel === node.label
        const isSelected = selectedLabel === node.label
        const pulse = 1 + Math.sin(t * 2 + node.id) * 0.04
        const r = 40 * (isSelected ? 1.15 : isHovered ? 1.1 : pulse)

        ctx.save()
        ctx.translate(node.x, node.y)

        // Outer glow
        ctx.shadowBlur = isSelected ? 35 : isHovered ? 25 : 15
        ctx.shadowColor = node.color

        // Selected ring
        if (isSelected) {
          ctx.beginPath()
          ctx.arc(0, 0, r + 10, 0, Math.PI * 2)
          ctx.strokeStyle = node.color + "88"
          ctx.lineWidth = 2
          ctx.setLineDash([6, 4])
          ctx.stroke()
          ctx.setLineDash([])
        }

        // Node fill
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.fillStyle = node.color + (isSelected ? "cc" : isHovered ? "55" : "33")
        ctx.fill()

        // Border
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.strokeStyle = node.color
        ctx.lineWidth = isSelected ? 3 : isHovered ? 2.5 : 1.5
        ctx.stroke()
        ctx.shadowBlur = 0

        // Icon
        ctx.font = `${isHovered || isSelected ? "20" : "17"}px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(node.icon, 0, -9)

        // Label
        ctx.font = `bold ${isHovered || isSelected ? "9.5" : "8.5"}px Arial`
        ctx.fillStyle = "#ffffff"
        const words = node.label.split(" ")
        if (words.length === 1) {
          ctx.fillText(node.label, 0, 10)
        } else {
          ctx.fillText(words[0], 0, 6)
          ctx.fillText(words.slice(1).join(" "), 0, 17)
        }

        // Hover hint
        if (isHovered && !isSelected) {
          ctx.font = "7.5px Arial"
          ctx.fillStyle = node.color + "cc"
          ctx.fillText("click to learn!", 0, r + 13)
        }

        ctx.restore()
      })

      // Title
      ctx.font = "bold 13px Arial"
      ctx.fillStyle = "#ffffffaa"
      ctx.textAlign = "center"
      ctx.fillText(diagram.title, 400, 22)
      ctx.font = "10px Arial"
      ctx.fillStyle = "#4F8EF7bb"
      ctx.fillText(diagram.subtitle, 400, 38)

      animRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animRef.current)
  }, [tool, diagram])

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Interactive Architecture
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Click any node to learn what it does — 3 difficulty levels!
          </p>
        </div>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20 animate-pulse">
          🖱️ Click to Explore
        </span>
      </div>

      {/* Canvas */}
      <div className="rounded-lg overflow-hidden border border-border">
        <canvas
          ref={canvasRef}
          className="w-full h-auto"
          style={{ display: "block" }}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
        />
      </div>

      {/* Selected Node Detail Panel */}
      {selectedNode && (
        <div className="mt-4 rounded-xl border border-border bg-background overflow-hidden">
          {/* Header */}
          <div
            className="flex items-center justify-between p-4"
            style={{ borderLeft: `4px solid ${selectedNode.color}` }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedNode.icon}</span>
              <div>
                <h3 className="font-semibold text-foreground text-base">
                  {selectedNode.details.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Component in {diagram.title}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                selectedNodeRef.current = null
                setSelectedNode(null)
              }}
              className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Level Selector */}
          <div className="flex gap-2 px-4 py-3 border-t border-border bg-muted/20">
            {(["beginner", "intermediate", "advanced"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  level === l
                    ? "text-white shadow-md"
                    : "bg-card text-muted-foreground hover:text-foreground border border-border"
                }`}
                style={level === l ? { backgroundColor: selectedNode.color } : {}}
              >
                {l === "beginner" ? "🌱 Beginner" : l === "intermediate" ? "🔥 Intermediate" : "🚀 Advanced"}
              </button>
            ))}
          </div>

          {/* Explanation */}
          <div className="p-4 space-y-4">
            <div className="flex gap-3">
              <BookOpen className="h-4 w-4 mt-0.5 shrink-0" style={{ color: selectedNode.color }} />
              <p className="text-sm text-foreground leading-relaxed">
                {selectedNode.details[level]}
              </p>
            </div>

            {/* Code Example */}
            <div className="rounded-lg bg-muted border border-border overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/50">
                <Code2 className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">
                  Code Example
                </span>
              </div>
              <pre className="p-4 text-xs font-mono text-foreground overflow-x-auto leading-relaxed">
                <code>{selectedNode.details.example}</code>
              </pre>
            </div>

            {/* Pro Tip */}
            <div
              className="flex gap-3 p-3 rounded-lg"
              style={{
                backgroundColor: selectedNode.color + "11",
                border: `1px solid ${selectedNode.color}33`
              }}
            >
              <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-yellow-400" />
              <p className="text-xs text-muted-foreground">
                <span className="font-medium" style={{ color: selectedNode.color }}>
                  {level === "beginner" ? "💡 Beginner tip: " : level === "intermediate" ? "🔥 Next step: " : "⚡ Expert tip: "}
                </span>
                {level === "beginner"
                  ? "Understand this concept before moving to the next node. Take it step by step!"
                  : level === "intermediate"
                  ? "Try implementing this component yourself to deepen your understanding!"
                  : "Read the original research paper to fully master this concept!"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hint when nothing selected */}
      {!selectedNode && (
        <div className="mt-3 flex items-center justify-center gap-2 py-2">
          <span className="text-lg">👆</span>
          <p className="text-xs text-muted-foreground">
            Click on any glowing node in the diagram above to learn what it does!
          </p>
        </div>
      )}
    </div>
  )
}
