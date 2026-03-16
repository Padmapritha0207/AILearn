"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function CodeSection({ tool, data }: { tool: string; data?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (data) {
      navigator.clipboard.writeText(data)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Try This Code</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Python</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code className="text-foreground font-mono">
          {data || "# Loading code example..."}
        </code>
      </pre>
    </div>
  )
}