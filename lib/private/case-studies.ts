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
 * Pixel dimensions of each processed panel, keyed by `<slug>/<name>`, as in
 * lib/portfolio-data.ts. Recorded here rather than read from the files so the
 * sheet can reserve each panel's space before it loads.
 */
const privateImageSizes: Record<string, [width: number, height: number]> = {
  "england-football-app/existing-app-01": [839, 1600],
  "england-football-app/existing-app-02": [839, 1600],
  "england-football-app/existing-app-03": [839, 1600],
  "england-football-app/existing-app-04": [839, 1600],
  "england-football-app/existing-app-05": [839, 1600],
  "england-football-app/existing-app-06": [839, 1600],
  "england-football-app/wireframe-01": [812, 1600],
  "england-football-app/lifecycle-01": [1600, 939],
  "england-football-app/lifecycle-02": [1600, 939],
  "england-football-app/lifecycle-03": [1600, 939],
}

/**
 * The panel / lightbox pair for one gallery image served through the gate.
 * Files live in `private/images/<slug>/` — outside `public/`, where anything is
 * fetchable by URL without a password — and are streamed by the image route
 * only to a visitor holding a valid access cookie. Naming follows
 * public/images/README.md.
 */
function privateImg(slug: string, name: string, alt: string): MediaItem {
  const size = privateImageSizes[`${slug}/${name}`]
  if (!size) throw new Error(`No recorded size for ${slug}/${name}`)
  const [width, height] = size
  return {
    src: `/api/case-study/${slug}/image/${name}.webp`,
    highResSrc: `/api/case-study/${slug}/image/${name}-full.webp`,
    width,
    height,
    alt,
  }
}

const privateContent: Record<string, PrivateContent> = {
  "england-football-app": {
    date: "Two deliverables in twelve weeks. A toolkit for designing fan products faster, and the England app features proving it worked.",
    body: [
      "The project set out to show what IBM's AI technology could do inside the FA's England football app, measured on fan engagement, retention and commercial outcomes. I was the experience designer on a team of five, alongside a developer, data scientist, business analyst and data analyst, over twelve weeks split between research and delivery.",
      "I audited the England app against its competitors. Most compete on live data, better stats, results and player detail during a match.",
      "What the FA has is an ecosystem of content strong enough to keep fans in its own app, and data straight from the pitch that others can't match for accuracy or trust. We used fan personas to decide which features to prioritise around those strengths. The most important content the FA had was presented in text formats. The key was turning it into visual information, stats for each match and a card for each player.",
      "Halfway through, the brief changed. What began as building AI features for the app became two things at once. We had to build a reusable agentic toolkit for researching, designing and delivering digital fan products, without losing human oversight. The FA work became the case study proving it worked. I wrote code for some of those agents, including the ones that synthesised research and generated design options.",
      "On the product half I designed two features. A live match centre carries a fan through the game across three tabs: a timeline of key events; a stats panel covering possession, momentum and more; and both teams' lineups. The watsonx powered insights sit in the timeline, with polls and predictions fans take part in as the game runs. A players page gives a reference card for each player to use before, during or after.",
      "The brief called for live match data, and the obvious move was to compete on how much of it we could show. That meant fighting on the one front where the FA holds no advantage. We used the live data for participation and insight instead, leaning on what only the FA has.",
      "Building the toolkit and the features at the same time was the harder problem. Each risked bending the other out of shape, so we reworked the project to make the FA features the output of the toolkit rather than a separate track.",
      "IBM leadership were very happy with the final presentation. The work has been handed to another team to continue, with a possibility IBM packages it up and takes it to clients.",
      "The next steps we set out were testing with fans, checking accessibility and performance, richer backend services for the FA's own data, and extending beyond the England teams into grassroots football.",
      "The research was done before the brief changed, so all of it pointed at the app. We shaped the toolkit around a traditional consulting product development lifecycle rather than around how our own teams work, and that's the gap I'd close.",
    ],
    sectionTitles: ["Context", "Discovery", "Approach", "Decisions", "Outcome", "Reflection"],
    sectionLengths: [1, 2, 2, 2, 2, 1],
    items: [
      { title: "Context", description: "A twelve-week IBM project to show what its AI could do inside the FA's England app." },
      { title: "Insight", description: "The FA's content was rich but mostly text; making it visual gave fans a reason to stay." },
      { title: "Solution", description: "An agentic toolkit for fan products, and the live match centre and players page it produced." },
    ],
    // Each gallery closes a section, so no section's prose is split in two.
    media: [
      // The app as it stood: the content Discovery ends on, and the text it
      // arrived as. The match coverage leads, then the player coverage, as the
      // two sources the stats and the player cards were made from; the
      // commercial pages after them show how far the text ran.
      { id: "existing-app", title: "The existing app", afterParagraph: 2, items: [
        privateImg("england-football-app", "existing-app-01", "Match report article in the England app, France 4-6 England, over a photo of two players embracing."),
        privateImg("england-football-app", "existing-app-02", "The same match report's lineups, substitutes and scorers, set out as a block of text."),
        privateImg("england-football-app", "existing-app-03", "Article introducing England's U20 Women's World Cup squad, over a team photo."),
        privateImg("england-football-app", "existing-app-04", "The same squad article, in which teammates describe each player in quotes."),
        privateImg("england-football-app", "existing-app-05", "England+ member benefits listed as bullet points, above an embedded YouTube video."),
        privateImg("england-football-app", "existing-app-06", "Ticket sale dates, prices and concessions set out as text."),
      ] },
      // Closing Approach, straight after the paragraph describing the match
      // centre, which this screen leads into. The finished screens are the
      // cover, so they are not repeated here.
      { id: "wireframe", title: "Hi-fi wireframe of the matches tab", afterParagraph: 4, items: [
        privateImg("england-football-app", "wireframe-01", "Hi-fi wireframe of the matches tab: a live France v England score card leading into the match centre, above upcoming fixtures."),
      ] },
      // The lifecycle the toolkit was designed from, closing Decisions, whose
      // last paragraph makes the features the toolkit's output. In order: the
      // consulting journey (the gap Reflection names), the lifecycle split into
      // discovery and delivery, and where AI could join each stage. The second
      // slide's "6 weeks gone, 6 weeks left" caption was painted out of the
      // source before processing.
      { id: "lifecycle", title: "The lifecycle behind the toolkit", afterParagraph: 6, items: [
        privateImg("england-football-app", "lifecycle-01", "Slide, The long journey of a consultant: a timeline from client brief through understanding the client, research, personas and requirements to design and development."),
        privateImg("england-football-app", "lifecycle-02", "Slide, Product development lifecycle overview: research, requirements and design as discovery, then development, testing and deploy as delivery."),
        privateImg("england-football-app", "lifecycle-03", "Slide, AI assistants and agents across the lifecycle: eight stages from market analysis and benchmarking to feature development, where AI can be added into the loop."),
      ] },
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
