/**
 * The footer dog's drawing: a pencil sketch of the puppy asleep, lying flat
 * with his head on his paws (/images/site/dog-asleep.webp, its paper made
 * transparent and cropped to the drawing).
 *
 * It's cut in two so the tail can wag: the tail on its own, and the rest of
 * him. The rest stops ~35px short of where the tail leaves the rump, so at
 * that join the two overlap rather than fade into each other — two fades
 * meeting half-cover the pencil and thin it into a pale line.
 *
 * All coordinates are the drawing's own pixels.
 */

export const DOG_IMAGE = "/images/site/dog-asleep.webp"
export const DOG_WIDTH = 1422
export const DOG_HEIGHT = 519
export const DOG_VIEWBOX = `0 0 ${DOG_WIDTH} ${DOG_HEIGHT}`

/** Where the z's float up from: just above his head (fractions of the box). */
export const DOG_ANCHORS = { z: [0.34, 0.02] } as const

// The tail: the feathered wedge trailing off to the right, from where it
// leaves the rump — and that same shape stopped short of the rump, for what
// the rest of him leaves out. Its outer edges sit out in the blank paper, clear
// of the fur's tips, so none are left behind on the rump when it swings.
const TAIL = "M1236 312 L1262 316 L1300 328 L1345 358 L1395 394 L1422 418 L1422 450 L1350 454 L1290 456 L1250 456 L1238 430 L1233 380 Z"
const TAIL_CUT = "M1272 319 L1300 328 L1345 358 L1395 394 L1422 418 L1422 450 L1350 454 L1290 456 L1276 455 L1270 400 Z"

// Where the overlap is, the tail fades in from nothing, so as it swings its
// root ghosts softly over the rump rather than laying a hard-edged copy of the
// fur on it. It's fully in by 1262, before the rest starts to give way at
// ~1270, so at rest nothing is ever half there.
const TAIL_FADE = [1236, 1262] as const

const box = `x="-50" y="-50" width="${DOG_WIDTH + 100}" height="${DOG_HEIGHT + 100}"`
const feather = (id: string) =>
  `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"/></filter>`
const layer = (mask: string) => `<image href="${DOG_IMAGE}" width="${DOG_WIDTH}" height="${DOG_HEIGHT}" mask="url(#${mask})"/>`

// Each piece is its own <svg>, stacked in the same box, and the wag moves the
// tail's <svg> as a whole. Animating the tail inside one shared <svg> repainted
// the whole drawing every frame, and a bitmap repainted that often is scaled
// at a lower quality — all of him went soft for as long as the tail moved.

/** Everything but the tail. Never animates, so it's drawn once and stays sharp. */
export const DOG_BODY =
  `<defs>${feather("dog-f-rest")}` +
  `<mask id="dog-m-rest" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#fff"/><path d="${TAIL_CUT}" fill="#000" filter="url(#dog-f-rest)"/></mask>` +
  `</defs>` +
  layer("dog-m-rest")

/** The tail alone. It swings from where it leaves the rump — see dog.css. */
export const DOG_TAIL =
  `<defs>${feather("dog-f-tail")}` +
  `<linearGradient id="dog-g-tail" gradientUnits="userSpaceOnUse" x1="${TAIL_FADE[0]}" y1="0" x2="${TAIL_FADE[1]}" y2="0">` +
  `<stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>` +
  `<mask id="dog-m-tail" maskUnits="userSpaceOnUse" ${box}><path d="${TAIL}" fill="url(#dog-g-tail)" filter="url(#dog-f-tail)"/></mask>` +
  `</defs>` +
  layer("dog-m-tail")

/** The tail's pivot, as a fraction of the box: the middle of its root, so the root barely moves. */
export const DOG_TAIL_PIVOT = [1256 / DOG_WIDTH, 388 / DOG_HEIGHT] as const

/** Motion lines beyond the tip, shown only while it wags. */
export const DOG_WAG_LINES =
  `<g fill="none" stroke="#333" stroke-linecap="round">` +
  `<path d="M1430 398 C1444 414 1448 434 1442 456" stroke-width="4" stroke-opacity="0.75"/>` +
  `<path d="M1456 384 C1474 406 1478 436 1468 466" stroke-width="3" stroke-opacity="0.5"/></g>`
