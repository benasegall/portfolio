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
/*
 * Where each panel has to sit for the track to call it the current one: the
 * `scrollLeft` that puts its left edge just inside the track's start padding.
 * Clamped, because the last panels can never reach the start — the track runs
 * out of scroll before they get there, and a target the track cannot reach is
 * exactly what made the controls look broken.
 */
function panelStops(track: HTMLElement): number[] {
  const trackLeft = track.getBoundingClientRect().left
  const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0
  const end = Math.max(0, track.scrollWidth - track.clientWidth)
  return Array.from(
    track.querySelectorAll<HTMLElement>(".slider__item:not([data-clone])"),
  ).map((panel) => {
    const stop =
      track.scrollLeft + panel.getBoundingClientRect().left - trackLeft - pad
    return Math.min(end, Math.max(0, Math.round(stop)))
  })
}

export function ProjectMedia({ block }: { block: MediaBlock }) {
  const rootRef = useRef<HTMLElement>(null)
  const [zoomOpen, setZoomOpen] = useState(false)

  /*
   * Stamp each panel image with its own pixel size.
   *
   * Vitrine sizes a panel image `width: auto` and caps it with max-width /
   * max-height, which is correct for a loaded image and 0 for one that has not
   * arrived — an <img> with no intrinsic size contributes no width. It also
   * marks everything past the first two panels `loading="lazy"`. The two
   * together collapsed every unloaded panel to the 16px of card padding: the
   * Identity gallery laid out as two panels and three 16px slivers 32px apart,
   * the track's scrollWidth shrank to match, and the panels past the fold
   * could not be reached at all — which is what left the arrows and dots
   * addressing slides that were not there, and why the back arrow did nothing.
   *
   * `width` and `height` attributes give the browser an intrinsic ratio up
   * front, so the panel reserves its true size before the file arrives and the
   * caps resolve against real numbers. It also removes the layout shift as
   * each image lands. Vitrine's SliderItem has no width/height field, so this
   * is applied to the DOM it renders; the values come from the data, and are
   * set only where they are missing so a re-render costs nothing.
   */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const sizeByPanelSrc = new Map(
      block.items.map((item) => [item.src, item] as const),
    )

    const stampSizes = () => {
      root.querySelectorAll<HTMLImageElement>(".slider__item img").forEach((image) => {
        if (image.getAttribute("width")) return
        // `src` is absolute once rendered; the data holds a root-relative path.
        const item = sizeByPanelSrc.get(new URL(image.src).pathname)
        if (!item) return
        image.setAttribute("width", String(item.width))
        image.setAttribute("height", String(item.height))
        // The attributes alone do not size an image that has not loaded: they
        // set a default ratio, and a ratio needs a definite axis to resolve
        // against. Both axes are `auto` here, so the ratio also goes out as a
        // custom property that the stylesheet can turn into a real width.
        image.style.setProperty("--panel-ratio", String(item.width / item.height))
      })
    }

    stampSizes()
    const sizeObserver = new MutationObserver(stampSizes)
    sizeObserver.observe(root, { childList: true, subtree: true })
    return () => sizeObserver.disconnect()
  }, [block.items])

  /*
   * Take over the arrows, the dots and the keyboard from Vitrine, and drive the
   * track from where it actually is.
   *
   * Vitrine navigates by index: the arrows step its own `activeIndex`, hand the
   * matching panel to `scrollIntoView({ behavior: "smooth" })` and grey
   * themselves out whenever that index is at either end. Both halves are the
   * bug. The index is written by clicks but only loosely by scrolling, so after
   * a drag or a trackpad swipe it no longer names the panel on screen — and at
   * that point the back arrow is either pointing at a slide behind the one you
   * are looking at or sitting `disabled`, and a disabled button does not emit a
   * click at all, so nothing we could listen for ever fires. The smooth scroll
   * is the second half: it is one animation the browser will drop on its own —
   * reduced-motion settings, an interrupted scroll, an automated browser — and
   * when it is dropped the call is silently a no-op.
   *
   * So the panel stops are measured off the DOM on every click and the track is
   * moved by hand. "Back" is the last stop left of here, "forward" the first
   * stop right of here, both read from the live `scrollLeft` rather than from
   * any remembered index — which also makes a half-scrolled position, where no
   * index is strictly true, do the obvious thing. Snapping goes off for the
   * duration, as Vitrine does for its own drag, so the mandatory snap does not
   * pull each frame onto a panel edge and turn the glide into a series of
   * jumps.
   *
   * Clicks are caught on the way down and stopped, so Vitrine's own handler
   * never runs and never fights the animation with a scroll of its own. That
   * leaves the arrows' disabled state and the active dot to us: `sync` writes
   * both from the same measurements, on every scroll, and again after any
   * re-render that puts Vitrine's version back.
   */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const trackOf = () => root.querySelector<HTMLElement>(".slider__track")

    // Guards the sync against its own writes: the observer below watches the
    // very attributes it sets.
    let writing = false
    const sync = () => {
      const track = trackOf()
      if (!track) return
      const here = track.scrollLeft
      const end = Math.max(0, track.scrollWidth - track.clientWidth)
      const stops = panelStops(track)
      let active = 0
      stops.forEach((stop, index) => {
        // `<=` so a run of panels stacked against the end resolves to the last
        // of them, which is the one the dots should be pointing at there.
        if (Math.abs(stop - here) <= Math.abs(stops[active] - here)) active = index
      })

      writing = true
      root.querySelectorAll<HTMLButtonElement>(".slider__nav").forEach((nav) => {
        const spent =
          nav.getAttribute("aria-label") === "Previous" ? here <= 1 : here >= end - 1
        if (nav.disabled !== spent) nav.disabled = spent
      })
      root.querySelectorAll<HTMLElement>(".slider__dot").forEach((dot, index) => {
        dot.classList.toggle("slider__dot--active", index === active)
        const current = index === active ? "true" : null
        if (dot.getAttribute("aria-current") !== current) {
          if (current) dot.setAttribute("aria-current", current)
          else dot.removeAttribute("aria-current")
        }
      })
      writing = false
    }

    let frame = 0
    let land = 0
    let snapping = ""
    const glide = (track: HTMLElement, to: number) => {
      const from = track.scrollLeft
      const distance = to - from
      if (Math.abs(distance) < 1) return
      // Restored the moment the glide lands, so a flick or a wheel still snaps.
      if (!frame) snapping = track.style.scrollSnapType
      if (frame) cancelAnimationFrame(frame)
      clearTimeout(land)
      track.style.scrollSnapType = "none"
      const started = performance.now()
      const ms = Math.min(520, 240 + Math.abs(distance) * 0.32)
      const settle = () => {
        if (frame) cancelAnimationFrame(frame)
        frame = 0
        track.scrollLeft = to
        track.style.scrollSnapType = snapping
        // Scroll events are the usual trigger for this, and they are the other
        // thing a browser stops delivering when it is not painting.
        sync()
      }
      const step = (now: number) => {
        const t = Math.min(1, (now - started) / ms)
        track.scrollLeft = from + distance * (1 - Math.pow(1 - t, 3))
        if (t < 1) {
          frame = requestAnimationFrame(step)
          return
        }
        clearTimeout(land)
        settle()
      }
      frame = requestAnimationFrame(step)
      /*
       * The glide is a nicety; arriving is not. Animation frames stop being
       * delivered in a backgrounded tab, and some browsers suppress them
       * outright — which is the same hole Vitrine's smooth `scrollIntoView`
       * falls into, a control that silently does nothing. This timer is the
       * floor: however the animation fares, the track is at the panel by the
       * time it fires.
       */
      land = window.setTimeout(settle, ms + 80)
    }

    // Reports whether there was anywhere to go, so the keyboard can leave the
    // key alone when there is not.
    const stepBy = (direction: 1 | -1) => {
      const track = trackOf()
      if (!track) return false
      const stops = panelStops(track)
      const here = track.scrollLeft
      const to =
        direction < 0
          ? [...stops].reverse().find((stop) => stop < here - 1)
          : stops.find((stop) => stop > here + 1)
      if (to === undefined) return false
      glide(track, to)
      return true
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const control = target.closest(".slider__nav, .slider__dot")
      if (!control || !root.contains(control)) return
      event.preventDefault()
      event.stopPropagation()

      const track = trackOf()
      if (!track) return
      if (control.classList.contains("slider__dot")) {
        const dots = Array.from(root.querySelectorAll(".slider__dot"))
        const stop = panelStops(track)[dots.indexOf(control)]
        if (stop !== undefined) glide(track, stop)
        return
      }
      stepBy(control.getAttribute("aria-label") === "Previous" ? -1 : 1)
    }

    /*
     * Vitrine takes the arrow keys whenever the pointer is over a slider or the
     * focus is inside one — an arrow button keeps focus after a click, so that
     * is most of the time here — and runs them through the same broken index.
     * Matching its trigger and stopping the event on the way down is what keeps
     * that path from running at all.
     */
    let hovering = false
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
      const focused = document.activeElement
      if (!hovering && !(focused && root.contains(focused))) return
      if (root.querySelector(".lightbox")?.getClientRects().length) return
      if (!stepBy(event.key === "ArrowLeft" ? -1 : 1)) return
      event.preventDefault()
      event.stopPropagation()
    }

    const onEnter = () => {
      hovering = true
      // Re-reads the controls before the pointer can use them, so a scroll the
      // listener below happened to miss cannot leave an arrow greyed out.
      sync()
    }
    const onLeave = () => (hovering = false)

    root.addEventListener("click", onClick, true)
    // Scroll does not bubble, so the capture phase is how one listener covers a
    // track that mounts after this runs.
    root.addEventListener("scroll", sync, true)
    root.addEventListener("pointerenter", onEnter)
    root.addEventListener("pointerleave", onLeave)
    window.addEventListener("keydown", onKeyDown, true)
    window.addEventListener("resize", sync)

    const observer = new MutationObserver(() => {
      if (!writing) sync()
    })
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "disabled", "aria-current", "style"],
    })
    sync()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      clearTimeout(land)
      observer.disconnect()
      root.removeEventListener("click", onClick, true)
      root.removeEventListener("scroll", sync, true)
      root.removeEventListener("pointerenter", onEnter)
      root.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("keydown", onKeyDown, true)
      window.removeEventListener("resize", sync)
    }
  }, [])

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

  /*
   * A gallery of one is not a gallery — there is nothing to page to, so arrows
   * that are permanently disabled and a single dot would advertise a scroll
   * that isn't there. Several blocks hold exactly one image (`user-flows`,
   * `tutorials`, `research`, `where-it-lives`), and they keep the bare panel.
   */
  const scrollable = items.length > 1

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
        /*
         * The scroll cue. Nothing in a bottom-aligned row of mixed-size panels
         * says it moves sideways — the peek of the next image reads as a crop
         * as easily as a hint — so these state it outright. Both render in
         * `.slider__controls`, a sibling of the track and outside the
         * lightbox's own markup, so the zoomed view stays chrome-free; its
         * separate `lightboxControls` prop is left off. Sized down to a single
         * small row in globals.css — see `.project-media .slider__controls`.
         */
        arrows={scrollable}
        pagination={scrollable}
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
