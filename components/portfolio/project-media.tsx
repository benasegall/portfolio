"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { Slider, PlainCaption } from "@ocarignan/vitrine"
import type { SliderItem } from "@ocarignan/vitrine"
import "@ocarignan/vitrine/styles.css"
import type { MediaBlock } from "@/lib/portfolio-data"

/**
 * One horizontally-swiped gallery inside a project sheet. Ten images cost a
 * single screen of vertical space rather than ten, and the lightbox carries the
 * zoom — which is what makes the wide flow diagrams readable at all, since the
 * panel only ever shows them scaled down.
 *
 * Deliberately no `aspectRatio`: Vitrine cover-crops when one is set, and these
 * are UI screenshots where a crop eats content. `variant="row"` keeps each
 * image's own ratio, so panels vary in size within a gallery — a phone screen
 * is tall and narrow, a user flow short and wide. What organises them is the
 * card frame around each one (see `.project-media .slider__item-inner` in
 * globals.css) plus the track's bottom alignment, rather than forcing every
 * image into a single box.
 */
export function ProjectMedia({ block }: { block: MediaBlock }) {
  const rootRef = useRef<HTMLElement>(null)
  const [zoomOpen, setZoomOpen] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    /*
     * Vitrine hardcodes `loop: true` on both of its <video> elements, with no
     * prop to reach them. Because the value is a constant, React compares
     * true-to-true, never re-commits, and never touches the DOM property again
     * — so clearing it here sticks for the life of the element.
     *
     * Only the lightbox copy is unlooped. The panel loop is the moving
     * thumbnail that signals there is footage worth opening; the zoomed copy is
     * the one someone actually watches, and it should stop at the end rather
     * than silently restart. Muting is untouched: browsers reject programmatic
     * play() on an unmuted video with no user gesture, which is exactly how
     * Vitrine autoplays, so `muted` has to stay. Audio is reached through the
     * lightbox's own mute control, which `videoControls` surfaces.
     *
     * Re-check this against the bundle on any bump past vitrine 0.1.2.
     */
    const unloopLightbox = () => {
      root.querySelectorAll<HTMLVideoElement>(".lightbox video").forEach((video) => {
        video.loop = false
      })
    }

    /*
     * Whether the zoom is actually on screen. A closed lightbox stays in the
     * DOM as `.lightbox--closing` with `display: none`, so presence alone is
     * not the answer — `getClientRects()` is empty for a `display: none`
     * element and does not depend on Vitrine's state class names.
     */
    const syncZoomState = () => {
      const lightbox = root.querySelector(".lightbox")
      setZoomOpen(!!lightbox && lightbox.getClientRects().length > 0)
    }

    const onMutate = () => {
      unloopLightbox()
      syncZoomState()
    }

    // The lightbox mounts in place — Vitrine uses no portal — so watching our
    // own subtree is enough to catch it opening. Attributes matter too: closing
    // is a class change on an element that is already there, not a removal.
    const observer = new MutationObserver(onMutate)
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    })
    onMutate()

    return () => observer.disconnect()
  }, [])

  /*
   * Vitrine's own lightbox chrome is turned off, so this replaces it with the
   * sheet's close button, to keep one dismiss control across the whole site.
   * Dispatching Escape on `window` is what closes it: Vitrine listens there,
   * while the sheet's own Escape handler is on `document` — and an event
   * dispatched directly on window never reaches document listeners, so this
   * shuts the zoom without also closing the sheet behind it.
   */
  const closeZoom = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
  }

  if (block.embed) {
    return (
      <figure className="project-media -mx-4 my-2 md:-mx-10">
        <figcaption className="mb-3 px-4 text-base font-bold tracking-tight text-foreground md:px-10">
          {block.title}
        </figcaption>
        <div className="px-4 md:px-10">
          {/* Same frame as a gallery panel, so a player sits in the run of
              images rather than beside it. */}
          <div className="rounded-[1.25rem] bg-card p-2 shadow-[0_1px_2px_rgb(0_0_0/0.03)]">
            <div className="relative aspect-video w-full overflow-hidden rounded-[0.75rem] bg-muted">
              <iframe
                src={block.embed.src}
                title={block.embed.title}
                loading="lazy"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      </figure>
    )
  }

  const items: SliderItem[] = block.items.map((item, index) => ({
    id: `${block.id}-${index}`,
    src: item.src,
    highResSrc: item.highResSrc,
    video: item.video,
    alt: item.alt,
  }))

  return (
    // Pulls back the text column's own padding so the track runs the full
    // 45rem measure, leaving room for the neighbouring panels to peek.
    <figure ref={rootRef} className="project-media -mx-4 my-2 md:-mx-10">
      <figcaption className="mb-3 px-4 text-base font-bold tracking-tight text-foreground md:px-10">
        {block.title}
      </figcaption>

      <Slider
        items={items}
        Caption={PlainCaption}
        // Width of the active panel. Landscape shots fill it; portrait phone
        // screens hit maxItemHeight first and settle narrower, which is why no
        // per-orientation config is needed.
        contentWidth={560}
        // Governs for portrait items (560/0.51 would be 1100px tall). Keeps a
        // phone screen to a sensible height and lets neighbours show.
        maxItemHeight={460}
        gap={16}
        sideMargin={24}
        // The zoom. Default anyway, but stated because the homepage slider
        // turns it off and the difference between the two matters.
        lightbox
        // Surfaces the lightbox playback bar, and with it the mute control that
        // is the only route to audio.
        videoControls={block.videoControls}
      />

      {zoomOpen ? (
        <button
          type="button"
          aria-label="Close image"
          onClick={closeZoom}
          className="fixed right-6 top-6 z-[110] flex size-10 cursor-pointer items-center justify-center rounded-full bg-card text-foreground shadow-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:right-8 md:top-8"
        >
          <X aria-hidden="true" />
        </button>
      ) : null}
    </figure>
  )
}
