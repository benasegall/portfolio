import type { MetadataRoute } from 'next'
import { siteMeta } from '@/lib/portfolio-data'

/**
 * Android Chrome takes its icon from the manifest, not from <link rel="icon">,
 * and it will not read an SVG one. Without this file it falls back to a
 * generated letter-on-a-circle placeholder — which is what was showing on
 * mobile. The two PNGs below are the sizes Chrome asks for: 192 for the home
 * screen, 512 for the splash and the install prompt.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteMeta.name,
    short_name: siteMeta.name,
    description: siteMeta.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      // Full-bleed white ground, glyph well inside the safe zone, so Android
      // can crop this to whatever shape the launcher uses without clipping it.
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
