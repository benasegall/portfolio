import { profile, connectLinks } from "@/lib/portfolio-data"
import { Portrait } from "./portrait"

export function Intro() {
  return (
    <section className="page-grid py-16 md:py-24">
      <Portrait />

      <div className="text-balance md:col-start-2 md:row-start-2 lg:row-start-1">
        <h1 className="text-base font-bold tracking-tight text-foreground">
          {profile.name}
        </h1>
        <div className="mt-8 flex flex-col gap-4">
          {profile.bio.map((paragraph) => (
            <p
              key={paragraph}
              className="text-base text-muted-foreground text-pretty"
            >
              {paragraph}
            </p>
          ))}
          <p className="text-base text-muted-foreground">
            {profile.current.employer}{" "}
            <span className="text-foreground">
              {profile.current.availability}
            </span>
          </p>
        </div>
      </div>

      <nav
        aria-label="Connect"
        className="md:col-start-3 md:row-start-1 md:text-right"
      >
        <h2 className="text-base font-bold tracking-tight text-foreground">
          Connect
        </h2>
        <ul className="mt-2 flex flex-col">
          {connectLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="text-base text-muted-foreground decoration-1 underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}
