/**
 * The footer dog's drawing: the pencil sketch in /images/site/dog.webp (its
 * paper made transparent, cropped to the drawing), cut into layers so parts
 * of it can move — the body, the head with its ears, and the tail.
 *
 * Each layer is the whole image under a feathered mask. Where two layers
 * meet, one always overlaps the other rather than the two fading into each
 * other: two fades meeting leave the pencil half-covered by both, which thins
 * it into a pale line (it did, across his chest).
 *
 * The head dips when he's asleep, which is what the body's masks are built
 * around:
 * - The body leaves out the whole head, so asleep, with the head lowered over
 *   his chest, the fur under his chin is drawn once — by the head — rather
 *   than twice, which read as a dark band. The lowered head still reaches
 *   12px past that cut (the translateY in dog.css), so its edge lies over
 *   body rather than meeting the cut's own fade.
 * - Awake, the head is back up and a band of the body fades back in around
 *   it (`dog__band`, faded by dog.css in step with the head). It reaches just
 *   past the head's outline, so the head's soft edge always lies over solid
 *   body and never meets another fade.
 *
 * The closed eyes are the owner's own drawing of them, from a sleeping
 * version of the sketch (/images/site/dog-eyes.webp, paper made transparent
 * the same way). Asleep, a soft cover takes out each open eye and that
 * drawing is laid over it, scaled and turned so both of its closed eyes land
 * on the sketch's open ones. Awake, they go, and his eyes are the sketch's.
 *
 * All coordinates are the cropped drawing's own pixels.
 */

export const DOG_IMAGE = "/images/site/dog.webp"
const EYES_IMAGE = "/images/site/dog-eyes.webp"
export const DOG_WIDTH = 1351
export const DOG_HEIGHT = 808
export const DOG_VIEWBOX = `0 0 ${DOG_WIDTH} ${DOG_HEIGHT}`

// The head and both ears, down to the neck; the tail, from where it leaves the rump.
const HEAD = "M200 120 L262 40 L380 4 L520 10 L622 58 L694 158 L704 262 L664 342 L566 402 L452 432 L330 414 L250 372 L204 262 Z"
const TAIL = "M1128 612 L1134 578 L1192 584 L1278 644 L1352 700 L1352 752 L1280 742 L1210 720 L1164 692 L1140 660 Z"
// The head stopped ~40px short of the chin: what stays head-only when he's awake.
const HEAD_CUT = "M200 120 L262 40 L380 4 L520 10 L622 58 L694 158 L704 262 L664 342 L580 364 L452 390 L330 378 L250 372 L204 262 Z"
// The tail stopped ~35px short of the rump, so the tail's join is an overlap too.
const TAIL_CUT = "M1166 598 L1192 584 L1278 644 L1352 700 L1352 752 L1280 742 L1210 720 L1178 698 L1168 650 Z"

/** Where the moving parts turn, and where things float up from (fractions of the box). */
export const DOG_PIVOTS = { head: "452px 440px", tail: "1140px 640px" }
export const DOG_ANCHORS = { z: [0.4, 0.04] } as const

/**
 * The closed eyes. `covers` take out the sketch's open eyes (the right one is
 * larger, for its heavy dark socket). The eyes drawing is 335 × 185; its two
 * closed eyes sit at (88, 88) and (228, 102), and this transform — scale
 * 0.951, turned 3.75° — puts them on the open eyes at (399, 192) and
 * (531, 214).
 */
const EYE_COVERS = [
  { cx: 399, cy: 191, rx: 34, ry: 25 },
  { cx: 534, cy: 215, rx: 36, ry: 27 },
] as const
const EYES_TRANSFORM = "matrix(0.949 0.0622 -0.0622 0.949 320.96 103.02)"

const box = `x="-50" y="-50" width="${DOG_WIDTH + 100}" height="${DOG_HEIGHT + 100}"`
const layer = (mask: string) => `<image href="${DOG_IMAGE}" width="${DOG_WIDTH}" height="${DOG_HEIGHT}" mask="url(#${mask})"/>`
const covers = EYE_COVERS.map((e) => `<ellipse cx="${e.cx}" cy="${e.cy}" rx="${e.rx}" ry="${e.ry}"/>`).join("")

export const DOG_MARKUP =
  `<defs>` +
  `<filter id="dog-feather" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"/></filter>` +
  `<filter id="dog-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.5"/></filter>` +
  // Body: everything but the head and the tail
  `<mask id="dog-m-rest" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#fff"/>` +
  `<g fill="#000" filter="url(#dog-feather)"><path d="${HEAD}"/><path d="${TAIL_CUT}"/></g></mask>` +
  // The band of body that comes back around the head when he's awake: the
  // head's outline widened by 16px, less the part that is head only
  `<mask id="dog-m-band" maskUnits="userSpaceOnUse" ${box}>` +
  `<path d="${HEAD}" fill="#fff" stroke="#fff" stroke-width="32" stroke-linejoin="round" filter="url(#dog-feather)"/>` +
  `<path d="${HEAD_CUT}" fill="#000" filter="url(#dog-feather)"/></mask>` +
  `<mask id="dog-m-head" maskUnits="userSpaceOnUse" ${box}><path d="${HEAD}" fill="#fff" filter="url(#dog-feather)"/></mask>` +
  `<mask id="dog-m-tail" maskUnits="userSpaceOnUse" ${box}><path d="${TAIL}" fill="#fff" filter="url(#dog-feather)"/></mask>` +
  `<mask id="dog-m-eyes" maskUnits="userSpaceOnUse" ${box}><g fill="#fff" filter="url(#dog-soft)">${covers}</g></mask>` +
  `</defs>` +
  `<g class="dog__tail">${layer("dog-m-tail")}</g>` +
  layer("dog-m-rest") +
  `<g class="dog__band">${layer("dog-m-band")}</g>` +
  `<g class="dog__head">${layer("dog-m-head")}` +
  `<g class="dog__eye-closed">` +
  `<g fill="#fff" filter="url(#dog-soft)">${covers}</g>` +
  `<g mask="url(#dog-m-eyes)"><image href="${EYES_IMAGE}" width="335" height="185" transform="${EYES_TRANSFORM}"/></g>` +
  `</g>` +
  `</g>` +
  // Motion lines beside the tail, only while it wags
  `<g class="dog__wag" fill="none" stroke="#333" stroke-linecap="round">` +
  `<path d="M1372 690 C1386 706 1390 726 1384 748" stroke-width="4" stroke-opacity="0.75"/>` +
  `<path d="M1398 676 C1416 698 1420 728 1410 758" stroke-width="3" stroke-opacity="0.5"/></g>`
