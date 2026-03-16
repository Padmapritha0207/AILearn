"use client"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  const scrollToTools = () => {
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      {/* Dot grid background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, #4F8EF7 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Learn Any AI Tool</span>
            <span className="mt-2 block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Visually & Interactively
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            AI teaches you with flow diagrams, videos, images and hands-on challenges. Click any tool to start.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              size="lg" 
              className="min-w-[160px] bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={scrollToTools}
            >
              Start Learning
            </Button>
          </div>
          
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span>9 AI Tools</span>
            <span className="hidden sm:inline">·</span>
            <span>Flow Diagrams</span>
            <span className="hidden sm:inline">·</span>
            <span>Powered by AI</span>
            <span className="hidden sm:inline">·</span>
            <span>Free Forever</span>
          </div>
        </div>
      </div>
    </section>
  )
}
