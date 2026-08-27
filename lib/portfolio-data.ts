export type ListItem = {
  title: string
  description: string
}

export type Project = {
  slug: string
  title: string
  category: string
  cover: string
  date: string
  body: string[]
  items?: ListItem[]
}

export const profile = {
  name: "Benjamin Segall",
  role: "I design the decision, not just the screen.",
  bio: [
    "Based in London with roots in the USA, I studied UX at Norwich University of the Arts.",
    "I've worked across agency and consultancy teams, learning to hold user needs and business goals in the same hand.",
  ],
  current: {
    prefix: "Currently an Experience Design Intern at",
    company: "IBM",
  },
}

export const connectLinks: { label: string; href: string }[] = [
  { label: "Email", href: "mailto:hello@benjaminsegall.com" },
  { label: "CV", href: "#" },
  { label: "LinkedIn", href: "https://linkedin.com" },
]

export const projects: Project[] = [
  {
    slug: "wise",
    title: "Wise Young Explorer",
    category: "A teen's first trip control center",
    cover: "/projects/harborlight.svg",
    date: "Parents want their kids to have independence. They also want to stay in control. Travel Ready gives them both.",
    body: [
      "Wise's brief asked for a way to get parents of 15 to 17 year olds to set up Young Explorer for their kids, a product that already existed. The challenge was persuasion, not invention. You can't market a financial product directly to a teenager. The real aim went further: Wise's research shows 39% of adults still bank with the provider their parent set them up with. Getting a teenager onto Wise now was about building the relationship that converts into a full account at 18.",
      "GoHenry and Starling Kite both build around parental control — pocket money, spending locks and allowance tools. Neither designs around the moment parents care about most: the first time their kid travels away with a feeling of independence. Wise's multicurrency infrastructure meant it could own the travel moment, the point where parents most need reassurance and teens most want freedom, in a way competitors couldn't.",
      "My first instinct was a savings goal feature for teens. It was compelling but flawed — it spoke to the teen, not the parent the brief required, and it missed the core emotional moment: the trip itself rather than the buildup to it. I scrapped it and reframed the problem around the moment a parent hands their kid a card and says they're on their own.",
      "That reframe led to Travel Ready, a guided setup for parents built into the existing Young Explorer card area. A parent enters the trip details and Wise suggests a plan covering currencies, spending limits, ATM settings and merchant controls, which the parent can edit before activating. During the trip the parent gets live spend notifications and can top up if needed. Afterwards Wise shows a short recap and a prompt to keep the account active.",
      "The main tension was how much to show the teen versus the parent. An early version gave the teen a detailed mirror of the parent's plan; I pulled it back so the product felt freeing rather than restrictive. The recap needed the most thought — it had to avoid feeling like a report card, ending on something rewarding rather than evaluative, so both parent and teen would want to do it again.",
      "Travel Ready works within Wise's existing system rather than proposing something new, which was the right call — the brief asked for the existing product to feel necessary. If I took it further, I'd explore extending beyond travel into everyday teen spending, making the move to a full Wise account at 18 the obvious next step rather than a decision.",
    ],
    items: [
      { title: "The brief", description: "Persuade parents to set up an existing product — persuasion, not invention." },
      { title: "The insight", description: "39% of adults still bank with the provider a parent set them up with." },
      { title: "The solution", description: "Travel Ready: a guided trip setup built into the existing card area." },
    ],
  },
  {
    slug: "what-caused-this",
    title: "What Caused This",
    category: "Onboarding redesign for an RCA platform",
    cover: "/projects/meridian.svg",
    date: "Redesigning the onboarding experience for a Root Cause Analysis platform so new users can get started without feeling overwhelmed.",
    body: [
      "To grow its customer base, What Caused This wanted to launch a free trial and lite version. New users had to manually contact the team just to access the platform, and once inside, the interface gave them no clear direction. The brief had three aims: cut the time the team spent manually onboarding each user, reduce the time to a new user's first value moment, and improve trial-to-paid conversion. I was designing for managers, department heads and project leads trying to resolve recurring issues within their organisations.",
      "I tested the existing platform with five users. All five failed to complete the primary task without assistance. The same two issues came up every time: users couldn't find what they needed, and once they found it, didn't know how to use it. The fix wasn't more information — it was guidance at the point of action.",
      "The goal became helping users reach one meaningful action as quickly as possible: creating their first RCA report. Mapping where users got stuck revealed a key tension — too much guidance can be as disruptive as too little. The direction that followed was guiding users in context rather than front-loading explanations, walking them through actions step by step to reduce cognitive load.",
      "I designed two features: a product tour and a tutorials page. The tour triggers the moment a user lands on the dashboard, guiding them through creating their first RCA report by highlighting interface elements and prompting action. The tutorials page supports this, letting users search for guidance, revisit the tour, or find help matched to their experience level.",
      "The central tension was guidance versus freedom. Early concepts mapped instruction points across the whole interface until the list grew unwieldy. That led to two decisions: I cut the onboarding flow to essential steps only, and added a skip option so users who wanted to explore alone could do so. I also explored a proactive support feature that detected when a user appeared stuck, but chose not to pursue it within the timeline — the core experience needed to work on its own first.",
      "My solutions target the onboarding friction identified in testing, and the product tour and tutorials reduce confusion and improve early usability. But the deeper issue was the structure of the interface itself. The onboarding problems I solved are symptoms; the interface is the cause, and that's where I'd start on another attempt.",
    ],
    items: [
      { title: "The problem", description: "All five test users failed the primary task without help." },
      { title: "The solution", description: "A contextual product tour plus a searchable tutorials page." },
      { title: "The trade-off", description: "Guidance versus freedom — trimmed to essentials with a skip option." },
    ],
  },
  {
    slug: "clearterms",
    title: "ClearTerms",
    category: "Simplifying legal terms into clear summaries",
    cover: "/projects/fieldnote.svg",
    date: 'The biggest lie on the internet is "I have read and agree to the terms and conditions." ClearTerms uses AI-driven summaries to make that statement true.',
    body: [
      "ClearTerms began at Sync the City, a 54 hour startup event where teams pitch ideas and build them into working concepts. Our research showed the scale of the problem: 83% of people accept T&Cs without reading them, and 97% said they'd prefer a plain summary before agreeing. We found a real case of a man who lost his right to sue over food poisoning because of a clause buried in a free service signup. ClearTerms was designed to bridge that gap for two audiences — consumers who need clarity, and businesses that want to build trust and reduce legal risk.",
      "Research came before any design tools. Surveys and interviews showed users weren't ignoring terms out of laziness — they were overwhelmed by the structure and language. The central challenge was hierarchy: legal documents are dense, so the interface needed to separate critical clauses from routine ones at a glance. Three patterns came out of that process — plain language summaries, clause highlighting for risky terms, and categorisation grouping clauses by theme such as data usage, liability and intellectual property.",
      "The 54 hour window shaped every decision. Competitor analysis showed most tools focused on narrow areas like cookie policies; we chose to cover the full Terms document instead, giving ClearTerms a clear market position. Mapping the user journey showed people encounter terms in context, at the moment of signing up — so a Chrome extension put the tool exactly where it was needed. The freemium model kept the core consumer tool free to build trust while leaving room to grow on the B2B side.",
      "We ran consumer surveys and interviews early, then gathered external input through the Akcela startup incubator, including a legal contact whose feedback pushed me to think harder about disclaimers and liability. Our proof of concept flagged a subtle clause granting an app rights to a user's image and voice — something almost nobody would catch reading on their own.",
      "The hardest part wasn't the interface, it was the legal risk of using AI to interpret binding documents. If the tool surfaces something inaccurate, a user could act on wrong information, so strong disclaimers became a core part of the product, built into the interface rather than hidden in small print. That external legal feedback flagged my summary UI as too definitive, which pushed me to make key areas cited and highlightable — so users could verify the source text themselves without the design overstating what an AI summary can guarantee.",
    ],
    items: [
      { title: "The context", description: "Built in 54 hours at Sync the City; 83% accept T&Cs without reading." },
      { title: "The format", description: "A Chrome extension that works in context, at the moment of signing up." },
      { title: "The safeguard", description: "Cited, highlightable clauses with disclaimers built into the UI." },
    ],
  },
]

export const philosophy = {
  heading: "Philosophy",
  quote:
    "Design starts the moment a decision is made, whether that's in Figma, a conversation, or with the help of AI.",
}

export const footer = {
  copyright: "© 2026 Benjamin Segall",
}
