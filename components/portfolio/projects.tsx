"use client"

import { useState } from "react"
import type { Project } from "@/lib/portfolio-data"
import { projects } from "@/lib/portfolio-data"
import { ProjectModal } from "./project-modal"

export function Projects() {
  const [active, setActive] = useState<Project | null>(null)

  return (
    <div className="project-scroller" aria-label="Selected projects">
      <div className="project-track">
        {projects.map((project, index) => (
          <button key={project.slug} type="button" onClick={() => setActive(project)} className="project-card group">
            <div className="overflow-hidden border border-border bg-muted">
              <img src={project.cover || "/placeholder.svg"} alt={project.title} className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-border py-4 text-left">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{project.title}</h3>
                <p className="mt-1 text-base text-muted-foreground">{project.category}</p>
              </div>
              <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
            </div>
          </button>
        ))}
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </div>
  )
}
