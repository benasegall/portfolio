"use client"

import { useState } from "react"
import type { Project } from "@/lib/portfolio-data"
import { projects } from "@/lib/portfolio-data"
import { ProjectModal } from "./project-modal"

export function Projects() {
  const [active, setActive] = useState<Project | null>(null)

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-32">
      <div className="overflow-x-auto">
        <div className="flex gap-x-8" style={{ minWidth: "min-content" }}>
          {projects.map((project) => (
            <button
              key={project.slug}
              type="button"
              onClick={() => setActive(project)}
              className="group flex flex-col text-left flex-shrink-0"
              style={{ width: "min(100vw - 48px, 600px)" }}
            >
              <div className="overflow-hidden rounded-2xl bg-muted">
                <img
                  src={project.cover || "/placeholder.svg"}
                  alt={project.title}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
                {project.title}
              </h3>
              <p className="text-lg text-muted-foreground">{project.category}</p>
            </button>
          ))}
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  )
}
