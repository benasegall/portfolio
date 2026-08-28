import { Intro } from "@/components/portfolio/intro"
import { Projects } from "@/components/portfolio/projects"
import { philosophy, footer } from "@/lib/portfolio-data"

export default function Home() {
  return (
    <div className="relative min-h-screen font-sans">
      <main>
        <Intro />

        <div className="mx-auto mb-10 max-w-6xl px-6">
          <hr className="border-border" />
        </div>

        <div className="page-grid pb-2">
          <div className="md:col-start-2">
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Selected Work
            </h2>
          </div>
        </div>

        <div className="pt-4">
          <Projects />
        </div>

        <footer className="page-grid pb-20 pt-12">
          <div className="md:col-start-2">
            <h2 className="text-base font-bold tracking-tight text-foreground">
              {philosophy.heading}
            </h2>
            <p className="text-base text-muted-foreground text-pretty">
              {philosophy.quote}
            </p>
            <p className="mt-16 text-detail text-muted-foreground">{footer.copyright}</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
