"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LessonContent } from "@/components/lesson-content"

function LessonPageContent() {
  const searchParams = useSearchParams()
  const tool = searchParams.get("tool") || "gemini-api"

  return <LessonContent tool={tool} />
}

export default function LessonPage() {
  useEffect(() => {
    history.scrollRestoration = "manual"
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={<div className="pt-32 text-center text-muted-foreground">Loading...</div>}>
        <LessonPageContent />
      </Suspense>
      <Footer />
    </main>
  )
}