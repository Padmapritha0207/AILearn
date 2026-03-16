"use client"

import { useState, useEffect } from "react"

const taglines = [
  "The future of learning is visual · AILearn",
  "Don't just use AI. Understand it. · AILearn",
  "Turning curiosity into capability · AILearn",
  "AI is not the future. It's now. Learn it. · AILearn",
  "See it. Learn it. Build it. · AILearn",
  "Every expert was once a beginner. · AILearn",
  "Learn AI the way AI thinks. · AILearn",
]

export function Footer() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % taglines.length)
        setVisible(true)
      }, 500)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-2">
          <p
            className="text-sm text-muted-foreground text-center transition-opacity duration-500"
            style={{ opacity: visible ? 1 : 0 }}
          >
            {taglines[current]}
          </p>
        </div>
      </div>
    </footer>
  )
}
