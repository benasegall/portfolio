"use client"

import { useEffect, useRef, useState } from "react"
import type { Project } from "@/lib/portfolio-data"
import { projects } from "@/lib/portfolio-data"
import { ProjectModal } from "./project-modal"

const CARD_WIDTH = "min(768px, 72vw)"

export function Projects() {
  const [active, setActive] = useState<Project | null>(null)
  const [centeredSlug, setCenteredSlug] = useState(projects[0]?.slug)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    const items = Array.from(carousel.querySelectorAll<HTMLElement>("[data-project]"))
    const observer = new IntersectionObserver(
      (entries) => {
        const centered = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (centered) setCenteredSlug(centered.target.getAttribute("data-project") ?? projects[0]?.slug)
      },
      { root: carousel, threshold: [0.5, 0.75, 0.95] },
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  const centeredProject = projects.find((project) => project.slug === centeredSlug) ?? projects[0]

  return (
    <section className="w-full pb-32">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-[1fr_minmax(0,32rem)_1fr]">
        <div className="hidden lg:block" aria-hidden="true" />
        <div>
          <h3 className="text-base font-medium leading-snug tracking-tight text-foreground">
            {centeredProject.title}
          </h3>
          <p className="text-base leading-snug text-muted-foreground">{centeredProject.category}</p>
        </div>
      </div>

      <div ref={carouselRef} className="mt-8 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-4 md:px-0 md:pl-[calc((100vw-min(768px,72vw))/2-2rem)] md:pr-[calc((100vw-min(768px,72vw))/2+2rem)]">
        {projects.map((project) => (
          <button
            key={project.slug}
            data-project={project.slug}
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
          </button>
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  )
}
