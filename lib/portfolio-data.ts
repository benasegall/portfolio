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
  role: "Product designer in London",
  bio: [
    "I'm a product designer in London, with roots in the USA. I studied UX at Norwich University of the Arts and have worked across agency and consultancy teams, where I learned to hold both user needs and business goals in the same hand.",
  ],
  current: {
    prefix: "Currently at",
    company: "IBM. Available from 21 September.",
  },
}

export const connectLinks: { label: string; href: string }[] = [
  { label: "Email", href: "mailto:hello@benjaminsegall.com" },
  { label: "CV", href: "#" },
  { label: "LinkedIn", href: "https://linkedin.com" },
]

export const projects: Project[] = [
  {
    slug: "what-caused-this",
    title: "What Caused This",
    category: "Onboarding a root cause analysis platform so new users reach value alone.",
    cover: "/projects/meridian.svg",
    date: "Five out of five new users failed the platform's main task. I redesigned onboarding so they could reach it alone.",
    body: [
      "I tested What Caused This with five new users. All five failed to complete the primary task without help.",
      "It's a root cause analysis tool for managers and project leads chasing recurring problems. The company wanted to launch a free trial, but new users had to email the team to get in, and once inside nothing told them what to do next.",
      "The brief had three aims. Less time spent onboarding each user by hand. Faster time to first value. Better conversion from trial to paying.",
      "The same two problems came up in every session. Users couldn't find what they needed, and when they found it, they didn't know how to use it. The fix wasn't more information. It was guidance at the point of action.",
      "The goal became getting a user to one meaningful action fast, creating their first analysis report. Mapping where people got stuck showed the guidance had to arrive in context rather than up front.",
      "I designed two things. A product tour triggers on the dashboard and walks a user through building their first report, highlighting each element and prompting the action rather than describing it. A tutorials page sits behind it, so users can search for specific help or run the tour again.",
      "The tension was guidance against freedom. Early concepts mapped instruction points across the whole interface until the list became unusable. Too many prompts block a user as effectively as none. So I cut the flow to the steps that serve the first report, and added a skip option for anyone who would rather explore alone.",
      "I also scoped out a proactive support feature that would spot a stuck user through hovering or inactivity. The core onboarding needed to work on its own before anything sat on top of it, so it stayed out of this build.",
      "The tour and tutorials reduce confusion and improve early usability, but the deeper problem is the structure of the interface. The onboarding problems I solved are symptoms. The interface is the cause, and that's where I'd start next time.",
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
    cover: "/projects/fieldnote.svg",
    date: "The biggest lie on the internet is \"I have read and agree to the terms and conditions.\" ClearTerms uses AI-driven summaries to make that statement true.",
    body: [
      "A man lost his right to sue over food poisoning because of a clause buried in the signup for a free service. He had agreed to it. Almost nobody reads these documents, and the people who write them know it.",
      "Our survey found 83% of people accept terms without reading them, and 97% would rather see a plain summary first. ClearTerms was built for both sides of that gap, consumers who need clarity and businesses that want to reduce legal risk.",
      "Our proof of concept flagged a clause granting TikTok rights to a user's image and voice. Not something anyone catches reading on their own.",
      "I was one of two designers on a team of six at Sync the City, a 54 hour build event. We worked the design together from research through to final screens, alongside development and business strategy. Decisions on revenue model, disclaimers and product format fed straight into design choices, so the design moved with the business case rather than after it. Legal input came from external mentor review through the Akcela incubator.",
      "Surveys and interviews showed people weren't ignoring terms out of laziness. They were beaten by the structure and the language. That moved the problem from reducing content to ranking it, so someone could spot a risky clause without reading the whole document.",
      "The challenge was hierarchy. Legal documents are dense and flat, so the interface had to separate the clauses that matter from the routine ones at a glance.",
      "Three patterns came out of that. Plain language summaries, replacing dense legal text with scannable insights. Clause highlighting, flagging terms that are risky or unclear. Categorisation, grouping clauses by theme such as data use, liability and intellectual property, so someone can navigate without reading everything.",
      "Scope. Competitor tools mostly cover narrow areas like cookie policies. We chose to cover the whole document, which gave ClearTerms a clearer position and made the design problem harder.",
      "Format. A website would have been easier to build and test, but people meet terms in context, at the moment they sign up. ToS;DR, the closest competitor, pulls users out to its own site and breaks that moment. A Chrome extension puts the tool where the decision happens, and leaves room to grow into a platform later.",
      "Model. Freemium. The consumer tool stays free to build trust and drive organic growth, with revenue on the business side, which the extension format suits.",
      "Liability. The hardest problem wasn't the interface. It was using AI to interpret binding documents. A legal reviewer flagged that my summary UI was too definitive, which could create liability of its own. So key areas became cited and highlightable, letting a user check the source text rather than trust the summary.",
      "The interface was the easy part. Trust wasn't. Clarity on screen only gets you so far. The rest came from putting disclaimers inside the reading flow rather than hiding them in small print, and being honest about what an AI summary can't guarantee.",
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
    cover: "/projects/harborlight.svg",
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
    items: [
      { title: "Context", description: "A live Wise brief to get more parents setting up Young Explorer for 15 to 17 year olds." },
      { title: "Insight", description: "The first trip abroad is where parental reassurance and teenage independence meet." },
      { title: "Solution", description: "Travel Ready: a guided setup built into the Young Explorer card area." },
    ],
  },
]

export const philosophy = {
  heading: "Design starts the moment a decision is made",
  quote: "Whether that's in Figma, a conversation, or with the help of AI.",
}

export const footer = {
  copyright: "© 2026 Benjamin Segall",
}

export const siteMeta = {
  title: "Benjamin Segall, Product Designer in London",
  description: "Product designer in London. Selected work across enterprise software, fintech and B2B SaaS.",
}
