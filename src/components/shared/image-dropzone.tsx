import { useRef, useState, useCallback } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'

const MAX_SIZE_MB = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export interface ImageDropzoneValue {
  file: File
  base64: string
  previewUrl: string
}

interface ImageDropzoneProps {
  value: ImageDropzoneValue | null
  onChange: (value: ImageDropzoneValue | null) => void
  hint?: string
}

export function ImageDropzone({ value, onChange, hint }: ImageDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateAndSet = useCallback(
    async (f: File) => {
      setError(null)
      if (!ACCEPTED_TYPES.includes(f.type)) {
        setError('Please upload a PNG, JPG, or WEBP image.')
        return
      }
      if (f.size > MAX_SIZE_BYTES) {
        setError(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`)
        return
      }
      const base64 = await fileToBase64(f)
      const previewUrl = URL.createObjectURL(f)
      onChange({ file: f, base64, previewUrl })
    },
    [onChange],
  )

  function handleRemove() {
    if (value?.previewUrl) URL.revokeObjectURL(value.previewUrl)
    onChange(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      {!value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setIsDragOver(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragOver(false)
            const f = e.dataTransfer.files[0]
            if (f) void validateAndSet(f)
          }}
          className={`w-full rounded-lg border-2 border-dashed p-10 text-center transition-colors cursor-pointer ${
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
                Drop your image here or click to browse
              </p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {hint ?? `PNG, JPG, or WEBP up to ${MAX_SIZE_MB}MB`}
              </p>
            </div>
          </div>
        </button>
      ) : (
        <div className="rounded-lg border border-[var(--border)] p-4">
          <div className="flex items-start gap-4">
            {value.previewUrl ? (
              <img
                src={value.previewUrl}
                alt="Preview"
                className="size-24 shrink-0 rounded-md border border-[var(--border)] object-cover"
              />
            ) : (
              <div className="flex size-24 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)]">
                <ImageIcon className="size-8 text-[var(--muted-foreground)]" />
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-[var(--foreground)]">
                  {value.file.name}
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
                {(value.file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-[var(--status-critical)]">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) void validateAndSet(f)
        }}
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
      const base64 = result.split(',')[1]
      if (base64) resolve(base64)
      else reject(new Error('Failed to convert file to base64'))
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
