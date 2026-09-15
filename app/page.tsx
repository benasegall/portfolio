import { FooterDog } from "@/components/portfolio/dog/dog"
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

              Emphasis is colour alone, the same move as "Available from 21
              September." in the bio and the "Scope." / "During." lead-ins in
              the sheets: the clause steps forward out of the muted body copy
              without claiming to be a heading. Bold would have gone on saying
              "title", which is the one thing this line is not.
            */}
            <p className="text-base text-muted-foreground text-pretty">
              <span className="text-foreground">{philosophy.heading}</span>{" "}
              {philosophy.quote}
            </p>
            {/* `relative` so the dog can lie on top of the copyright line —
                see components/portfolio/dog. The gap above leaves him room
                below the sentence. */}
            <div className="relative mt-28">
              <FooterDog className="dog--left" />
              <p className="text-detail text-muted-foreground">{footer.copyright}</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
