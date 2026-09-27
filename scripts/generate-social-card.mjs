import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { createElement as h } from 'react'
import { ImageResponse } from 'next/og.js'

// Use Next's image dependency to decode the original WebP for the card renderer.
const require = createRequire(import.meta.url)
const sharp = createRequire(require.resolve('next/package.json'))('sharp')
const root = new URL('../', import.meta.url)
const [regular, bold, portrait] = await Promise.all([
  readFile(new URL('assets/fonts/NimbusSans-Regular.otf', root)),
  readFile(new URL('assets/fonts/NimbusSans-Bold.otf', root)),
  sharp(fileURLToPath(new URL('public/images/site/portrait.webp', root)))
    .resize(390, 390)
    .png()
    .toBuffer(),
])

const text = (value, top, size, extra = {}) => h('div', {
  style: {
    position: 'absolute', left: 534, top, fontSize: size,
    lineHeight: 1.2, whiteSpace: 'nowrap', ...extra,
  },
}, value)

const card = h('div', {
  style: {
    display: 'flex', position: 'relative', width: 1200, height: 630,
    background: '#fff', color: '#595959', fontFamily: 'Nimbus Sans',
    fontWeight: 400,
  },
},
  h('img', {
    src: `data:image/png;base64,${portrait.toString('base64')}`,
    width: 390, height: 390,
    style: { position: 'absolute', left: 80, top: 120, borderRadius: 30 },
  }),
  text('Benjamin Segall', 154, 80, { color: '#000', fontWeight: 700, letterSpacing: -2 }),
  text('User Experience Design graduate', 254, 36),
  h('div', {
    style: {
      position: 'absolute', left: 534, top: 336, width: 586,
      height: 2, background: '#d9d9d9',
    },
  }),
  text([
    h('span', { key: 'location' }, 'Based in London.'),
    h('span', {
      key: 'availability',
      style: { color: '#000', fontWeight: 700, marginLeft: 8 },
    }, 'Available now.'),
  ], 364, 30, { display: 'flex' }),
  text('benjaminsegall.com', 420, 30),
)

const response = new ImageResponse(card, {
  width: 1200, height: 630,
  fonts: [
    { name: 'Nimbus Sans', data: regular, weight: 400, style: 'normal' },
    { name: 'Nimbus Sans', data: bold, weight: 700, style: 'normal' },
  ],
})
await writeFile(new URL('public/images/site/og.png', root), Buffer.from(await response.arrayBuffer()))
