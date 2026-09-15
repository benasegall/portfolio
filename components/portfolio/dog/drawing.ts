/**
 * The footer dog's drawing: the pencil sketch in /images/site/dog.webp (its
 * paper made transparent, cropped to the drawing), cut into three layers so
 * parts of it can move — the body, the head with its ears, and the tail.
 *
 * Each moving layer is the whole image under a feathered mask. The body
 * layer's cut-outs stop short of where the head and tail join him, so at
 * each join the two layers overlap rather than fade into each other. Two
 * fades meeting leave the pencil half-covered by both, which thinned it into
 * a pale line across his chest; an overlap only ever lays the same strokes
 * over themselves, so it doesn't show.
 *
 * The head layer also fades out below the chin. Asleep, his head dips and
 * slides over his chest, so the fur there would be drawn twice and read as a
 * dark band; the fade lets the head's copy give way to the body's. It starts
 * below where the body takes over, so awake there is no thin spot.
 *
 * Over the head sit the closed eyes: the sketch has him awake, so asleep a
 * soft cover takes out each eye and the sketch's own cheek fur, from just
 * below, is laid over the gap — a clone, so the texture is the drawing's
 * rather than an imitation of it. A single fine pencil arc sits over each:
 * the closed lid. Awake, they simply go, and his eyes are the sketch's own.
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
// What the body layer leaves out: the same shapes, stopping ~40px short of
// the chin and ~35px short of the rump, so each join is an overlap.
const HEAD_CUT = "M200 120 L262 40 L380 4 L520 10 L622 58 L694 158 L704 262 L664 342 L580 364 L452 390 L330 378 L250 372 L204 262 Z"
const TAIL_CUT = "M1166 598 L1192 584 L1278 644 L1352 700 L1352 752 L1280 742 L1210 720 L1178 698 L1168 650 Z"

/** Where the moving parts turn, and where things float up from (fractions of the box). */
export const DOG_PIVOTS = { head: "452px 440px", tail: "1140px 640px" }
export const DOG_ANCHORS = { z: [0.4, 0.04] } as const

const f = (n: number) => n.toFixed(1)

/**
 * The closed eyes: where they sit, how big a cover each needs, and where its
 * borrowed fur comes from (an offset to a patch of plain fur nearby). The
 * right eye has a heavy dark socket on its lower side and dark fur below it,
 * so its cover is larger and its fur comes from between the eyes instead.
 */
const EYES = [
  { cx: 399, cy: 193, rx: 29, ry: 23, tilt: -1, from: [0, 44] },
  { cx: 534, cy: 217, rx: 32, ry: 26, tilt: 2, from: [-56, 4] },
] as const

function closedEye(cx: number, cy: number, tilt: number) {
  const x = (v: number) => f(cx + v)
  // The lid: one fine arc bowing upward, drawn twice as a pencil would
  const arc = (dy: number) =>
    `M${x(-23)} ${f(cy + 4 + dy - tilt)} C${x(-12)} ${f(cy - 6 + dy)} ${x(11)} ${f(cy - 7 + dy)} ${x(23)} ${f(cy + 3 + dy + tilt)}`
  return (
    `<path d="${arc(5)}" stroke-width="4.6" stroke-opacity="0.92"/>` +
    `<path d="${arc(6.6)}" stroke-width="2.4" stroke-opacity="0.45"/>`
  )
}

// Wide enough that the soft edge falls outside the eye's dark ring, or a ghost of it shows
const cover = (e: (typeof EYES)[number]) => `<ellipse cx="${e.cx}" cy="${e.cy}" rx="${e.rx}" ry="${e.ry}"/>`

const box = `x="-50" y="-50" width="${DOG_WIDTH + 100}" height="${DOG_HEIGHT + 100}"`
const layer = (mask: string) => `<image href="${DOG_IMAGE}" width="${DOG_WIDTH}" height="${DOG_HEIGHT}" mask="url(#${mask})"/>`

export const DOG_MARKUP =
  `<defs>` +
  `<filter id="dog-feather" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"/></filter>` +
  `<filter id="dog-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.5"/></filter>` +
  `<mask id="dog-m-rest" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#fff"/>` +
  `<path d="${HEAD_CUT}" fill="#000" filter="url(#dog-feather)"/><path d="${TAIL_CUT}" fill="#000" filter="url(#dog-feather)"/></mask>` +
  `<linearGradient id="dog-chin" gradientUnits="userSpaceOnUse" x1="0" y1="398" x2="0" y2="440"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>` +
  `<mask id="dog-m-head" maskUnits="userSpaceOnUse" ${box}><path d="${HEAD}" fill="url(#dog-chin)" filter="url(#dog-feather)"/></mask>` +
  `<mask id="dog-m-tail" maskUnits="userSpaceOnUse" ${box}><path d="${TAIL}" fill="#fff" filter="url(#dog-feather)"/></mask>` +
  EYES.map((e, i) => `<mask id="dog-m-eye${i}" maskUnits="userSpaceOnUse" ${box}><g fill="#fff" filter="url(#dog-soft)">${cover(e)}</g></mask>`).join("") +
  `</defs>` +
  `<g class="dog__tail">${layer("dog-m-tail")}</g>` +
  layer("dog-m-rest") +
  `<g class="dog__head">${layer("dog-m-head")}` +
  `<g class="dog__eye-closed">` +
  // Paper over the open eyes, then the cheek fur from just below laid over it
  `<g fill="#fff" filter="url(#dog-soft)">${EYES.map(cover).join("")}</g>` +
  EYES.map((e, i) => `<image href="${DOG_IMAGE}" x="${-e.from[0]}" y="${-e.from[1]}" width="${DOG_WIDTH}" height="${DOG_HEIGHT}" mask="url(#dog-m-eye${i})"/>`).join("") +
  `<g fill="none" stroke="#333" stroke-linecap="round">${EYES.map((e) => closedEye(e.cx, e.cy, e.tilt)).join("")}</g>` +
  `</g>` +
  `</g>` +
  // Motion lines beside the tail, only while it wags
  `<g class="dog__wag" fill="none" stroke="#333" stroke-linecap="round">` +
  `<path d="M1372 690 C1386 706 1390 726 1384 748" stroke-width="4" stroke-opacity="0.75"/>` +
  `<path d="M1398 676 C1416 698 1420 728 1410 758" stroke-width="3" stroke-opacity="0.5"/></g>`
