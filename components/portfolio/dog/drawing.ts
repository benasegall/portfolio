/**
 * The footer dog's drawings: two pencil sketches of the same puppy, one
 * asleep and one awake, each with its paper made transparent and cropped to
 * the drawing.
 *
 *   /images/site/dog-asleep.webp — lying flat, head down on his paws
 *   /images/site/dog.webp        — lying down, head up, looking at you
 *
 * Both came from the same 1536 × 1024 canvas at the same scale, so they share
 * one box: the sleeping drawing sits along its bottom and the awake one fills
 * it, their paws on the same ground line. dog.css cross-fades between them.
 *
 * The awake drawing is cut in two so the tail can wag: the tail on its own,
 * and the rest of him. The rest stops ~35px short of where the tail leaves
 * the rump, so at that join the two overlap rather than fade into each other
 * — two fades meeting half-cover the pencil and thin it into a pale line.
 *
 * All coordinates are the shared box's own pixels.
 */

export const DOG_WIDTH = 1422
export const DOG_HEIGHT = 808
export const DOG_VIEWBOX = `0 0 ${DOG_WIDTH} ${DOG_HEIGHT}`

const ASLEEP = { href: "/images/site/dog-asleep.webp", x: 0, y: 289, width: 1422, height: 519 }
const AWAKE = { href: "/images/site/dog.webp", x: 18, y: 0, width: 1351, height: 808 }

/** How much of the box, from the bottom, the sleeping drawing takes up. */
export const DOG_ASLEEP_HEIGHT = ASLEEP.height / DOG_HEIGHT

/** Where the z's float up from: just above his head in the sleeping drawing (fractions of the box). */
export const DOG_ANCHORS = { z: [0.34, 0.36] } as const

// The awake drawing's tail, from where it leaves the rump — and that same
// shape stopped short of the rump, for what the rest of him leaves out.
const TAIL = "M1146 612 L1152 578 L1210 584 L1296 644 L1370 700 L1370 752 L1298 742 L1228 720 L1182 692 L1158 660 Z"
const TAIL_CUT = "M1184 598 L1210 584 L1296 644 L1370 700 L1370 752 L1298 742 L1228 720 L1196 698 L1186 650 Z"

const box = `x="-50" y="-50" width="${DOG_WIDTH + 100}" height="${DOG_HEIGHT + 100}"`
const image = (d: typeof ASLEEP, mask?: string) =>
  `<image href="${d.href}" x="${d.x}" y="${d.y}" width="${d.width}" height="${d.height}"${mask ? ` mask="url(#${mask})"` : ""}/>`

export const DOG_MARKUP =
  `<defs>` +
  `<filter id="dog-feather" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"/></filter>` +
  `<mask id="dog-m-rest" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#fff"/><path d="${TAIL_CUT}" fill="#000" filter="url(#dog-feather)"/></mask>` +
  `<mask id="dog-m-tail" maskUnits="userSpaceOnUse" ${box}><path d="${TAIL}" fill="#fff" filter="url(#dog-feather)"/></mask>` +
  `</defs>` +
  `<g class="dog__asleep">${image(ASLEEP)}</g>` +
  `<g class="dog__awake">` +
  `<g class="dog__tail">${image(AWAKE, "dog-m-tail")}</g>` +
  image(AWAKE, "dog-m-rest") +
  // Motion lines beside the tail, only while it wags
  `<g class="dog__wag" fill="none" stroke="#333" stroke-linecap="round">` +
  `<path d="M1390 690 C1404 706 1408 726 1402 748" stroke-width="4" stroke-opacity="0.75"/>` +
  `<path d="M1416 676 C1434 698 1438 728 1428 758" stroke-width="3" stroke-opacity="0.5"/></g>` +
  `</g>`
