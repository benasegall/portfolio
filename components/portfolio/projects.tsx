"use client"

import { useState } from "react"
import type { Project } from "@/lib/portfolio-data"
import { projects } from "@/lib/portfolio-data"
import { ProjectModal } from "./project-modal"

const CARD_WIDTH = "min(768px, 72vw)"

export function Projects() {
  const [active, setActive] = useState<Project | null>(null)

  return (
    <section className="w-full pb-32">
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-4 md:px-0 md:pl-[calc((100vw-min(768px,72vw))/2-2rem)] md:pr-[calc((100vw-min(768px,72vw))/2+2rem)]">
        {projects.map((project) => (
          <button
            key={project.slug}
            type="button"
            onClick={() => setActive(project)}
            className="group flex w-[calc(100vw-2rem)] flex-shrink-0 snap-center flex-col text-left md:w-[min(768px,72vw)]"
          >
            <div className="overflow-hidden rounded-2xl bg-muted">
              <img
                src={project.cover || "/placeholder.svg"}
                alt={project.title}
                className="aspect-[3/2] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div className="mx-auto w-full max-w-[32rem]">
              <h3 className="mt-4 text-base font-medium leading-snug tracking-tight text-foreground">
                {project.title}
              </h3>
              <p className="text-base leading-snug text-muted-foreground">{project.category}</p>
            </div>
          </button>
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  )
}
