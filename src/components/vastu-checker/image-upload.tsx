import { useRef, useState, useCallback } from 'react'
import {
  Upload,
  X,
  Sparkles,
  Loader2,
  ImageIcon,
  CheckCircle,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { analyzeFloorPlan } from '#/server/analyze-floor-plan'
import type { FloorPlanAnalysis } from '#/server/analyze-floor-plan'

const MAX_SIZE_MB = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

interface ImageUploadProps {
  onExtract: (analysis: FloorPlanAnalysis) => void
}

export function ImageUpload({ onExtract }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [extracted, setExtracted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function validateAndSetFile(f: File) {
    setError(null)
    setExtracted(false)

    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError('Please upload a PNG, JPG, or WEBP image.')
      return
    }
    if (f.size > MAX_SIZE_BYTES) {
      setError(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`)
      return
    }

    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  function handleRemove() {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setError(null)
    setExtracted(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) validateAndSetFile(f)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) validateAndSetFile(f)
  }, [])

  async function handleExtract() {
    if (!file) return
    setIsExtracting(true)
    setError(null)

    try {
      const base64 = await fileToBase64(file)
      const analysis = await analyzeFloorPlan({
        data: { image: base64, mimeType: file.type },
      })
      setExtracted(true)
      onExtract(analysis)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to analyze the floor plan. Please try again.',
      )
    } finally {
      setIsExtracting(false)
    }
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
            isDragOver
              ? 'border-[var(--accent-teal)] bg-[var(--accent-teal-light)]'
              : 'border-[var(--border)] hover:border-[var(--accent-teal)] hover:bg-[var(--accent-teal-light)]'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-[var(--muted)] p-3">
              <Upload className="size-6 text-[var(--muted-foreground)]" />
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)]">
                Drop your floor plan here or click to browse
              </p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                PNG, JPG, or WEBP up to {MAX_SIZE_MB}MB
              </p>
            </div>
          </div>
        </button>
      ) : (
        <div className="rounded-lg border border-[var(--border)] p-4">
          <div className="flex items-start gap-4">
            {preview ? (
              <img
                src={preview}
                alt="Floor plan preview"
                className="size-20 shrink-0 rounded-md border border-[var(--border)] object-cover"
              />
            ) : (
              <div className="flex size-20 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)]">
                <ImageIcon className="size-8 text-[var(--muted-foreground)]" />
              </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-[var(--foreground)]">
                  {file.name}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleRemove}
                  aria-label="Remove image"
                >
                  <X className="size-4" />
                </Button>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>

              {extracted ? (
                <div className="flex items-center gap-2 text-sm text-[var(--status-success)]">
                  <CheckCircle className="size-4" />
                  Rooms extracted successfully
                </div>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleExtract}
                  disabled={isExtracting}
                  className="mt-1 w-fit"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Extract Rooms from Image
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-[var(--status-critical)]">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Strip the data URL prefix (e.g. "data:image/png;base64,")
      const base64 = result.split(',')[1]
      if (base64) {
        resolve(base64)
      } else {
        reject(new Error('Failed to convert file to base64'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
