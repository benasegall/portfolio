import "server-only"

import { isGated, projects } from "@/lib/portfolio-data"
import type { GatedProject, MediaItem, Project } from "@/lib/portfolio-data"

/*
 * Case studies that sit behind the password gate.
 *
 * This file must never reach the browser. `lib/portfolio-data.ts` is imported
 * by a client component, so everything in it ships in the page's JavaScript —
 * which is why a gated project keeps only its public card there and its content
 * here. The `server-only` import above makes the build fail if a client
 * component ever imports this file, rather than letting it leak quietly.
 *
 * It is read by app/api/case-study/[slug], and only after the password checks
 * out.
 */

/** Everything a sheet needs beyond the public card's title, one-liner and cover. */
type PrivateContent = Omit<Project, "slug" | "title" | "category" | "cover">

/**
 * A gallery image served through the gate. Files live in `private/images/<slug>/`
 * — outside `public/`, where anything is fetchable by URL without a password —
 * and are streamed by the image route only to a visitor holding a valid access
 * cookie. Naming follows public/images/README.md.
 */
function privateImg(slug: string, file: string, alt: string, width: number, height: number): MediaItem {
  return { src: `/api/case-study/${slug}/image/${file}`, width, height, alt }
}

/*
 * PLACEHOLDER — the approved project text replaces everything below, and the
 * real images replace the numbered SVGs. The structure matches the three public
 * case studies: a dek, three Highlights, then sections whose paragraph counts
 * are given by `sectionLengths`.
 */
const privateContent: Record<string, PrivateContent> = {
  "private-project": {
    date: "Placeholder subtitle. The approved subtitle replaces this line.",
    body: [
      "Placeholder paragraph. This stands in for the approved project text, which replaces it once the password gate is working.",
      "Placeholder paragraph. The context section sets out the brief, the team and the constraints.",
      "Placeholder paragraph. The research section covers what was learned and how.",
      "Placeholder paragraph. The approach section explains how the problem was framed.",
      "Placeholder paragraph. A second approach paragraph, to show a section running to more than one.",
      "Placeholder paragraph. The decisions section covers the trade-offs that shaped the design.",
      "Placeholder paragraph. The reflection section closes the case study.",
    ],
    sectionTitles: ["Context", "Research", "Approach", "Decisions", "Reflection"],
    sectionLengths: [2, 1, 2, 1, 1],
    items: [
      { title: "Context", description: "Placeholder highlight. The approved highlights replace these." },
      { title: "Research", description: "Placeholder highlight." },
      { title: "Outcome", description: "Placeholder highlight." },
    ],
    // Placeholder galleries, each at the end of a section so the text reads as
    // an unbroken block before the images. Real images keep these ids, so the
    // files become research-01.webp and so on — see private/README.md.
    media: (["research", "approach", "decisions"] as const).map((id, index) => ({
      id,
      title: id.charAt(0).toUpperCase() + id.slice(1),
      afterParagraph: [2, 4, 5][index],
      items: [1, 2, 3].map((n) =>
        privateImg("private-project", `${id}-0${n}.svg`, `${id} placeholder ${n} of 3`, 1512, 982),
      ),
    })),
  },
}

/**
 * The full case study for a gated card, or null when there is no such card or
 * no content for it. The card fields come from the public card, so the title,
 * one-liner and cover exist in one place only.
 */
export function getPrivateProject(slug: string): Project | null {
  const card = projects.find(
    (project): project is GatedProject => isGated(project) && project.slug === slug,
  )
  if (!card || !Object.hasOwn(privateContent, slug)) return null
  const { gated: _gated, ...cardFields } = card
  return { ...cardFields, ...privateContent[slug] }
}
