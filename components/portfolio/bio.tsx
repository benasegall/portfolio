"use client"

import { useRef, useState } from "react"
import { profile } from "@/lib/portfolio-data"

const PANEL_ID = "bio-more"

/**
 * The bio, with two extra paragraphs that expand in above the pinned
 * "Currently at IBM" line — that line is the last thing read in both states.
 *
 * The whole block is the target — hover on a mouse, tap on a touch screen,
 * Tab and Enter/Space on a keyboard — but the control and the pointer surface
 * are deliberately separate elements.
 *
 * The button is a real button and owns everything assistive tech and the
 * keyboard rely on: the accessible name, aria-expanded, aria-controls, native
 * Enter/Space activation, and a focus ring drawn around the whole block. It is
 * `pointer-events-none`, so it never becomes the hit-test target and the prose
 * underneath stays selectable and right-clickable — a stretched button on top
 * would swallow both.
 *
 * Pointer input therefore lands on the wrapper, which owns hover and tap. The
 * button's own click still bubbles up to that same handler, so keyboard and
 * pointer share one code path and the state can never be toggled twice.
 *
 * Height animates through the 0fr -> 1fr grid track rather than a measured
 * pixel height, which keeps it dependency-free and correct at any width. The
 * `visibility` flip (delayed to the end of the collapse) is what actually
 * takes the hidden copy out of the accessibility tree and out of tab order —
 * clipping alone would leave it readable to a screen reader.
 *
 * Container padding is reserved in both states and cancelled by the matching
 * negative margins, so the panel appears around text that never moves. The
 * -mx-4/rounded-2xl/px-4/py-3 shape and the 350ms cubic-bezier(.2,0,0,1)
 * timing are the ones already used by ItemList and Portrait.
 */
export function Bio() {
  const [open, setOpen] = useState(false)
  /**
   * A mouse already governs the block through hover, so its click must not
   * toggle it straight back shut. Touch and keyboard have no hover to lean
   * on, so theirs must. A keyboard activation leaves this null — no pointer
   * event precedes it.
   */
  const pointerType = useRef<string | null>(null)

  const motion =
    "duration-[350ms] ease-[cubic-bezier(.2,0,0,1)] motion-reduce:transition-none"

  return (
    <div className="mt-8">
      <div
        onPointerDown={(e) => {
          pointerType.current = e.pointerType
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setOpen(true)
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setOpen(false)
        }}
        // Fires for a tap, and for the button's own Enter/Space click bubbling
        // up. A mouse click is ignored because hover already governs the block
        // — which also means a drag to select text never toggles it.
        onClick={() => {
          const fromMouse = pointerType.current === "mouse"
          pointerType.current = null
          if (fromMouse) return
          setOpen((wasOpen) => !wasOpen)
        }}
        // touch-manipulation drops the double-tap zoom delay. Nothing here
        // calls preventDefault, so a scroll or a long-press to select still
        // behaves normally and never fires the click.
        className={`relative -mx-4 -my-3 touch-manipulation rounded-2xl px-4 py-3 transition-colors ${motion} ${
          open ? "bg-muted" : "bg-muted/0"
        }`}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls={PANEL_ID}
          // Only a keyboard focus expands. A tap focuses the button too on
          // some platforms, and expanding here would fight the click that
          // follows it.
          onFocus={(e) => {
            if (e.currentTarget.matches(":focus-visible")) setOpen(true)
          }}
          onBlur={() => setOpen(false)}
          // pointer-events-none is what keeps the bio selectable: the button
          // covers the block for the focus ring only, and every mouse and
          // touch event passes through it to the text.
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="sr-only">More about {profile.name}</span>
        </button>

        {/*
          No flex `gap` here: a gap would apply either side of the collapsed
          panel and double the space between the bio and the pinned line.
          Each child owns its own top margin instead, and the panel's lives
          inside it where it can be clipped away.
        */}
        <div className="flex flex-col">
          {profile.bio.map((paragraph, index) => (
            <p
              key={paragraph}
              className={`text-base text-muted-foreground text-pretty ${
                index > 0 ? "mt-4" : ""
              }`}
            >
              {paragraph}
            </p>
          ))}

          <div
            id={PANEL_ID}
            className={`grid transition-[grid-template-rows] ${motion}`}
            style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
          >
            <div
              inert={!open}
              className={`overflow-hidden transition-[visibility] duration-0 motion-reduce:delay-0 ${
                open ? "visible delay-0" : "invisible delay-[350ms]"
              }`}
            >
              <div className="flex flex-col gap-4 pt-4">
                {profile.more.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base text-muted-foreground text-pretty"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-4 text-base text-muted-foreground">
            {profile.current.employer}{" "}
            <span className="text-foreground">
              {profile.current.availability}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
