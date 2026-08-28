import { Intro } from "@/components/portfolio/intro"
import { Projects } from "@/components/portfolio/projects"
import { philosophy, footer } from "@/lib/portfolio-data"

export default function Home() {
  return (
    <div className="relative min-h-screen font-sans">
      <main>
        <Intro />

        <div className="mx-auto mb-24 max-w-6xl px-6">
          <hr className="border-border" />
        </div>

        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-2 lg:grid-cols-[1fr_minmax(0,32rem)_1fr]">
          <div className="hidden lg:block" aria-hidden="true" />
          <div>
            <h2 className="text-base font-medium leading-snug tracking-tight text-foreground">
              Selected Work
            </h2>
            <p className="mt-1 text-base leading-snug text-muted-foreground">
              Selected work across enterprise software, fintech and B2B SaaS.
            </p>
          </div>
        </div>

        <div className="pt-10">
          <Projects />
        </div>

        <footer className="mx-auto grid max-w-6xl gap-8 px-6 pb-20 pt-12 lg:grid-cols-[1fr_minmax(0,32rem)_1fr]">
          <div className="hidden lg:block" aria-hidden="true" />
          <div>
            <h2 className="mb-3 text-base font-medium leading-snug tracking-tight text-foreground">
              {philosophy.heading}
            </h2>
            <p className="text-base leading-snug text-muted-foreground text-pretty">
              {philosophy.quote}
            </p>
            <p className="mt-16 text-detail leading-snug text-muted-foreground">{footer.copyright}</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
