"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface ToolCardProps {
  name: string
  description: string
  category: string
  slug: string
  bgColor: string
  textColor: string
  abbreviation: string
}

export function ToolCard({ name, description, category, slug, bgColor, textColor, abbreviation }: ToolCardProps) {
  return (
    <Link href={`/lesson?tool=${slug}`} className="group block">
      <div className="relative h-full overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(79,142,247,0.3)]">
        <div className="flex items-start justify-between">
          {/* Styled logo box */}
          <div 
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            {abbreviation}
          </div>
          
          {/* Category badge */}
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {category}
          </span>
        </div>
        
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          {name}
        </h3>
        
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>
        
        <div className="mt-4 border-t border-border pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all group-hover:gap-2.5">
            Start Learning
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
