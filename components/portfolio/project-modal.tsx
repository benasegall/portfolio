"use client"

import { Fragment, useEffect, useRef } from "react"
import { X } from "lucide-react"
import type { Project } from "@/lib/portfolio-data"
import { focusQuietly } from "@/lib/quiet-focus"
import { ItemList } from "./item-list"
import { ProjectMedia } from "./project-media"

type ProjectModalProps = {
  project: Project | null
  onClose: () => void
}

/**
 * Paints a paragraph's lead-in labels ("Scope.", "During.") in the foreground
 * colour, leaving the rest as body copy. Only the exact labels a project
 * declares are matched, and only where they open a sentence — so prose that
 * happens to contain the word is untouched.
 */
function withLeadIns(text: string, leadIns?: string[]) {
  if (!leadIns?.length) return text

  const parts: Array<string | React.ReactElement> = []
  let rest = text
  let key = 0

  while (rest.length > 0) {
    let hit: { at: number; label: string } | null = null

    for (const label of leadIns) {
      let at = rest.indexOf(label)
      while (at !== -1) {
        const opensSentence = at === 0 || rest.slice(at - 2, at) === ". "
        if (opensSentence) {
          if (!hit || at < hit.at) hit = { at, label }
          break
        }
        at = rest.indexOf(label, at + 1)
      }
    }

    if (!hit) {
      parts.push(rest)
      break
    }
    if (hit.at > 0) parts.push(rest.slice(0, hit.at))
    parts.push(
      <span key={key++} className="text-foreground">
        {hit.label}
      </span>,
    )
    rest = rest.slice(hit.at + hit.label.length)
  }

  return parts
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  /*
   * Focus management. `aria-modal` tells a screen reader's virtual cursor to
   * stay inside the dialog, but it does nothing to Tab — without this, opening
   * a sheet left focus on <body>, Tab wandered into the page behind it, and
   * closing dropped focus back to the top of the document.
   *
   * So: remember what opened the sheet, move focus inside, keep Tab within it,
   * and hand focus back on close.
   */
  useEffect(() => {
    if (!project) return
    const opener = document.activeElement as HTMLElement | null
    const sheet = sheetRef.current
    if (!sheet) return

    const focusable = () =>
      Array.from(
        sheet.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.getClientRects().length > 0)

    // The close button, so the first Tab lands somewhere predictable. Opened
    // by pointer it takes focus without a ring — see lib/quiet-focus.
    const first = focusable()[0]
    focusQuietly(first)

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return
      // While the zoom is open it owns the keyboard; let it through.
      const lightbox = document.querySelector(".lightbox")
      if (lightbox && lightbox.getClientRects().length > 0) return

      const items = focusable()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (!sheet.contains(active)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onTab)
    return () => {
      document.removeEventListener("keydown", onTab)
      // Back to the panel that opened it, so the keyboard keeps its place —
      // quietly, or a sheet reached by pointer would leave a ring around the
      // card on the way out. Unlocking a gated project means typing, which
      // the browser alone would read as keyboard use.
      focusQuietly(opener)
    }
  }, [project])

  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      // Vitrine's lightbox listens for Escape as well. Without this guard a
      // single press dismisses the zoomed image *and* the sheet behind it.
      //
      // Testing for rendered boxes rather than mere presence: a closed
      // lightbox stays in the DOM as `.lightbox--closing` with `display:
      // none`, so a presence check would keep matching forever and Escape
      // would stop closing the sheet after the first zoom. `getClientRects()`
      // is empty for a `display: none` element, and does not care what
      // Vitrine names its state classes.
      const lightbox = document.querySelector(".lightbox")
      if (lightbox && lightbox.getClientRects().length > 0) return
      onClose()
    }
    document.addEventListener("keydown", onKey)
    // A class rather than an inline style: Vitrine's lightbox writes
    // `document.body.style.overflow = ""` on close, which would release the
    // page behind a sheet that is still open. An !important rule in the
    // stylesheet outranks that inline write; a competing inline style would
    // not.
    document.body.classList.add("sheet-open")
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.classList.remove("sheet-open")
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <>
      {/*
        The tint and blur are their own layer, a sibling of the scrolling
        overlay rather than a child of it. Two separate constraints put it
        here, and both matter:

        It must not be an ANCESTOR of the sheet. `backdrop-filter` makes an
        element the containing block for every fixed-position descendant, and
        Vitrine's lightbox is `position: fixed` rendered in place with no
        portal — with the blur on the overlay, the zoom resolved `inset: 0`
        against the scrolled content and opened far off-screen.

        It must also not be INSIDE the scroll container. A `backdrop-filter`
        element within a scroller is re-rasterised as that scroller repaints,
        and the whole layer can blank for a frame — the flicker where the sheet
        appeared to vanish and come back while the pointer moved over it.

        Sitting outside both, it blurs exactly the same pixels with neither
        problem. It is painted first so the sheet stacks above it, and
        pointer-events-none leaves click-outside-to-close to the overlay.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
      />

      {/* The overlay scrolls, not the card — so the sheet is only as tall as
          its content and runs past the fold. Its bottom edge is revealed by
          scrolling to the end, rather than being fitted inside the viewport. */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onClick={onClose}
        className="fixed inset-0 z-50 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative flex min-h-full items-start justify-center px-2 pb-10 pt-10 md:px-8">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[960px] rounded-[2rem] bg-card shadow-2xl"
        >
          {/*
            Zero-height so it doesn't displace the cover image, sticky so the
            close stays reachable once the sheet scrolls past the top. The
            sticky offset matches the sheet's own top frame, which is pt-10 at
            every width, so at rest the button sits a consistent 16px inside the
            corner rather than being nudged out of it by an early stick. Move
            the frame's top padding and this has to move with it.
          */}
          <div className="pointer-events-none sticky top-10 z-20 flex h-0 justify-end">
            <button
              type="button"
              aria-label="Close project"
              onClick={onClose}
              className="pointer-events-auto mr-4 mt-4 flex size-10 cursor-pointer items-center justify-center rounded-full bg-card text-foreground shadow-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-quiet-focus:focus-visible:ring-0"
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <div className="p-2">
            {/*
              The cover is inset on three sides rather than run to the sheet's
              edge. With placeholders it read fine tight to the frame, but real
              screenshots carry their own detail right to the crop, and pressed
              against the corner they looked cramped — particularly the desktop
              shots, which lost their left and right margins entirely. The top
              inset also answers the sheet's own bottom padding, so the card is
              framed evenly top and bottom. The image gets smaller; the frame is
              worth more than the extra pixels.
            */}
            <div className="px-4 pt-4 md:px-6">
              <img
                src={project.cover || "/placeholder.svg"}
                alt={project.title}
                className="aspect-[3/2] w-full rounded-[1.5rem] object-cover"
              />
            </div>

            {/*
              Only the text is inset — the cover above stays tight to the sheet.
              The cap plus padding holds the measure at ~640px (74 characters)
              however wide the sheet gets; padding alone would crush the text
              on narrower sheets, where the cap simply stops applying.
            */}
            <div className="mx-auto w-full max-w-[45rem] px-4 pb-10 pt-6 md:px-10">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {project.title}
              </h2>
              <p className="mt-1 text-base text-foreground">{project.date}</p>

              {project.items ? (
                <ItemList heading="Highlights" items={project.items} className="mt-6" />
              ) : null}

              <hr className="my-6 border-project-divider" />

              <div className="flex flex-col gap-8">
                {project.sectionTitles.map((title, sectionIndex) => {
                  const start = project.sectionLengths
                    .slice(0, sectionIndex)
                    .reduce((total, length) => total + length, 0)
                  const paragraphs = project.body.slice(
                    start,
                    start + project.sectionLengths[sectionIndex],
                  )

                  return (
                    <section key={title} className="flex flex-col gap-3">
                      <h3 className="text-base font-bold tracking-tight text-foreground">
                        {title}
                      </h3>
                      <div className="flex flex-col gap-5">
                        {paragraphs.map((paragraph, paragraphIndex) => {
                          // `afterParagraph` indexes the whole body, so the
                          // section's own offset has to be added back on.
                          const bodyIndex = start + paragraphIndex
                          const blocks =
                            project.media?.filter(
                              (block) => block.afterParagraph === bodyIndex,
                            ) ?? []

                          return (
                            <Fragment key={paragraph}>
                              <p className="text-base text-muted-foreground text-pretty">
                                {withLeadIns(paragraph, project.leadIns)}
                              </p>
                              {blocks.map((block) => (
                                <ProjectMedia key={block.id} block={block} />
                              ))}
                            </Fragment>
                          )
                        })}
                      </div>
                    </section>
                  )
                })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
