"use client"

import { useState } from "react"
import { Slider, PlainCaption } from "@ocarignan/vitrine"
import type { SliderItem } from "@ocarignan/vitrine"
import "@ocarignan/vitrine/styles.css"
import { projects, type Project } from "@/lib/portfolio-data"
import { ProjectModal } from "./project-modal"

const slides: SliderItem[] = projects.map((project) => ({
  id: project.slug,
  title: project.title,
  meta: project.category,
  src: project.cover,
  alt: project.title,
}))

export function Projects() {
  const [active, setActive] = useState<Project | null>(null)

  return (
    <section className="w-full pb-32">
      {/*
        `projects-slider` scopes this slider's globals.css overrides to it, and
        wraps the <Slider> alone — the sheet below renders sliders of its own
        and must not inherit them. See the note above `.projects-slider` in
        globals.css.
      */}
      <div className="projects-slider">
        <Slider
          items={slides}
          Caption={PlainCaption}
          // The peek either side is `(viewport - panelWidth) / 2 - gap`, so the
          // only way to shrink it is a wider panel — hence a wide-ish ratio and
          // a generous contentWidth. maxItemHeight must be >= contentWidth/ratio
          // (800/1.5 = 533) or the height cap clamps the WIDTH instead, which
          // narrows the panel and breaks the centring rule in globals.css.
          aspectRatio="3/2"
          // 800 is mirrored in the .slider__track rule in globals.css — the two
          // must move together or the panel stops being centred.
          contentWidth={800}
          // Ceiling only: 800/1.5 = 533, so this never binds. It must stay
          // >= contentWidth / ratio, or the cap clamps the width instead.
          maxItemHeight={600}
          // Kept in step with `--gap` in globals.css, which sets the visual gap.
          gap={16}
          // Mobile panel width is `100vw - 2 * sideMargin`, and the peek of the
          // neighbouring panel is `sideMargin - gap`. At 28 with the 8px mobile
          // gap that is a 319px panel with ~20px showing either side.
          // Mirrored as the floor in the .slider__track rule in globals.css.
          sideMargin={28}
          lightbox={false}
          onItemClick={(_item, index) => setActive(projects[index])}
        />
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  )
}
