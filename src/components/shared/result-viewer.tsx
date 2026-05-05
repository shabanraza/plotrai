import { Download, RefreshCw } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Spinner } from '#/components/ui/spinner'

interface ResultViewerProps {
  beforeUrl: string
  afterBase64: string | null
  isLoading: boolean
  onRegenerate: () => void
  downloadName?: string
}

export function ResultViewer({
  beforeUrl,
  afterBase64,
  isLoading,
  onRegenerate,
  downloadName = 'plotrai-render.png',
}: ResultViewerProps) {
  const afterUrl = afterBase64 ? `data:image/png;base64,${afterBase64}` : null

  function handleDownload() {
    if (!afterUrl) return
    const a = document.createElement('a')
    a.href = afterUrl
    a.download = downloadName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <figure className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <img src={beforeUrl} alt="Before" className="aspect-square w-full object-contain" />
          <figcaption className="border-t border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted-foreground)]">
            Original
          </figcaption>
        </figure>
        <figure className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]">
          {isLoading ? (
            <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 bg-[var(--muted)]/40">
              <Spinner className="size-7 text-[var(--accent-teal)]" />
              <p className="text-sm text-[var(--muted-foreground)]">Rendering… ~10s</p>
            </div>
          ) : afterUrl ? (
            <img src={afterUrl} alt="AI render" className="aspect-square w-full object-contain" />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center bg-[var(--muted)]/40">
              <p className="text-sm text-[var(--muted-foreground)]">Click Generate to render</p>
            </div>
          )}
          <figcaption className="border-t border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--accent-teal)]">
            AI render
          </figcaption>
        </figure>
      </div>

      {afterUrl && (
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleDownload} size="sm">
            <Download />
            Download PNG
          </Button>
          <Button onClick={onRegenerate} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw />
            Regenerate
          </Button>
        </div>
      )}
    </div>
  )
}
