"use client"

interface FlowStep {
  step: number
  title: string
  description: string
}

const stepColors = [
  { bg: "#4F8EF733", border: "#4F8EF7", text: "#4F8EF7" },
  { bg: "#9B6DFF33", border: "#9B6DFF", text: "#9B6DFF" },
  { bg: "#00C9A733", border: "#00C9A7", text: "#00C9A7" },
  { bg: "#FF6B6B33", border: "#FF6B6B", text: "#FF6B6B" },
  { bg: "#FFD70033", border: "#FFD700", text: "#FFD700" },
  { bg: "#FF6B9D33", border: "#FF6B9D", text: "#FF6B9D" },
]

export function FlowDiagramSection({ tool, data }: { tool: string; data?: FlowStep[] }) {
  const steps = data || []

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-2 text-xl font-semibold text-foreground">How it Works</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Step-by-step breakdown of the process
      </p>

      {/* Always use vertical layout — clean and works for any number of steps */}
      <div className="flex flex-col gap-0">
        {steps.map((step, index) => {
          const color = stepColors[index % stepColors.length]
          return (
            <div key={step.step} className="flex gap-4">
              {/* Left side: circle + line */}
              <div className="flex flex-col items-center">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm border-2"
                  style={{
                    background: color.bg,
                    borderColor: color.border,
                    color: color.text,
                    boxShadow: `0 0 12px ${color.border}44`,
                  }}
                >
                  {step.step}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className="w-0.5 h-8 my-1"
                    style={{ background: color.border + "44" }}
                  />
                )}
              </div>

              {/* Right side: content */}
              <div className="pb-6 flex-1">
                <h3
                  className="font-semibold text-sm mb-1"
                  style={{ color: color.text }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}