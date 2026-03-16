"use client"

interface Video {
  id: string
  title: string
  thumbnail: string
  channel: string
}

export function VideoSection({ tool, videos }: { tool: string; videos?: Video[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-xl font-semibold text-foreground">Watch & Learn</h2>
      {videos && videos.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {videos.map((video) => (
            <div key={video.id} className="overflow-hidden rounded-lg border border-border">
              <div className="relative aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-foreground line-clamp-2">{video.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Loading videos...</p>
      )}
    </div>
  )
}