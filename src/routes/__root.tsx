import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useEffect, useRef } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { Toaster } from '../components/ui/sonner'
import { ChatPanel } from '../components/ai-chat/chat-panel'
import { organizationLd, websiteLd } from '#/lib/seo'

import PostHogProvider from '../integrations/posthog/provider'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#0d9488' },
      { title: 'Plotr Ai — Free single-purpose tools for Indian homeowners' },
      { name: 'google-site-verification', content: 'awTsUxDIOHxABex6cjuOqmBcbZ4v0AYxyRVoz7k-b7I' },
      // Default social-card meta — individual route head() blocks override
      // og:image / og:url / og:title with route-specific values.
      { property: 'og:site_name', content: 'Plotr Ai' },
      { property: 'og:locale', content: 'en_IN' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://plotrai.in/og/landing.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://plotrai.in/og/landing.png' },
      { name: 'twitter:site', content: '@plotrai' },
      { name: 'robots', content: 'index, follow' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'apple-touch-icon', href: '/favicon.svg' },
      // canonical is set per-route via each route's head() links
    ],
    scripts: [organizationLd(), websiteLd()],
  }),
  shellComponent: RootDocument,
})

const GA_SCRIPT = import.meta.env.VITE_GA_MEASUREMENT_ID
  ? `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${import.meta.env.VITE_GA_MEASUREMENT_ID}',{send_page_view:false});`
  : ''

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {import.meta.env.VITE_GA_MEASUREMENT_ID && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`}
          />
        )}
        {GA_SCRIPT && <script dangerouslySetInnerHTML={{ __html: GA_SCRIPT }} />}
        <HeadContent />
      </head>
      <body className="flex min-h-dvh flex-col font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <PostHogProvider>
          <Header />
          <GoogleAnalyticsPageviews />
          <div className="flex-1">{children}</div>
          <Footer />
          <ChatPanel />
          <Toaster position="top-right" richColors closeButton />
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </PostHogProvider>
        <Scripts />
      </body>
    </html>
  )
}

function GoogleAnalyticsPageviews() {
  const location = useLocation()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) return

    const path = `${location.pathname}${location.searchStr}${location.hash}`
    if (lastPath.current === path) return
    lastPath.current = path

    const win = window as Window & {
      gtag?: (
        command: 'event',
        eventName: 'page_view',
        params: Record<string, string>,
      ) => void
    }

    win.gtag?.('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [location.hash, location.pathname, location.searchStr])

  return null
}
