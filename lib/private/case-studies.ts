import "server-only"

import { isGated, projects } from "@/lib/portfolio-data"
import type { GatedProject, MediaBlock, MediaItem, Project } from "@/lib/portfolio-data"

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

/** PLACEHOLDER gallery — three numbered SVGs, until the real images arrive. */
function placeholderGallery(
  slug: string,
  id: string,
  title: string,
  afterParagraph: number,
): MediaBlock {
  return {
    id,
    title,
    afterParagraph,
    items: [1, 2, 3].map((n) =>
      privateImg(slug, `${id}-0${n}.svg`, `${title} placeholder ${n} of 3`, 1512, 982),
    ),
  }
}

const privateContent: Record<string, PrivateContent> = {
  "england-football-app": {
    date: "Two deliverables in twelve weeks. A toolkit for designing fan products faster, and the England app features proving it worked.",
    body: [
      "The project set out to show what IBM's AI technology could do inside the FA's England football app, measured on fan engagement, retention and commercial outcomes. I was the experience designer on a team of five, alongside a developer, data scientist, business analyst and data analyst, over twelve weeks split between research and delivery.",
      "I audited the England app against its competitors. Most compete on live data, better stats, results and player detail during a match, and do it well.",
      "What the FA has is an ecosystem of content strong enough to keep a fan in its own app, and data straight from the pitch that others can't match for accuracy or trust. We used fan personas to decide which features to prioritise around those strengths.",
      "Halfway through, the brief changed. What began as building AI features for the app became two things at once. We had to build a reusable agentic toolkit for researching, designing and delivering digital fan products, without losing human oversight. The FA work became the case study proving it worked. I wrote code for some of those agents, including the ones that synthesised research and generated design options.",
      "On the product half I designed two features. A live match centre carries a fan through the game across three tabs, a timeline of key events, a stats panel covering possession, momentum and more, and both teams' lineups. The watsonx powered insights sit in the timeline, with polls and predictions fans take part in as the game runs. A players page gives a reference card for each player to use before, during or after.",
      "The prototype ran on mock data, so what we demonstrated was the experience rather than the integration.",
      "The brief called for live match data, and the obvious move was to compete on how much of it we could show. That meant fighting on the one front where the FA holds no advantage. We used the live data for participation and insight instead, leaning on what only the FA has.",
      "Building the toolkit and the features at the same time was the harder problem. Each risked bending the other out of shape, so we reworked the project to make the FA features the output of the toolkit rather than a separate track.",
      "IBM leadership were very happy with the final presentation. The work has been handed to another team to continue, with a possibility IBM packages it up and takes it to clients.",
      "The next steps we set out were testing with fans, checking accessibility and performance, richer backend services for the FA's own data, and extending beyond the England teams into grassroots football.",
      "The research was done before the brief changed, so all of it pointed at the app. We shaped the toolkit around a traditional consulting product development lifecycle rather than around how our own teams work, and that's the gap I'd close.",
    ],
    sectionTitles: ["Context", "Discovery", "Approach", "Decisions", "Outcome", "Reflection"],
    sectionLengths: [1, 2, 3, 2, 2, 1],
    // No Highlights yet: the copy has none, and the sheet leaves the list out
    // when `items` is absent.
    //
    // PLACEHOLDER galleries, each at the end of a section so no section's
    // prose is split in two. Real images keep these ids, so the files become
    // discovery-01.webp and so on — see private/README.md. The titles are
    // working titles, to confirm when the images arrive.
    media: [
      // The competitor audit, closing Discovery.
      placeholderGallery("england-football-app", "discovery", "Competitor audit", 2),
      // The two features, closing Approach in the order its second paragraph
      // describes them.
      placeholderGallery("england-football-app", "match-centre", "Live match centre", 5),
      placeholderGallery("england-football-app", "players", "Players page", 5),
      // The toolkit, closing Decisions, whose last paragraph makes the
      // features its output.
      placeholderGallery("england-football-app", "toolkit", "The agentic toolkit", 7),
    ],
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
