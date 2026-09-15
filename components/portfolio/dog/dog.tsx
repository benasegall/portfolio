"use client"

import { useEffect, useRef, useState } from "react"
import { DOG_ANCHORS, DOG_MARKUP, DOG_VIEWBOX } from "./drawing"
import "./dog.css"

/**
 * A pencil-sketched chocolate doodle puppy, dozing on top of the footer's
 * closing sentence.
 *
 * Asleep he's the sleeping sketch — lying flat, head on his paws — and while
 * he's on screen he lets out a hand-drawn "z" every few seconds, which is what
 * says he is alive and worth touching. Wake him and the awake sketch fades in,
 * rising as he lifts his head to look at you, and his tail gives one wag.
 *
 * How you wake him depends on the input, not the device:
 * - A mouse or trackpad hovers. One wag per hover, so coming back while he's
 *   still awake earns another, and he dozes off a moment after it leaves.
 * - A finger or stylus taps. One wag per tap; he stays awake a little longer,
 *   since a touch has no "leave" to tell him you've gone. A touch that turns
 *   into a scroll doesn't wake him — it never becomes a tap.
 * A tablet with a trackpad, or a laptop with a touchscreen, gets both, each
 * behaving as its own input would.
 *
 * The drawings are the owner's two sketches — see drawing.ts for how they
 * share a box and how the tail is cut out to wag. Decorative throughout, so
 * it is hidden from assistive tech.
 *
 * Rendered inside the footer's text column, which is `relative`; dog.css sits
 * him on the top edge of that column, where the closing sentence starts. The
 * drawing itself only mounts once the footer is near the viewport, so its
 * image isn't fetched by visitors who never scroll that far.
 */

const INK = "#333333"

const random = (min: number, max: number) => min + Math.random() * (max - min)
const stillness = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

type Point = { x: number; y: number }

const SVG = "http://www.w3.org/2000/svg"

/** A small pencil mark: the same polyline drawn twice with a little wobble, as a hand would. */
function pencil(points: [number, number][], className: string, size: number) {
  const svg = document.createElementNS(SVG, "svg")
  svg.setAttribute("viewBox", "0 0 10 10")
  svg.setAttribute("class", className)
  svg.setAttribute("fill", "none")
  svg.setAttribute("stroke", INK)
  svg.setAttribute("stroke-linecap", "round")
  svg.setAttribute("stroke-linejoin", "round")
  svg.style.width = `${size}px`
  svg.style.height = `${size}px`
  for (const [pass, opacity, width] of [[0, 0.9, 1.1], [1, 0.5, 0.8]] as const) {
    const path = document.createElementNS(SVG, "path")
    const shift = pass ? [random(-0.5, 0.5), random(-0.5, 0.5)] : [0, 0]
    path.setAttribute(
      "d",
      "M" +
        points
          .map(([x, y]) => `${(x + shift[0] + random(-0.3, 0.3)).toFixed(2)} ${(y + shift[1] + random(-0.3, 0.3)).toFixed(2)}`)
          .join("L"),
    )
    path.setAttribute("stroke-opacity", String(opacity))
    path.setAttribute("stroke-width", String(width))
    svg.appendChild(path)
  }
  return svg
}

const Z: [number, number][] = [[2.2, 2.4], [7.8, 2.1], [2.4, 7.8], [8, 7.6]]

export function FooterDog() {
  const ref = useRef<HTMLDivElement>(null)
  // Where the z's float. Inside the dog, so they scroll with the page; a
  // screen-fixed layer kept them in place while the page moved under them.
  const marks = useRef<HTMLDivElement>(null)
  const [awake, setAwake] = useState(false)
  const awakeRef = useRef(false)
  awakeRef.current = awake
  const sleepTimer = useRef(0)
  const [near, setNear] = useState(false)

  // Mount the drawing once the footer is within a screen or so.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNear(true)
        observer.disconnect()
      },
      { rootMargin: "600px 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /** A point on the dog, as a fraction of its box, in the box's own pixels. */
  const at = (fx: number, fy: number): Point | null => {
    const el = ref.current
    return el ? { x: el.offsetWidth * fx, y: el.offsetHeight * fy } : null
  }

  // The odd "z" while it sleeps — only while it's on screen, and not while awake.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let visible = false
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    observer.observe(el)
    let timer = 0
    const snore = () => {
      const head = at(...DOG_ANCHORS.z)
      if (visible && !awakeRef.current && !stillness() && head) {
        const size = random(10, 14)
        const z = pencil(Z, "dog-z", size)
        z.style.left = `${head.x + random(-2, 4)}px`
        z.style.top = `${head.y - size / 2}px`
        z.style.setProperty("--dx", `${random(6, 16)}px`)
        z.addEventListener("animationend", () => z.remove(), { once: true })
        marks.current?.appendChild(z)
      }
      timer = window.setTimeout(snore, random(2600, 3600))
    }
    timer = window.setTimeout(snore, 1200)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => () => clearTimeout(sleepTimer.current), [])

  const wake = () => {
    clearTimeout(sleepTimer.current)
    setAwake(true)
    // One wag per hover. The attribute is dropped and set again so the
    // animation restarts even when he's still awake from the last one.
    const el = ref.current
    if (!el) return
    el.removeAttribute("data-wag")
    void el.offsetWidth
    el.setAttribute("data-wag", "")
  }

  const settle = (after = 1600) => {
    clearTimeout(sleepTimer.current)
    sleepTimer.current = window.setTimeout(() => setAwake(false), after)
  }

  /** The kind of pointer that last touched him, read by the click that follows. */
  const lastPointer = useRef<string>("mouse")

  return (
    <div
      ref={ref}
      className="dog"
      data-awake={awake}
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.animationName === "dog-wag") ref.current?.removeAttribute("data-wag")
      }}
    >
      {near ? <svg viewBox={DOG_VIEWBOX} dangerouslySetInnerHTML={{ __html: DOG_MARKUP }} /> : null}
      <div ref={marks} className="dog__marks" />
      {/* Where he can be woken: the sleeping drawing, or all of him once he's
          up (see `.dog__hit` in dog.css). */}
      <div
        className="dog__hit"
        onPointerDown={(e) => {
          lastPointer.current = e.pointerType
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") wake()
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") settle()
        }}
        // A tap arrives as a click; a mouse click is ignored, since hover has
        // already done the work. Touches that scroll never produce one.
        onClick={() => {
          if (lastPointer.current === "mouse") return
          wake()
          settle(2600)
        }}
      />
    </div>
  )
}
