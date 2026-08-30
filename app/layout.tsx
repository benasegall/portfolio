import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { siteMeta } from '@/lib/portfolio-data'

export const metadata: Metadata = {
  // Absolute base for the social card: Open Graph will not accept a relative
  // image URL, so without this a shared link renders with no preview at all.
  metadataBase: new URL(siteMeta.url),
  title: siteMeta.title,
  description: siteMeta.description,
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: siteMeta.title,
    title: siteMeta.title,
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
    title: siteMeta.title,
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
