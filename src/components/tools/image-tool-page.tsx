import { useState } from 'react'
import {
  Sparkles,
  AlertCircle,
  ImageOff,
  Mail,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Spinner } from '#/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import { ToolPageShell, Workbench } from '#/components/tools/tool-page-shell'
import { ToolSection } from '#/components/tools/tool-section'
import { ToolFaq } from '#/components/tools/tool-faq'
import { ToolContext } from '#/components/tools/tool-context'
import { RelatedGuidesSection } from '#/components/blog/related-guides-section'
import {
  ImageDropzone,
  type ImageDropzoneValue,
} from '#/components/shared/image-dropzone'
import { ResultViewer } from '#/components/shared/result-viewer'
import {
  generateImageEdit,
  type ImageEditMode,
  type ImageEditStyle,
} from '#/server/generate-image-edit'
import { type RenderCreditAccount } from '#/server/render-credits'
import { signupForRenderCredits } from '#/server/render-signup'
import { track } from '#/lib/track'
import type { FaqItem } from '#/lib/seo'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { getArticleLinkItem, type BlogSlug } from '#/data/blog-content'

const STYLE_OPTIONS: ReadonlyArray<{ id: ImageEditStyle; label: string }> = [
  { id: 'modern', label: 'Modern' },
  { id: 'indian-traditional', label: 'Indian' },
  { id: 'scandinavian', label: 'Scandi' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'luxury', label: 'Luxury' },
]

const RENDER_SESSION_STORAGE_KEY = 'plotrai-render-session-token'

interface ImageToolPageProps {
  mode: ImageEditMode
  toolName: string
  title: string
  tagline: string
  uploadHint: string
  ctaLabel: string
  eyebrowIcon?: LucideIcon
  eyebrowLabel?: string
  context?: { title: string; paragraphs: ReadonlyArray<string> }
  faqs?: ReadonlyArray<FaqItem>
  relatedGuides?: ReadonlyArray<BlogSlug>
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
  context,
  faqs,
  relatedGuides,
}: ImageToolPageProps) {
  const [image, setImage] = useState<ImageDropzoneValue | null>(null)
  const [style, setStyle] = useState<ImageEditStyle>('modern')
  const [quality, setQuality] = useState<'medium' | 'high'>('medium')
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [sessionToken, setSessionToken] = useState(() =>
    typeof window === 'undefined'
      ? ''
      : (window.localStorage.getItem(RENDER_SESSION_STORAGE_KEY) ?? ''),
  )
  const [account, setAccount] = useState<RenderCreditAccount | null>(null)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [signupError, setSignupError] = useState<string | null>(null)

  async function handleGenerate() {
    if (!image) return
    setIsLoading(true)
    setError(null)
    setResult(null)
    track('image_render_started', { mode, style, quality })
    try {
      const res = await generateImageEdit({
        data: {
          image: image.base64,
          mimeType: image.file.type,
          mode,
          style,
          quality,
          sessionToken: sessionToken || undefined,
        },
      })
      setResult(res.base64)
      setAccount(res.account)
      track('image_render_completed', { mode, style, quality })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to render. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignup() {
    setIsSigningUp(true)
    setSignupError(null)
    try {
      const res = await signupForRenderCredits({ data: { email } })
      setSessionToken(res.sessionToken)
      setAccount(res.account)
      window.localStorage.setItem(RENDER_SESSION_STORAGE_KEY, res.sessionToken)
      track('render_signup_completed', { mode })
    } catch (err) {
      setSignupError(
        err instanceof Error ? err.message : 'Could not create render credits.',
      )
    } finally {
      setIsSigningUp(false)
    }
  }

  return (
    <ToolPageShell
      breadcrumb={[{ label: 'Tools', href: '/' }, { label: toolName }]}
      eyebrow={
        eyebrowIcon && eyebrowLabel
          ? { icon: eyebrowIcon, label: eyebrowLabel }
          : undefined
      }
      title={title}
      tagline={tagline}
      variant="workbench"
      footnote="AI-generated visualization. Renders are stylized concepts — not measurement-accurate architectural models. Layout fidelity is best-effort."
    >
      <Workbench>
        <Workbench.Sidebar>
          <ToolSection
            number="01"
            label="Upload"
            description={uploadHint}
            layout="stacked"
            rule={false}
          >
            <ImageDropzone value={image} onChange={setImage} />
          </ToolSection>

          <ToolSection
            number="02"
            label="Style"
            description="How should the AI render the result?"
            layout="stacked"
          >
            <ToggleGroup
              type="single"
              value={style}
              onValueChange={(v) => v && setStyle(v as ImageEditStyle)}
              variant="outline"
              className="flex w-full flex-wrap"
            >
              {STYLE_OPTIONS.map((opt) => (
                <ToggleGroupItem
                  key={opt.id}
                  value={opt.id}
                  aria-label={opt.label}
                >
                  {opt.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </ToolSection>

          <ToolSection
            number="03"
            label="Quality"
            description="High takes ~2× longer, more detail."
            layout="stacked"
          >
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

            <div className="rounded-md border border-[var(--border)] bg-[var(--muted)]/35 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--accent-teal-light)] text-[var(--accent-teal)]">
                  {account?.signedIn ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <Mail className="size-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {account?.signedIn
                      ? `${account.creditsRemaining} render credits left`
                      : 'Need more renders?'}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--muted-foreground)]">
                    {account?.signedIn
                      ? `Signed in as ${account.email}. Each render uses 1 credit.`
                      : 'Your first render is free. Sign up to get 3 more test credits.'}
                  </p>
                </div>
              </div>

              {!account?.signedIn && (
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`${mode}-render-email`}>Email</Label>
                    <Input
                      id={`${mode}-render-email`}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isSigningUp || !email}
                    onClick={handleSignup}
                  >
                    {isSigningUp ? <Spinner /> : <Mail />}
                    {isSigningUp ? 'Adding credits…' : 'Get 3 free credits'}
                  </Button>
                  {signupError && (
                    <p className="text-xs leading-relaxed text-destructive">
                      {signupError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Workbench.Sidebar>

        <Workbench.Result>
          <ToolSection label="Result" layout="stacked" rule={false}>
            {!image ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ImageOff />
                  </EmptyMedia>
                  <EmptyTitle>No image yet</EmptyTitle>
                  <EmptyDescription>
                    Upload an image on the left to begin. You'll see your
                    original and the AI render side by side.
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

      {(context || faqs || relatedGuides?.length) && (
        <div className="mt-12 flex flex-col gap-10">
          {context && (
            <ToolContext title={context.title}>
              {context.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </ToolContext>
          )}
          {relatedGuides && relatedGuides.length > 0 && (
            <RelatedGuidesSection
              items={relatedGuides.map(getArticleLinkItem)}
              description="Read the companion planning guides before you lock the layout or interior direction."
            />
          )}
          {faqs && faqs.length > 0 && <ToolFaq items={faqs} />}
        </div>
      )}
    </ToolPageShell>
  )
}
