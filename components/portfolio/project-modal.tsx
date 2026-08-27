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
      className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-foreground/20 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-2xl rounded-3xl bg-card p-3 shadow-2xl sm:p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-2 -right-2 z-10 flex size-10 items-center justify-center rounded-full bg-card text-foreground shadow-md transition-colors hover:bg-muted sm:-top-3 sm:-right-3"
        >
          <X className="size-5" />
        </button>

        <img
          src={project.cover || "/placeholder.svg"}
          alt={project.title}
          className="aspect-[16/10] w-full rounded-2xl object-cover"
        />

        <div className="px-3 pb-4 pt-6 sm:px-5 sm:pt-8">
          <h2 className="text-lg font-semibold leading-snug tracking-tight text-foreground">
            {project.title}
          </h2>
          <p className="mt-1 text-base leading-snug text-muted-foreground">{project.date}</p>

          <hr className="my-6 border-border" />

          <div className="flex flex-col gap-5">
            {project.body.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-snug text-muted-foreground text-pretty"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {project.items ? (
            <ItemList
              heading="Highlights"
              items={project.items}
              className="mt-8"
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
