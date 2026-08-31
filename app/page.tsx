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
            {/*
              One paragraph, not a heading plus a paragraph. The two halves are
              a single sentence, and as separate blocks they always broke after
              "made," however much room the line had — the clause read as a
              title with a caption under it rather than as the sentence it is.
              Inline, it simply wraps where the measure runs out.

              The lead-in keeps the site's heading treatment, which is also the
              pattern the sheets use for "Scope." / "During." — foreground
              weight on the opening clause, body copy for the rest.
            */}
            <p className="text-base text-muted-foreground text-pretty">
              <span className="font-bold tracking-tight text-foreground">
                {philosophy.heading}
              </span>{" "}
              {philosophy.quote}
            </p>
            <p className="mt-16 text-detail text-muted-foreground">{footer.copyright}</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
