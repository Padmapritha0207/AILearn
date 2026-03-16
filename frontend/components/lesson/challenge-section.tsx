"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Trophy } from "lucide-react"

interface Challenge {
  title: string
  description: string
  hint: string
}

export function ChallengeSection({ tool, data }: { tool: string; data?: Challenge }) {
  const [showHint, setShowHint] = useState(false)

  return (
    <div className="rounded-xl border-l-4 border-l-secondary border-y border-r border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-secondary" />
        <h2 className="text-xl font-semibold text-foreground">Your Challenge</h2>
      </div>
      {data ? (
        <>
          <h3 className="text-lg font-medium text-primary mb-2">{data.title}</h3>
          <p className="text-muted-foreground mb-4">{data.description}</p>
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showHint ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showHint ? "Hide Hint" : "Show Hint 💡"}
          </button>
          {showHint && (
            <div className="mt-3 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              {data.hint}
            </div>
          )}
        </>
      ) : (
        <p className="text-muted-foreground">Loading challenge...</p>
      )}
    </div>
  )
}
