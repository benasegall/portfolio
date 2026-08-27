"use client"

import { useState } from "react"
import type { Project } from "@/lib/portfolio-data"
import { projects } from "@/lib/portfolio-data"
import { ProjectModal } from "./project-modal"

const CARD_WIDTH = "min(640px, 60vw)"

export function Projects() {
  const [active, setActive] = useState<Project | null>(null)

  return (
    <section className="w-full pb-32">
      <div
        className="flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          paddingLeft: `calc((100vw - ${CARD_WIDTH}) / 2)`,
          paddingRight: `calc((100vw - ${CARD_WIDTH}) / 2)`,
        }}
      >
        {projects.map((project) => (
          <button
            key={project.slug}
            type="button"
            onClick={() => setActive(project)}
            className="group flex flex-shrink-0 snap-center flex-col text-left"
            style={{ width: CARD_WIDTH }}
          >
            <div className="overflow-hidden rounded-2xl bg-muted">
              <img
                src={project.cover || "/placeholder.svg"}
                alt={project.title}
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <h3 className="mt-4 text-base font-semibold leading-snug tracking-tight text-foreground">
              {project.title}
            </h3>
            <p className="text-sm leading-snug text-muted-foreground">{project.category}</p>
          </button>
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  )
}
