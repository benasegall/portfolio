/**
 * The footer dog's drawing: the owner's pencil sketch of the puppy asleep,
 * lying flat with his head on his paws, its paper made transparent.
 *
 * It comes in two pieces so the tail can wag:
 * - /images/site/dog-asleep.webp — all of him but the tail.
 * - /images/site/dog-tail.webp — the tail on its own. It's the long, feathered
 *   tail from the owner's sketch of him awake, set on the sleeping rump. It's
 *   taken from just past its own dark root, so the join is the rump's hatching
 *   alone: the two sketches' dark roots stacked on each other were near black.
 *
 * All coordinates are the sleeping drawing's own pixels.
 */

export const DOG_WIDTH = 1422
export const DOG_HEIGHT = 519
export const DOG_VIEWBOX = `0 0 ${DOG_WIDTH} ${DOG_HEIGHT}`

/** Where the z's float up from: just above his head (fractions of the box). */
export const DOG_ANCHORS = { z: [0.34, 0.02] } as const

// Each piece is its own <svg>, stacked in the same box, and the wag moves the
// tail's <svg> as a whole. Animating the tail inside one shared <svg> repainted
// the whole drawing every frame, and a bitmap repainted that often is scaled
// at a lower quality — all of him went soft for as long as the tail moved.

/** Everything but the tail. Never animates, so it's drawn once and stays sharp. */
export const DOG_BODY = `<image href="/images/site/dog-asleep.webp" width="${DOG_WIDTH}" height="${DOG_HEIGHT}"/>`

/** The tail alone, in the patch of the drawing it covers (it runs a little past the right edge). */
export const DOG_TAIL = `<image href="/images/site/dog-tail.webp" x="1150" y="250" width="330" height="269"/>`

/** The tail's pivot, as a fraction of the box: the middle of its root, so the root barely moves. */
export const DOG_TAIL_PIVOT = [1252 / DOG_WIDTH, 395 / DOG_HEIGHT] as const

/** Motion lines beyond the tip, shown only while it wags. */
export const DOG_WAG_LINES =
  `<g fill="none" stroke="#333" stroke-linecap="round">` +
  `<path d="M1440 436 C1454 450 1458 470 1452 492" stroke-width="4" stroke-opacity="0.75"/>` +
  `<path d="M1466 422 C1484 444 1488 474 1478 504" stroke-width="3" stroke-opacity="0.5"/></g>`
