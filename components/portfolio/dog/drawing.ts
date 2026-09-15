/**
 * The footer dog's drawing: the pencil sketch in /images/site/dog.webp (its
 * paper made transparent, cropped to the drawing), cut into three layers so
 * parts of it can move — the body, the head with its ears, and the tail.
 *
 * Each layer is the whole image under a feathered mask, so where two meet
 * they blend rather than show a seam when the head dips or the tail wags.
 * Over the head sit the closed eyes: the sketch has him awake, so asleep a
 * soft cover takes out each eye, fur strokes in the drawing's own hand fill
 * it back in, and a dark lid crease with lashes sits across it. Awake, they
 * simply go, and his eyes are the sketch's own.
 *
 * All coordinates are the cropped drawing's own pixels.
 */

export const DOG_IMAGE = "/images/site/dog.webp"
export const DOG_WIDTH = 1351
export const DOG_HEIGHT = 808
export const DOG_VIEWBOX = `0 0 ${DOG_WIDTH} ${DOG_HEIGHT}`

// The head and both ears, down to the neck; the tail, from where it leaves the rump.
const HEAD = "M200 120 L262 40 L380 4 L520 10 L622 58 L694 158 L704 262 L664 342 L566 402 L452 432 L330 414 L250 372 L204 262 Z"
const TAIL = "M1128 612 L1134 578 L1192 584 L1278 644 L1352 700 L1352 752 L1280 742 L1210 720 L1164 692 L1140 660 Z"

/** Where the moving parts turn, and where things float up from (fractions of the box). */
export const DOG_PIVOTS = { head: "452px 440px", tail: "1140px 640px" }
export const DOG_ANCHORS = { z: [0.4, 0.04] } as const

// Seeded, so the closed eyes come out the same on every render.
let seed = 5
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const r = (a: number, b: number) => a + rnd() * (b - a)
const f = (n: number) => n.toFixed(1)

function closedEye(cx: number, cy: number, tilt: number) {
  let fur = ""
  for (let i = 0; i < 26; i++) {
    const a = r(-0.2, 0.9), l = r(9, 17), x = cx + r(-22, 20), y = cy + r(-17, 13)
    if (((x - cx) / 24) ** 2 + ((y - cy) / 18) ** 2 > 1) continue
    fur += `M${f(x)} ${f(y)}l${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}`
  }
  const x = (v: number) => f(cx + v)
  return (
    `<ellipse cx="${cx}" cy="${cy}" rx="22" ry="17" fill="#fff" stroke="none" filter="url(#dog-soft)"/>` +
    `<path d="${fur}" stroke-width="3.4" stroke-opacity="0.72"/>` +
    `<path d="M${x(-24)} ${f(cy - 1 - tilt)} C${x(-13)} ${f(cy + 9)} ${x(12)} ${f(cy + 10)} ${x(24)} ${f(cy - 2 + tilt)}" stroke-width="7" stroke-opacity="0.95"/>` +
    `<path d="M${x(-20)} ${f(cy + 2 - tilt)} C${x(-9)} ${f(cy + 10)} ${x(9)} ${f(cy + 11)} ${x(20)} ${f(cy + 1 + tilt)}" stroke-width="3" stroke-opacity="0.5"/>` +
    `<path d="M${x(-14)} ${f(cy + 7)} l-4 8 M${x(-3)} ${f(cy + 10)} l-1 9 M${x(9)} ${f(cy + 9)} l3 8 M${x(18)} ${f(cy + 5)} l5 7" stroke-width="3" stroke-opacity="0.85"/>`
  )
}

const box = `x="-50" y="-50" width="${DOG_WIDTH + 100}" height="${DOG_HEIGHT + 100}"`
const layer = (mask: string) => `<image href="${DOG_IMAGE}" width="${DOG_WIDTH}" height="${DOG_HEIGHT}" mask="url(#${mask})"/>`

export const DOG_MARKUP =
  `<defs>` +
  `<filter id="dog-feather" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"/></filter>` +
  `<filter id="dog-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.5"/></filter>` +
  `<mask id="dog-m-rest" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#fff"/>` +
  `<path d="${HEAD}" fill="#000" filter="url(#dog-feather)"/><path d="${TAIL}" fill="#000" filter="url(#dog-feather)"/></mask>` +
  `<mask id="dog-m-head" maskUnits="userSpaceOnUse" ${box}><path d="${HEAD}" fill="#fff" filter="url(#dog-feather)"/></mask>` +
  `<mask id="dog-m-tail" maskUnits="userSpaceOnUse" ${box}><path d="${TAIL}" fill="#fff" filter="url(#dog-feather)"/></mask>` +
  `</defs>` +
  `<g class="dog__tail">${layer("dog-m-tail")}</g>` +
  layer("dog-m-rest") +
  `<g class="dog__head">${layer("dog-m-head")}` +
  `<g class="dog__eye-closed" fill="none" stroke="#333" stroke-linecap="round">${closedEye(399, 192, -1)}${closedEye(531, 214, 2)}</g>` +
  `</g>` +
  // Motion lines beside the tail, only while it wags
  `<g class="dog__wag" fill="none" stroke="#333" stroke-linecap="round">` +
  `<path d="M1372 690 C1386 706 1390 726 1384 748" stroke-width="4" stroke-opacity="0.75"/>` +
  `<path d="M1398 676 C1416 698 1420 728 1410 758" stroke-width="3" stroke-opacity="0.5"/></g>`
