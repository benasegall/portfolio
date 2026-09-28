import type { MediaItem, Project } from "@/lib/portfolio-data"

/**
 * Pixel dimensions of each processed panel, keyed by `<slug>/<name>`, as in
 * lib/portfolio-data.ts. Recorded here rather than read from the files so the
 * sheet can reserve each panel's space before it loads.
 */
const imageSizes: Record<string, [width: number, height: number]> = {
  "england-football-app/existing-app-01": [839, 1600],
  "england-football-app/existing-app-02": [839, 1600],
  "england-football-app/existing-app-03": [839, 1600],
  "england-football-app/existing-app-04": [839, 1600],
  "england-football-app/existing-app-05": [839, 1600],
  "england-football-app/prototype-01": [811, 1600],
  "england-football-app/prototype-02": [811, 1600],
  "england-football-app/prototype-03": [811, 1600],
  "england-football-app/prototype-04": [811, 1600],
  "england-football-app/prototype-05": [811, 1600],
  "england-football-app/lifecycle-01": [1600, 939],
  "england-football-app/lifecycle-02": [1600, 939],
  "england-football-app/lifecycle-03": [1600, 939],
}

/**
 * The panel / lightbox pair for one public gallery image. Naming follows
 * public/images/README.md.
 */
function englandImg(slug: string, name: string, alt: string): MediaItem {
  const size = imageSizes[`${slug}/${name}`]
  if (!size) throw new Error(`No recorded size for ${slug}/${name}`)
  const [width, height] = size
  return {
    src: `/images/projects/${slug}/${name}.webp`,
    highResSrc: `/images/projects/${slug}/${name}-full.webp`,
    width,
    height,
    alt,
  }
}

/** Public England case study, kept separate to make the project list easy to scan. */
export const englandProject: Project = {
  slug: "england-football-app",
  title: "England Football App",
  category: "AI features designed at IBM, and the agentic toolkit that produced them.",
  cover: "/images/projects/england-football-app/cover.webp",
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
    "The research was done before the brief changed, so all of it pointed at the app. We shaped the toolkit around a traditional consulting product development lifecycle rather than around how our own team worked, and that's the gap I'd close.",
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
    // membership page after them shows how far the text ran.
    { id: "existing-app", title: "The existing app", afterParagraph: 2, items: [
      englandImg("england-football-app", "existing-app-01", "Match report article in the England app, France 4-6 England, over a photo of two players embracing."),
      englandImg("england-football-app", "existing-app-02", "The same match report's lineups, substitutes and scorers, set out as a block of text."),
      englandImg("england-football-app", "existing-app-03", "Article introducing England's U20 Women's World Cup squad, over a team photo."),
      englandImg("england-football-app", "existing-app-04", "The same squad article, in which teammates describe each player in quotes."),
      englandImg("england-football-app", "existing-app-05", "England+ member benefits listed as bullet points, above an embedded YouTube video."),
    ] },
    // Closing Approach, straight after the paragraph describing the two
    // features, in the order a fan meets them: the live card into the match
    // centre, its three tabs, then the players page.
    // Frames from the prototype's screen recording, with the pointer
    // painted out.
    { id: "prototype", title: "Prototype screens", afterParagraph: 4, items: [
      englandImg("england-football-app", "prototype-01", "The matches tab, where a live France v England score card leads into the match centre, above upcoming fixtures."),
      englandImg("england-football-app", "prototype-02", "The match centre timeline, with match insights written by IBM watsonx, a goal card and a new poll below."),
      englandImg("england-football-app", "prototype-03", "The stats tab, with a match momentum chart powered by IBM watsonx above possession, shots and shots on target."),
      englandImg("england-football-app", "prototype-04", "The lineups tab, with England's 4-1-4-1 formation on a pitch and the substitutes below."),
      englandImg("england-football-app", "prototype-05", "The players page, with the England squad grouped by position, a photo and name for each player."),
    ] },
    // The lifecycle the toolkit was designed from, closing Decisions, whose
    // last paragraph makes the features the toolkit's output. In order: the
    // consulting journey (the gap Reflection names), the lifecycle split into
    // discovery and delivery, and where AI could join each stage. Rendered
    // from the deck's PDF export rather than screenshots, for the real fonts.
    { id: "lifecycle", title: "The lifecycle behind the toolkit", afterParagraph: 6, items: [
      englandImg("england-football-app", "lifecycle-01", "Slide, The long journey of a consultant: a timeline from client brief through understanding the client, research, personas and requirements to design and development."),
      englandImg("england-football-app", "lifecycle-02", "Slide, Product development lifecycle overview: research, requirements and design as discovery, then development, testing and deploy as delivery."),
      englandImg("england-football-app", "lifecycle-03", "Slide, AI assistants and agents across the lifecycle: eight stages from market analysis and benchmarking to feature development, where AI can be added into the loop."),
    ] },
  ],
}
