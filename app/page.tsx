import { Intro } from "@/components/portfolio/intro"
import { Projects } from "@/components/portfolio/projects"
import { philosophy, footer } from "@/lib/portfolio-data"

export default function Home() {
  return (
    <div className="portfolio-grid relative min-h-screen font-sans">
      <div aria-hidden="true" className="grid-lines fixed inset-0 z-0" />

      <main className="relative z-10">
        <Intro />

        <section aria-labelledby="selected-work" className="work-section">
          <div className="portfolio-frame grid grid-cols-4 items-end gap-4 border-y border-border px-6 py-6 md:grid-cols-12 md:gap-0 md:px-8">
            <div className="col-span-4 md:col-span-3">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">02 / Archive</p>
            </div>
            <div className="col-span-4 text-center md:col-span-6">
              <h2 id="selected-work" className="text-xl font-semibold tracking-tight text-foreground">Selected Work</h2>
              <p className="mt-1 text-sm text-muted-foreground">Scroll to explore — tap any project to read more.</p>
            </div>
            <p className="col-span-4 text-right font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground md:col-span-3">Drag / swipe</p>
          </div>
          <Projects />
        </section>

        <footer className="portfolio-frame grid grid-cols-4 gap-4 border-t border-border px-6 pb-24 pt-16 md:grid-cols-12 md:gap-0 md:px-8 md:pb-32 md:pt-24">
          <div className="col-span-4 md:col-span-3">
            <h2 className="mb-3 text-base font-medium tracking-tight text-foreground">{philosophy.heading}</h2>
            <p className="max-w-xs text-base leading-relaxed text-muted-foreground text-pretty">{philosophy.quote}</p>
            <p className="mt-12 font-mono text-xs text-muted-foreground">{footer.copyright}</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
