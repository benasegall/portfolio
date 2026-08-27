import { Intro } from "@/components/portfolio/intro"
import { Projects } from "@/components/portfolio/projects"
import { philosophy, footer } from "@/lib/portfolio-data"

export default function Home() {
  return (
    <div className="relative min-h-screen font-sans">
      {/* light grey edge accent */}
      <div
        aria-hidden="true"
        className="fixed inset-y-0 left-0 z-10 w-1.5 bg-border"
      />

      <main>
        <Intro />

        <div className="mx-auto mb-24 max-w-6xl px-6">
          <hr className="border-border" />
        </div>

        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-2 lg:grid-cols-[1fr_minmax(0,32rem)_1fr]">
          <div className="hidden lg:block" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-semibold leading-snug tracking-tight text-foreground">
              Selected Work
            </h2>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">
              A few recent projects — tap any to read more.
            </p>
          </div>
        </div>

        <div className="pt-10">
          <Projects />
        </div>

        <footer className="mx-auto max-w-6xl px-6 pb-32 pt-16">
          <div className="max-w-md">
            <h2 className="mb-3 text-lg font-semibold leading-snug tracking-tight text-foreground">
              {philosophy.heading}
            </h2>
            <p className="text-base leading-snug text-muted-foreground text-pretty">
              {philosophy.quote}
            </p>
            <p className="mt-16 text-sm leading-snug text-muted-foreground">{footer.copyright}</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
