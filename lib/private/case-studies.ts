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
  "england-football-app/fa-content-01": [794, 1600],
  "england-football-app/fa-content-02": [794, 1600],
  "england-football-app/fa-content-03": [794, 1600],
  "england-football-app/fa-content-04": [794, 1600],
  "england-football-app/fa-content-05": [794, 1600],
  "england-football-app/fa-content-06": [794, 1600],
  "england-football-app/fa-content-07": [794, 1600],
  "england-football-app/fa-content-08": [794, 1600],
  "england-football-app/match-centre-01": [1053, 1010],
  "england-football-app/match-centre-02": [765, 1600],
  "england-football-app/toolkit-01": [1600, 900],
  "england-football-app/toolkit-02": [1600, 900],
  "england-football-app/toolkit-03": [1600, 900],
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
      "I audited the England app against its competitors. Most compete on live data, better stats, results and player detail during a match, and do it well.",
      "What the FA has is an ecosystem of content strong enough to keep a fan in its own app, and data straight from the pitch that others can't match for accuracy or trust. We used fan personas to decide which features to prioritise around those strengths.",
      "Halfway through, the brief changed. What began as building AI features for the app became two things at once. We had to build a reusable agentic toolkit for researching, designing and delivering digital fan products, without losing human oversight. The FA work became the case study proving it worked. I wrote code for some of those agents, including the ones that synthesised research and generated design options.",
      "On the product half I designed two features. A live match centre carries a fan through the game across three tabs: a timeline of key events; a stats panel covering possession, momentum and more; and both teams' lineups. The watsonx powered insights sit in the timeline, with polls and predictions fans take part in as the game runs. A players page gives a reference card for each player to use before, during or after.",
      "The prototype ran on mock data, so what we demonstrated was the experience rather than the integration.",
      "The brief called for live match data, and the obvious move was to compete on how much of it we could show. That meant fighting on the one front where the FA holds no advantage. We used the live data for participation and insight instead, leaning on what only the FA has.",
      "Building the toolkit and the features at the same time was the harder problem. Each risked bending the other out of shape, so we reworked the project to make the FA features the output of the toolkit rather than a separate track.",
      "IBM leadership were very happy with the final presentation. The work has been handed to another team to continue, with a possibility IBM packages it up and takes it to clients.",
      "The next steps we set out were testing with fans, checking accessibility and performance, richer backend services for the FA's own data, and extending beyond the England teams into grassroots football.",
      "The research was done before the brief changed, so all of it pointed at the app. We shaped the toolkit around a traditional consulting product development lifecycle rather than around how our own teams work, and that's the gap I'd close.",
    ],
    sectionTitles: ["Context", "Discovery", "Approach", "Decisions", "Outcome", "Reflection"],
    sectionLengths: [1, 2, 3, 2, 2, 1],
    items: [
      { title: "Context", description: "A twelve-week IBM project to show what its AI could do inside the FA's England app." },
      { title: "Insight", description: "Fans can get stats anywhere; the FA's edge is giving them a reason to stay and take part." },
      { title: "Solution", description: "An agentic toolkit for fan products, and the live match centre and players page it produced." },
    ],
    // Each gallery closes a section, so no section's prose is split in two.
    media: [
      // The app as it stood: the "ecosystem of content" Discovery ends on,
      // which the features were built to keep fans inside.
      { id: "fa-content", title: "The FA's own content", afterParagraph: 2, items: [
        privateImg("england-football-app", "fa-content-01", "Match report article in the England app, France 4-6 England, over a photo of two players embracing."),
        privateImg("england-football-app", "fa-content-02", "The same match report's lineups, substitutes and scorers, set out as a block of text."),
        privateImg("england-football-app", "fa-content-03", "England+ launch article, Get closer with England+, with a Join now button."),
        privateImg("england-football-app", "fa-content-04", "England+ member benefits listed as bullet points, above an embedded YouTube video."),
        privateImg("england-football-app", "fa-content-05", "Ticket sale dates, prices and concessions set out as text."),
        privateImg("england-football-app", "fa-content-06", "Article introducing England's U20 Women's World Cup squad, over a team photo."),
        privateImg("england-football-app", "fa-content-07", "A Register your interest button above a photo of England fans with flags in the stands."),
        privateImg("england-football-app", "fa-content-08", "Squad article in which teammates describe each player in quotes."),
      ] },
      // The two features, closing Approach. The composite leads because it
      // shows both; the fixtures screen after it is how a fan gets there.
      { id: "match-centre", title: "The match centre and players page", afterParagraph: 5, items: [
        privateImg("england-football-app", "match-centre-01", "Three prototype screens: the players page grouped by position, the stats tab with a match momentum chart, and the timeline with match insights written by IBM watsonx."),
        privateImg("england-football-app", "match-centre-02", "The matches tab, where a live France v England score leads into the match centre above upcoming fixtures."),
      ] },
      // The toolkit, closing Decisions, whose last paragraph makes the features
      // its output. In order: the consulting lifecycle it was shaped around (the
      // gap Reflection names), the halfway point where the brief changed, and
      // where the agents sit across it.
      { id: "toolkit", title: "The agentic toolkit", afterParagraph: 7, items: [
        privateImg("england-football-app", "toolkit-01", "Slide, The long journey of a consultant: a timeline from client brief through understanding the client, research, personas and requirements to design and development."),
        privateImg("england-football-app", "toolkit-02", "Slide, Product development lifecycle overview: research, requirements and design as discovery, then development, testing and deploy as delivery, captioned 6 weeks gone, 6 weeks left."),
        privateImg("england-football-app", "toolkit-03", "Slide, AI assistants and agents across the lifecycle: eight stages from market analysis and benchmarking to feature development, where AI can be added into the loop."),
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
