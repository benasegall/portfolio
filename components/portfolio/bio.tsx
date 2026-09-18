"use client"

import { useRef, useState } from "react"
import { profile } from "@/lib/portfolio-data"

const PANEL_ID = "bio-more"

/**
 * The bio, with an extra paragraph that expands in above the pinned
 * "Currently at IBM" line, and a visible trigger below that line.
 *
 * Opening is a click or tap anywhere on the block, or Enter/Space on the
 * trigger — never hover. The block used to open on hover, which left nothing
 * on screen to say it could open at all, and made it open by accident as the
 * pointer crossed the page.
 *
 * Only the trigger is a button. The block's own click handler is a larger
 * pointer target on top of it, not a second control, so the keyboard and
 * screen readers meet one button with one name and one expanded state. The
 * trigger's own click bubbles to that same handler, so there is one code path
 * and the state can never toggle twice.
 *
 * Height animates through the 0fr -> 1fr grid track rather than a measured
 * pixel height, which keeps it dependency-free and correct at any width. The
 * `visibility` flip (delayed to the end of the collapse) is what takes the
 * hidden copy out of the accessibility tree and out of tab order — clipping
 * alone would leave it readable to a screen reader.
 *
 * Container padding is reserved in both states and cancelled by the matching
 * negative margins, so the panel appears around text that never moves. The
 * -mx-4/rounded-2xl/px-4/py-3 shape is the one ItemList uses, and the 350ms
 * cubic-bezier(.2,0,0,1) timing the one Portrait uses.
 */
export function Bio() {
  const [open, setOpen] = useState(false)
  const blockRef = useRef<HTMLDivElement>(null)

  const motion =
    "duration-[350ms] ease-[cubic-bezier(.2,0,0,1)] motion-reduce:transition-none"

  function toggle() {
    const block = blockRef.current
    // Selecting text ends in a click. Leave the bio as it is, so it can still
    // be copied from.
    const selection = window.getSelection()
    if (selection && !selection.isCollapsed && block?.contains(selection.anchorNode)) return

    // Closing removes the paragraph above the trigger, so everything below
    // it rises by that much. If the top of the bio has already scrolled off
    // screen, that can carry the trigger up out of view with it — bring the
    // bio back to the top of the screen instead. The block's top edge does
    // not move during the collapse, so the scroll can run alongside it.
    if (open && block && block.getBoundingClientRect().top < 0) {
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      block.scrollIntoView({ block: "start", behavior: still ? "auto" : "smooth" })
    }
    setOpen(!open)
  }

  return (
    <div className="mt-8">
      {/*
        Without JavaScript the trigger can't work, so the whole bio shows
        instead and the trigger is hidden. React renders this on the server
        only; a browser running scripts ignores it.
      */}
      <noscript>
        <style>{`
          #${PANEL_ID} { grid-template-rows: 1fr !important; }
          #${PANEL_ID} > div { visibility: visible !important; }
          [data-bio-trigger] { display: none !important; }
        `}</style>
      </noscript>

      <div
        ref={blockRef}
        onClick={toggle}
        // scroll-mt leaves a little air above the bio when closing scrolls
        // back to it, rather than butting the text against the screen edge.
        // The tap highlight is off because the grey panel is the feedback.
        className={`group -mx-4 -my-3 cursor-pointer scroll-mt-6 touch-manipulation [-webkit-tap-highlight-color:transparent] rounded-2xl px-4 py-3 transition-colors ${motion} ${
          open ? "bg-muted" : "bg-muted/0"
        }`}
      >
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

          {/*
            The trigger is body size, with a thin plus or minus beside it. The
            icon is what marks it as a control, and the extra space above sets
            it apart from the paragraph.

            Black by default, so a touch screen — which has no hover to
            reveal anything with — shows the trigger at full strength from the
            start. Where a pointer can hover, it rests in the body grey and
            goes black as the pointer crosses the block, so the label answers
            the cursor; the block is the target, not the label alone, which is
            why the hover lives on the block.

            The condition is the input, not the width: this is about whether
            hover exists to reveal anything, so a narrow window with a mouse
            still behaves as the desktop it is.

            transition-colors without the 350ms panel timing: this is the
            same quick tint as the Connect links, not part of the open.

            min-h-11 is a 44px tap target. The negative horizontal margin
            with matching padding keeps the text on the bio's left edge while
            giving the focus ring room around it.
          */}
          <button
            type="button"
            data-bio-trigger=""
            aria-expanded={open}
            aria-controls={PANEL_ID}
            className="-mx-2 mt-2 inline-flex min-h-11 cursor-pointer items-center gap-3 self-start rounded-full px-2 text-base text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [@media(hover:hover)]:text-muted-foreground [@media(hover:hover)]:group-hover:text-foreground"
          >
            {open ? "Show less" : "More about how I work"}
            {/*
              Plus and minus are one drawing: the vertical stroke folds flat
              into the horizontal one as the bio opens, so the icon changes
              in step with the panel rather than swapping.

              Flex centring puts the icon on the middle of the line box, which
              sits below the middle of the lettering (the box includes room
              for descenders). -top-[0.16em] lifts it onto the centre of the
              capital height, so the bar lines up with the label; in em, so it
              holds if the text size changes.
            */}
            <svg
              aria-hidden="true"
              viewBox="0 0 12 12"
              className="relative -top-[0.16em] size-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            >
              <path d="M1 6h10" />
              <path
                d="M6 1v10"
                className={`origin-center transition-transform ${motion} ${
                  open ? "scale-y-0" : "scale-y-100"
                }`}
                style={{ transformBox: "fill-box" }}
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
