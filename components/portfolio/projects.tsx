"use client"

import { useCallback, useRef, useState } from "react"
import { Slider, PlainCaption } from "@ocarignan/vitrine"
import type { SliderItem } from "@ocarignan/vitrine"
import "@ocarignan/vitrine/styles.css"
import type { GatedProject, Project } from "@/lib/portfolio-data"
import { isGated, projects } from "@/lib/portfolio-data"
import { focusQuietly } from "@/lib/quiet-focus"
import { PasswordGate } from "./password-gate"
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
  const [gate, setGate] = useState<GatedProject | null>(null)

  /*
   * Gated case studies.
   *
   * A gated card has no content on the page. Clicking it asks the server
   * first: a visitor who has already entered the password this session gets
   * the case study straight back and goes directly to the sheet; anyone else
   * gets the password prompt. Once unlocked, a case study is kept here, so
   * reopening it in the same visit needs no second round trip.
   *
   * The card is remembered so focus can go back to it. The sheet returns focus
   * to whatever was focused when it opened, and after the gate that would be
   * the gate's own button, gone by then — so the card is focused first, and
   * the sheet opens with it as the thing to return to.
   */
  const unlocked = useRef(new Map<string, Project>())
  const card = useRef<HTMLElement | null>(null)

  const openProject = useCallback(async (index: number) => {
    const project = projects[index]
    if (!isGated(project)) {
      setActive(project)
      return
    }

    card.current =
      document.querySelectorAll<HTMLElement>(".projects-slider .slider__item")[index] ?? null

    let content = unlocked.current.get(project.slug) ?? null
    if (!content) {
      const response = await fetch(`/api/case-study/${project.slug}`, { cache: "no-store" }).catch(
        () => null,
      )
      if (response?.ok) content = (await response.json()) as Project
    }

    if (content) {
      unlocked.current.set(project.slug, content)
      setActive(content)
    } else {
      setGate(project)
    }
  }, [])

  const closeGate = useCallback(() => {
    setGate(null)
    // Quietly: the visitor has just been typing in the gate, which the browser
    // would read as keyboard use and ring the card. See lib/quiet-focus.
    focusQuietly(card.current)
  }, [])

  const unlock = useCallback((content: Project) => {
    unlocked.current.set(content.slug, content)
    focusQuietly(card.current)
    setGate(null)
    setActive(content)
  }, [])

  const closeSheet = useCallback(() => setActive(null), [])

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
          onItemClick={(_item, index) => void openProject(index)}
        />
      </div>

      <ProjectModal project={active} onClose={closeSheet} />
      <PasswordGate project={gate} onClose={closeGate} onUnlock={unlock} />
    </section>
  )
}
