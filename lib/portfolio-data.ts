export type ListItem = {
  title: string
  description: string
}

export type ProjectSection = {
  title: string
  paragraphs: string[]
}

/** One panel in a project media gallery. Maps 1:1 onto Vitrine's SliderItem. */
export type MediaItem = {
  src: string
  /** Full-resolution source the lightbox swaps in; falls back to `src`. */
  highResSrc?: string
  /** Direct video file URL (not an embed page). Plays muted and looping. */
  video?: string
  alt?: string
}

/**
 * A horizontally-swiped gallery anchored inside the written case study.
 * `afterParagraph` indexes `body`: the gallery renders straight after that
 * paragraph, so the visuals sit with the prose they illustrate instead of
 * being collected at the end. Several blocks may share an anchor; they render
 * in array order.
 */
/**
 * A hosted video player. Kept separate from `items` on purpose: Vitrine's
 * `video` field feeds a real <video> element and needs a direct media file
 * URL, so a player embed cannot go there. An embed also plays with sound on
 * demand rather than as a muted ambient loop, which suits interview footage.
 */
export type MediaEmbed = {
  /** Player URL, used as the iframe src. */
  src: string
  /** Accessible name for the iframe. */
  title: string
}

export type MediaBlock = {
  id: string
  title: string
  afterParagraph: number
  items: MediaItem[]
  /** When set, the block renders this player instead of a gallery. */
  embed?: MediaEmbed
  /** Opt into Vitrine's playback UI — required for the lightbox mute control. */
  videoControls?: boolean | "minimal"
}

export type Project = {
  slug: string
  title: string
  category: string
  cover: string
  date: string
  body: string[]
  sectionTitles: string[]
  sectionLengths: number[]
  /**
   * Lead-in labels inside body paragraphs, rendered in foreground colour.
   * Listed explicitly rather than detected from the prose: "Model. Freemium."
   * has a second word-and-period that is the answer, not a label, so pattern
   * matching would over-emphasise it.
   */
  leadIns?: string[]
  items?: ListItem[]
  /** Galleries anchored to body paragraphs. See MediaBlock. */
  media?: MediaBlock[]
}

export const profile = {
  name: "Benjamin Segall",
  bio: [
    "I'm a product designer in London, with roots in the USA. I studied UX at Norwich University of the Arts and have worked across agency and consultancy teams, learning to hold user needs and business goals in the same hand.",
  ],
  // Revealed when the bio block is expanded, inserted between `bio` and
  // `current` — the "Currently at IBM" line stays pinned last in both states.
  more: [
    "I start by understanding the problem, work through what is unclear, and find a practical way forward. I enjoy working early in the process, defining the problem and understanding the business context before deciding what to design, then turning those decisions into something real.",
  ],
  // Two sentences, so the availability — the actionable half — can be
  // emphasised on its own. Combined they read exactly as the content spec:
  // "Currently at IBM. Available from 21 September."
  current: {
    employer: "Currently at IBM.",
    availability: "Available from 21 September.",
  },
  portrait: {
    src: "/images/site/portrait.webp",
    alt: "Benjamin Segall",
  },
}

export const connectLinks: { label: string; href: string }[] = [
  { label: "Email", href: "mailto:benasegall@gmail.com" },
  { label: "CV", href: "https://drive.google.com/file/d/1OyowLEmJPKoriapbSCXiseFirdBLi3_l/view?usp=sharing" },
  { label: "LinkedIn", href: "https://linkedin.com/in/benasegall" },
]

/** Builds the panel / lightbox source pair for one processed image. */
function img(slug: string, name: string, alt: string): MediaItem {
  return {
    src: `/images/projects/${slug}/${name}.webp`,
    highResSrc: `/images/projects/${slug}/${name}-full.webp`,
    alt,
  }
}

export const projects: Project[] = [
  {
    slug: "what-caused-this",
    title: "What Caused This",
    category: "Onboarding a root cause analysis platform so new users reach value alone.",
    cover: "/images/projects/what-caused-this/cover.webp",
    date: "Five out of five new users failed the platform's main task. I redesigned onboarding so they could reach it alone.",
    body: [
      "I tested What Caused This with five new users. All five failed to complete the primary task without help.",
      "It's a root cause analysis tool for managers and project leads chasing recurring problems. The company wanted to launch a free trial, but new users had to email the team to get in, and once inside nothing told them what to do next.",
      "The brief had three aims.",
      "Less time spent onboarding each user by hand. Faster time to first value. Better conversion from trial to paying.",
      "The same two problems came up in every session. Users couldn't find what they needed, and when they found it, they didn't know how to use it. The fix wasn't more information. It was guidance at the point of action.",
      "The goal became getting a user to one meaningful action fast, creating their first analysis report. Mapping where people got stuck showed the guidance had to arrive in context rather than up front.",
      "I designed two things. A product tour triggers on the dashboard and walks a user through building their first report, highlighting each element and prompting the action rather than describing it. A tutorials page sits behind it, so users can search for specific help or run the tour again.",
      "The tension was guidance against freedom. Early concepts mapped instruction points across the whole interface until the list became unusable. Too many prompts block a user as effectively as none. So I cut the flow to the steps that serve the first report, and added a skip option for anyone who would rather explore alone.",
      "I also scoped out a proactive support feature that would spot a stuck user through hovering or inactivity. The core onboarding needed to work on its own before anything sat on top of it, so it stayed out of this build.",
      "I had the brief and the design system, and no contact after the initial presentation. The conversation I wanted was early in research, to find out how far the redesign could go. With it I'd have asked whether the interface structure needed rethinking rather than building around it.",
      "The tour and tutorials reduce confusion and improve early usability, but the deeper problem is the structure of the interface. The onboarding problems I solved are symptoms. The interface is the cause, and that's where I'd start next time.",
    ],
    sectionTitles: ["Context", "Research", "Approach", "Decisions", "Constraints", "Reflection"],
    sectionLengths: [4, 1, 2, 2, 1, 1],
    media: [
      // The self-serve trial that replaced emailing the team for access.
      { id: "getting-in", title: "Getting in", afterParagraph: 1, items: [
        img("what-caused-this", "getting-in-01", "Email verifying the account and starting the 14-day free trial"),
        img("what-caused-this", "getting-in-02", "Upgrade plan with order summary and payment details"),
        img("what-caused-this", "getting-in-03", "Purchase confirmed, returning to the dashboard"),
      ] },
      // Sign-up and dashboard flows — where the five sessions stalled.
      { id: "user-flows", title: "User flows", afterParagraph: 5, items: [
        img("what-caused-this", "user-flows-01", "Sign-up and dashboard user flows, mapping where new users stalled"),
      ] },
      // "I designed two things" — the tour first, then the tutorials behind it.
      { id: "product-tour", title: "The product tour", afterParagraph: 6, items: [
        img("what-caused-this", "product-tour-01", "Sketches through to final design of the onboarding checklist"),
        img("what-caused-this", "product-tour-02", "Onboarding asking how familiar the user is with root cause analysis"),
        img("what-caused-this", "product-tour-03", "Dashboard with the Get Started tour panel open"),
      ] },
      { id: "tutorials", title: "Tutorials page", afterParagraph: 6, items: [
        img("what-caused-this", "tutorials-01", "Tutorials page with searchable walkthrough cards"),
      ] },
    ],
    items: [
      { title: "Context", description: "A root cause analysis tool for managers and project leads chasing recurring problems." },
      { title: "Research", description: "Five out of five new users failed to complete the primary task without help." },
      { title: "Approach", description: "Guidance at the point of action, focused on creating a first analysis report." },
    ],
  },
  {
    slug: "clearterms",
    title: "ClearTerms",
    category: "Turning terms and conditions into summaries people actually read.",
    cover: "/images/projects/clearterms/cover.webp",
    date: "The biggest lie on the internet is \"I have read and agree to the terms and conditions.\" ClearTerms uses AI-driven summaries to make that statement true.",
    body: [
      "A man lost his right to sue over food poisoning because of a clause buried in the signup for a free service. He had agreed to it. Almost nobody reads these documents, and the people who write them know it.",
      "Our survey found 83% of people accept terms without reading them, and 97% would rather see a plain summary first. ClearTerms was built for both sides of that gap, consumers who need clarity and businesses that want to reduce legal risk.",
      "Our proof of concept flagged a clause granting TikTok rights to a user's image and voice. Not something anyone catches reading on their own.",
      "I was one of two designers on a team of six at Sync the City, a 54 hour build event. We worked the design together from research through to final screens, alongside development and business strategy. Decisions on revenue model, disclaimers and product format fed straight into design choices, so the design moved with the business case rather than after it. Legal input came from external mentor review through the Akcela incubator.",
      "Surveys and interviews showed people weren't ignoring terms out of laziness. They were beaten by the structure and the language. That moved the problem from reducing content to ranking it, so someone could spot a risky clause without reading the whole document.",
      "The challenge was hierarchy. Legal documents are dense and flat, so the interface had to separate the clauses that matter from the routine ones at a glance.",
      "Three patterns came out of that.",
      "Plain language summaries, replacing dense legal text with scannable insights. Clause highlighting, flagging terms that are risky or unclear. Categorisation, grouping clauses by theme such as data use, liability and intellectual property, so someone can navigate without reading everything.",
      "Scope. Competitor tools mostly cover narrow areas like cookie policies. We chose to cover the whole document, which gave ClearTerms a clearer position and made the design problem harder.",
      "Format. A website would have been easier to build and test, but people meet terms in context, at the moment they sign up. ToS;DR, the closest competitor, pulls users out to its own site and breaks that moment. A Chrome extension puts the tool where the decision happens, and leaves room to grow into a platform later.",
      "Model. Freemium. The consumer tool stays free to build trust and drive organic growth, with revenue on the business side, which the extension format suits.",
      "Liability. The hardest problem wasn't the interface. It was using AI to interpret binding documents. A legal reviewer flagged that my summary UI was too definitive, which could create liability of its own. So key areas became cited and highlightable, letting a user check the source text rather than trust the summary.",
      "The interface was the easy part. Trust wasn't. Clarity on screen only gets you so far. The rest came from putting disclaimers inside the reading flow rather than hiding them in small print, and being honest about what an AI summary can't guarantee.",
    ],
    sectionTitles: ["Context", "Research", "Approach", "Decisions", "Reflection"],
    sectionLengths: [4, 1, 3, 4, 1],
    leadIns: ["Scope.", "Format.", "Model.", "Liability."],
    media: [
      // Interview reel plus the survey charts behind the 83% / 97% figures.
      // videoControls is what surfaces the lightbox mute button; the panel
      // itself stays muted whatever we pass.
      // The interviews play in Vimeo's own player. The reel is 31 seconds at a
      // ~28 Mbps bitrate, far too heavy to self-host, and its audio carries the
      // findings — so a player the viewer starts beats a muted ambient loop.
      { id: "interviews", title: "User interviews", afterParagraph: 4, items: [],
        embed: {
          src: "https://player.vimeo.com/video/1044294752?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479",
          title: "ClearTerms User Interviews",
        } },
      { id: "research", title: "Survey results", afterParagraph: 4, items: [
        img("clearterms", "research-01", "Survey results: 97% would prefer a summary of the key points"),
      ] },
      // Wireframes running lo-fi modules -> in-context -> branded panel.
      { id: "hierarchy", title: "Building the hierarchy", afterParagraph: 7, items: [
        img("clearterms", "hierarchy-01", "Low-fidelity wireframes of the concern, preferences and summary modules"),
        img("clearterms", "hierarchy-02", "Mid-fidelity extension panel shown beside a live terms page"),
        img("clearterms", "hierarchy-03", "The panel at full fidelity in ClearTerms branding"),
      ] },
      // Sits on "Format." — the flow showing the extension firing in place.
      // Kept whole: splitting it into stages made each panel taller but the
      // flow itself harder to follow, and the last stage was no clearer.
      { id: "where-it-lives", title: "Where the tool lives", afterParagraph: 9, items: [
        img("clearterms", "where-it-lives-01", "User flow from installing the extension to reading a generated summary"),
      ] },
      // Identity work. Anchored to the last paragraph so it closes the case
      // study rather than interrupting an argument it does not serve.
      { id: "identity", title: "Identity", afterParagraph: 12, items: [
        img("clearterms", "identity-01", "Colour palette exploration"),
        img("clearterms", "identity-02", "Logotype explorations"),
        img("clearterms", "identity-03", "Logo lockups on light and dark backgrounds"),
        img("clearterms", "identity-04", "The final ClearTerms logo"),
        img("clearterms", "identity-05", "Favicon and full logo lockup"),
      ] },
    ],
    items: [
      { title: "Context", description: "Built in 54 hours at Sync the City with a team of six." },
      { title: "Research", description: "83% accept terms without reading them; 97% would rather see a plain summary first." },
      { title: "Safeguard", description: "Cited and highlightable clauses let users check source text themselves." },
    ],
  },
  {
    slug: "wise-young-explorer",
    title: "Wise Young Explorer",
    category: "Helping parents hand a teenager a card for their first trip abroad.",
    cover: "/images/projects/wise-young-explorer/cover.webp",
    date: "Parents want their kids to have independence. They also want to stay in control. Travel Ready gives them both.",
    body: [
      "Wise set a live brief. Get more parents of 15 to 17 year olds setting up Young Explorer, a product that already existed. The challenge was persuasion, not invention, and you can't market a financial product to a teenager. Wise's research shows 39% of adults still bank with the provider their parent chose. Getting a teenager onto Wise now is about the account they open at 18.",
      "GoHenry and Starling Kite both build around parental control, pocket money, spending locks, allowance tools. Neither designs for the moment parents care about most, the first time their kid travels without them. Wise's multicurrency infrastructure meant it could own that moment in a way the others couldn't.",
      "My first idea was a savings goal for teens, name a trip and watch the balance convert in any currency as you save. It spoke to the teen, not the parent the brief required, and it leaned on features competitors already had. So I reframed. The tension wasn't about saving. It was about the moment a parent hands their kid a card and says they're on their own.",
      "That became Travel Ready, a guided setup for parents built into the Young Explorer card area of the app.",
      "Before. The parent enters the trip. Wise suggests currencies, spending limits, ATM and merchant settings. The parent edits and activates. During. Live spend notifications, and a top up if one is needed. After. A short recap of where the money went, and a prompt to keep the account active.",
      "Control stays with the parent. Once the trip starts, they only step in if they choose to.",
      "The main question was how much to show the teen. An early version gave them a full mirror of the parent's plan. I pulled it back. Seeing the exact limits risked making the product feel restrictive rather than freeing, so a lighter trip view replaced it, one that included the teen without showing them the limits themselves.",
      "The recap took the most thought. It had to end on something rewarding rather than evaluative, so neither of them read it as a report card.",
      "Success here is trips set up per card, and how many of those accounts are still open at 18.",
      "Travel Ready works inside Wise's existing system rather than proposing something new, which is what the brief asked for. I didn't speak to parents or teenagers, so the read behind it comes from Wise's research and the gap in the market rather than from testing. That's the first thing I'd fix. The second is that I never explored extending it beyond travel into everyday spending. That's what would make a full account at 18 the obvious next step rather than a decision.",
    ],
    sectionTitles: ["Context", "Competitor landscape", "Approach", "Decisions", "Reflection"],
    sectionLengths: [1, 1, 4, 3, 1],
    leadIns: ["Before.", "During.", "After."],
    media: [
      // The savings-goal concept described in this paragraph and abandoned in
      // it. Titled so it never reads as the shipped product.
      { id: "dropped-idea", title: "The idea I dropped", afterParagraph: 2, items: [
        img("wise-young-explorer", "dropped-idea-01", "Savings goals concept sketch"),
        img("wise-young-explorer", "dropped-idea-02", "Jars concept with a Corsica trip goal"),
        img("wise-young-explorer", "dropped-idea-03", "Jars with create-jar and exchange rate detail"),
        img("wise-young-explorer", "dropped-idea-04", "Journeys screen with the add-journey flow"),
        img("wise-young-explorer", "dropped-idea-05", "Journey detail with a transactions list"),
        img("wise-young-explorer", "dropped-idea-06", "Thailand trip goal showing the amount saved"),
        img("wise-young-explorer", "dropped-idea-07", "Journey Jars, combining both concepts"),
        img("wise-young-explorer", "dropped-idea-08", "Create journey flow asking how much is needed"),
      ] },
      // The three galleries below mirror the Before / During / After leadIns.
      { id: "before", title: "Before — setting up the trip", afterParagraph: 4, items: [
        img("wise-young-explorer", "before-01", "Travel Ready intro: give them freedom with guardrails"),
        img("wise-young-explorer", "before-02", "How it works, explaining the trip plan"),
        img("wise-young-explorer", "before-03", "Start a trip plan entry screen"),
        img("wise-young-explorer", "before-04", "Trip details: destination, dates and number of travellers"),
        img("wise-young-explorer", "before-05", "Destination picker open"),
        img("wise-young-explorer", "before-06", "Trip details completed, ready to continue"),
        img("wise-young-explorer", "before-07", "Suggested money setup with budget, limits and merchant controls"),
        img("wise-young-explorer", "before-08", "Currency picker within the money setup"),
        img("wise-young-explorer", "before-09", "Editing the suggested budget"),
        img("wise-young-explorer", "before-10", "Ready-to-go checklist before activating Travel Ready"),
      ] },
      { id: "during", title: "During — while they are away", afterParagraph: 5, items: [
        img("wise-young-explorer", "during-01", "Trip status with spend by currency and recent transactions"),
        img("wise-young-explorer", "during-02", "Travel Ready card view with the card frozen"),
        img("wise-young-explorer", "during-03", "Safety controls for payments, alerts and ATM withdrawals"),
      ] },
      { id: "after", title: "After — the recap", afterParagraph: 7, items: [
        img("wise-young-explorer", "after-01", "Trip recap with the exchange rate across the trip"),
        img("wise-young-explorer", "after-02", "Total spent across the trip"),
        img("wise-young-explorer", "after-03", "Smart currency choices with total transactions"),
        img("wise-young-explorer", "after-04", "Top spending spots"),
        img("wise-young-explorer", "after-05", "Fees skipped versus a typical bank"),
        img("wise-young-explorer", "after-06", "Tips for the next trip"),
        img("wise-young-explorer", "after-07", "A prompt to plan the next adventure"),
      ] },
    ],
    items: [
      { title: "Context", description: "A live Wise brief to get more parents setting up Young Explorer for 15 to 17 year olds." },
      { title: "Insight", description: "The first trip abroad is where parental reassurance and teenage independence meet." },
      { title: "Solution", description: "Travel Ready: a guided setup built into the Young Explorer card area." },
    ],
  },
]

// One sentence, split across two lines in the footer: the heading carries the
// clause, the quote continues it. Reads as a single sentence when combined.
export const philosophy = {
  heading: "Design starts the moment a decision is made,",
  quote: "whether that's in Figma, a conversation, or with the help of AI.",
}

export const footer = {
  copyright: "© 2026 Benjamin Segall",
}

export const siteMeta = {
  title: "Benjamin Segall, Product Designer in London",
  description: "Product designer in London. Selected work across enterprise software, fintech and B2B SaaS.",
}
