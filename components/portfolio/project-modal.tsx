"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import type { Project } from "@/lib/portfolio-data"
import { ItemList } from "./item-list"

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
  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [project, onClose])

  if (!project) return null

  return (
    // The overlay scrolls, not the card — so the sheet is only as tall as its
    // content and runs past the fold. Its bottom edge is revealed by scrolling
    // to the end, rather than being fitted inside the viewport.
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-foreground/20 backdrop-blur-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex min-h-full items-start justify-center px-2 pb-16 pt-2 md:px-8 md:pb-24 md:pt-8">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[960px] rounded-[2rem] bg-card shadow-2xl"
        >
          {/*
            Zero-height so it doesn't displace the cover image, sticky so the
            close stays reachable once the sheet scrolls past the top. The
            sticky offset matches the sheet's own top frame (pt-2 / md:pt-8),
            so at rest the button sits a consistent 16px inside the corner at
            every breakpoint instead of being nudged by an early stick.
          */}
          <div className="pointer-events-none sticky top-2 z-20 flex h-0 justify-end md:top-8">
            <button
              type="button"
              aria-label="Close project"
              onClick={onClose}
              className="pointer-events-auto mr-4 mt-4 flex size-10 cursor-pointer items-center justify-center rounded-full bg-card text-foreground shadow-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <div className="p-2">
            <img
              src={project.cover || "/placeholder.svg"}
              alt={project.title}
              className="aspect-[3/2] w-full rounded-[1.5rem] object-cover"
            />

            {/*
              Only the text is inset — the cover above stays tight to the sheet.
              The cap plus padding holds the measure at ~640px (74 characters)
              however wide the sheet gets; padding alone would crush the text
              on narrower sheets, where the cap simply stops applying.
            */}
            <div className="mx-auto w-full max-w-[45rem] px-4 pb-16 pt-6 md:px-10 md:pb-[5.5rem] md:pt-8">
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
                        {paragraphs.map((paragraph) => (
                          <p
                            key={paragraph}
                            className="text-base text-muted-foreground text-pretty"
                          >
                            {withLeadIns(paragraph, project.leadIns)}
                          </p>
                        ))}
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
  )
}
