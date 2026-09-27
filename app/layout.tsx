import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { siteMeta } from '@/lib/portfolio-data'

export const metadata: Metadata = {
  // Absolute base for the social card: Open Graph will not accept a relative
  // image URL, so without this a shared link renders with no preview at all.
  metadataBase: new URL(siteMeta.url),
  // The <title>, so the tab, bookmarks and history read as the name alone.
  // The descriptive form stays on the cards below, where it is a headline
  // rather than a label.
  title: siteMeta.name,
  description: siteMeta.description,
  // An SVG favicon alone is a desktop-only icon. iOS Safari has never read one
  // — it wants an apple-touch-icon PNG — and Android Chrome takes its icon from
  // the manifest. With only the SVG declared, both fell back to a generated
  // placeholder, so the raster sizes below carry the icon on mobile and the ICO
  // covers the browsers that still ask for /favicon.ico by convention.
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    // iOS ignores the sizes hint and rounds the corners itself, which is why
    // this one is the full-bleed square rather than the pre-rounded artwork.
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: siteMeta.name,
    // Keep the name as the headline, with background in the description.
    title: siteMeta.name,
    description: siteMeta.description,
    locale: 'en_GB',
    images: [
      {
        url: siteMeta.ogImage,
        width: 1200,
        height: 630,
        alt: siteMeta.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMeta.name,
    description: siteMeta.description,
    images: [siteMeta.ogImage],
  },
}

export const viewport: Viewport = {
  // Light-only, matching globals.css. Advertising 'light dark' made the
  // browser paint its own chrome dark on a dark-mode device while the page
  // stayed white — the theme colour below is the address bar on mobile.
  colorScheme: 'light',
  themeColor: 'white',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
