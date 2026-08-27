"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import type { Project } from "@/lib/portfolio-data"
import { ItemList } from "./item-list"

type ProjectModalProps = {
  project: Project | null
  onClose: () => void
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
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-foreground/20 backdrop-blur-sm sm:items-start sm:p-8"
      onClick={onClose}
    >
      <div
        className="flex w-full items-start justify-center gap-4 sm:max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-[640px] overflow-hidden rounded-t-[2rem] bg-card shadow-2xl sm:rounded-[2rem]">
          <div className="p-4 pb-8 sm:p-7">
            <div
              aria-hidden="true"
              className="mx-auto mb-5 h-1.5 w-24 rounded-full bg-muted-foreground/50 sm:hidden"
            />

            <img
              src={project.cover || "/placeholder.svg"}
              alt={project.title}
              className="aspect-[4/3] w-full rounded-2xl object-cover sm:aspect-[16/9]"
            />

            <div className="px-3 pb-4 pt-6 sm:px-5 sm:pt-8">
              <h2 className="text-2xl font-medium leading-snug tracking-tight text-foreground">
                {project.title}
              </h2>
              <p className="mt-1 text-base leading-snug text-muted-foreground">{project.date}</p>

              {project.items ? (
                <ItemList heading="Highlights" items={project.items} className="mt-6" />
              ) : null}

              <hr className="my-6 border-border" />

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
                      <h3 className="text-base font-medium leading-snug tracking-tight text-foreground">
                        {title}
                      </h3>
                      <div className="flex flex-col gap-5">
                        {paragraphs.map((paragraph) => (
                          <p
                            key={paragraph}
                            className="text-base leading-snug text-muted-foreground text-pretty"
                          >
                            {paragraph}
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
      <button
        type="button"
        onClick={onClose}
        aria-label="Close project"
        className="sticky top-0 hidden size-18 shrink-0 items-center justify-center rounded-full bg-card text-foreground shadow-md transition-colors hover:bg-muted sm:flex"
      >
        <X className="size-5" />
      </button>
    </div>
  )
}
