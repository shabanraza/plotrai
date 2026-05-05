import { useState } from 'react'
import { Sparkles, AlertCircle, ImageOff, type LucideIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Spinner } from '#/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '#/components/ui/toggle-group'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import { ToolPageShell, Workbench } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { ImageDropzone, type ImageDropzoneValue } from '#/components/shared/image-dropzone'
import { ResultViewer } from '#/components/shared/result-viewer'
import {
  generateImageEdit,
  type ImageEditMode,
  type ImageEditStyle,
} from '#/server/generate-image-edit'
import { track } from '#/lib/track'

const STYLE_OPTIONS: ReadonlyArray<{ id: ImageEditStyle; label: string }> = [
  { id: 'modern', label: 'Modern' },
  { id: 'indian-traditional', label: 'Indian' },
  { id: 'scandinavian', label: 'Scandi' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'luxury', label: 'Luxury' },
]

interface ImageToolPageProps {
  mode: ImageEditMode
  toolName: string
  title: string
  tagline: string
  uploadHint: string
  ctaLabel: string
  eyebrowIcon?: LucideIcon
  eyebrowLabel?: string
}

export function ImageToolPage({
  mode,
  toolName,
  title,
  tagline,
  uploadHint,
  ctaLabel,
  eyebrowIcon,
  eyebrowLabel,
}: ImageToolPageProps) {
  const [image, setImage] = useState<ImageDropzoneValue | null>(null)
  const [style, setStyle] = useState<ImageEditStyle>('modern')
  const [quality, setQuality] = useState<'medium' | 'high'>('medium')
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    if (!image) return
    setIsLoading(true)
    setError(null)
    setResult(null)
    track('image_render_started', { mode, style, quality })
    try {
      const res = await generateImageEdit({
        data: { image: image.base64, mimeType: image.file.type, mode, style, quality },
      })
      setResult(res.base64)
      track('image_render_completed', { mode, style, quality })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to render. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ToolPageShell
      breadcrumb={[{ label: 'Tools', href: '/' }, { label: toolName }]}
      eyebrow={
        eyebrowIcon && eyebrowLabel ? { icon: eyebrowIcon, label: eyebrowLabel } : undefined
      }
      title={title}
      tagline={tagline}
      variant="workbench"
      footnote="AI-generated visualization. Renders are stylized concepts — not measurement-accurate architectural models. Layout fidelity is best-effort."
    >
      <Workbench>
        <Workbench.Sidebar>
          <ToolSection number="01" label="Upload" description={uploadHint} rule={false}>
            <ImageDropzone value={image} onChange={setImage} />
          </ToolSection>

          <ToolSection number="02" label="Style" description="How should the AI render the result?">
            <ToggleGroup
              type="single"
              value={style}
              onValueChange={(v) => v && setStyle(v as ImageEditStyle)}
              variant="outline"
              className="flex w-full flex-wrap"
            >
              {STYLE_OPTIONS.map((opt) => (
                <ToggleGroupItem key={opt.id} value={opt.id} aria-label={opt.label}>
                  {opt.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </ToolSection>

          <ToolSection number="03" label="Quality" description="High takes ~2× longer, more detail.">
            <ToggleGroup
              type="single"
              value={quality}
              onValueChange={(v) => v && setQuality(v as 'medium' | 'high')}
              variant="outline"
            >
              <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
              <ToggleGroupItem value="high">High</ToggleGroupItem>
            </ToggleGroup>
          </ToolSection>

          <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-7">
            <Button
              size="lg"
              className="w-full"
              disabled={!image || isLoading}
              onClick={handleGenerate}
            >
              {isLoading ? <Spinner /> : <Sparkles />}
              {isLoading ? 'Rendering…' : ctaLabel}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Couldn't generate render</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </Workbench.Sidebar>

        <Workbench.Result>
          <ToolSection label="Result" rule={false}>
            {!image ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ImageOff />
                  </EmptyMedia>
                  <EmptyTitle>No image yet</EmptyTitle>
                  <EmptyDescription>
                    Upload an image on the left to begin. You'll see your original and the AI
                    render side by side.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ResultViewer
                beforeUrl={image.previewUrl}
                afterBase64={result}
                isLoading={isLoading}
                onRegenerate={handleGenerate}
                downloadName={`plotrai-${mode}-${style}.png`}
              />
            )}
          </ToolSection>
        </Workbench.Result>
      </Workbench>
    </ToolPageShell>
  )
}
