import { FooterDog } from "@/components/portfolio/dog/dog"
import { Intro } from "@/components/portfolio/intro"
import { Projects } from "@/components/portfolio/projects"
import { contactHrefs, footer } from "@/lib/portfolio-data"

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
            <p className="text-base text-muted-foreground text-pretty">
              Get in touch by{" "}
              <a href={contactHrefs.email} className="text-foreground underline-offset-4 hover:underline">
                email
              </a>{" "}
              or connect on{" "}
              <a
                href={contactHrefs.linkedIn}
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline-offset-4 hover:underline"
              >
                LinkedIn
              </a>
              .
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
