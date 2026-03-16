"use client"

export function WhatIsItSection({ tool, data }: { tool: string; data?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border-l-4 border-l-primary border-y border-r border-border bg-card p-6">
      <h2 className="mb-4 text-xl font-semibold text-foreground">What is it?</h2>
      <p className="leading-relaxed text-muted-foreground">
        {data || "Loading explanation..."}
      </p>
    </div>
  )
}
