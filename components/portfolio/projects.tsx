"use client"

import { useEffect, useRef, useState } from "react"
import type { Project } from "@/lib/portfolio-data"
import { projects } from "@/lib/portfolio-data"
import { ProjectModal } from "./project-modal"

const CARD_WIDTH = "min(640px, 60vw)"

export function Projects() {
  const [active, setActive] = useState<Project | null>(null)
  const [centerProject, setCenterProject] = useState(projects[0])
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const centered = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (centered) {
          const project = projects.find((item) => item.slug === centered.target.getAttribute("data-project"))
          if (project) setCenterProject(project)
        }
      },
      { root: carousel, threshold: [0.6, 0.8, 1] },
    )

    const cards = carousel.querySelectorAll("[data-project]")
    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="w-full pb-32">
      <div className="mx-auto mb-8 max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="text-xl font-semibold leading-snug tracking-tight text-foreground">
            {centerProject.title}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            {centerProject.category}
          </p>
        </div>
      </div>

      <div
        ref={carouselRef}
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
            data-project={project.slug}
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
          </button>
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  )
}
