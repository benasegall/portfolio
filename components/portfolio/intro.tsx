import { profile, connectLinks } from "@/lib/portfolio-data"

export function Intro() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-24 md:py-32 lg:grid-cols-[1fr_minmax(0,32rem)_1fr] lg:gap-8">
      {/* spacer keeps the bio optically centered on large screens */}
      <div className="hidden lg:block" aria-hidden="true" />

      <div className="mx-auto w-full max-w-lg text-balance lg:mx-0">
        <h1 className="text-lg font-semibold leading-snug tracking-tight text-foreground">
          {profile.name}
        </h1>
        <p className="text-base leading-snug tracking-tight text-muted-foreground">
          {profile.role}
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {profile.bio.map((paragraph) => (
            <p
              key={paragraph}
              className="text-base leading-snug text-muted-foreground text-pretty"
            >
              {paragraph}
            </p>
          ))}
          <p className="text-base leading-snug text-muted-foreground">
            {profile.current.prefix}{" "}
            <span className="font-semibold text-foreground">
              {profile.current.company}
            </span>
          </p>
        </div>
      </div>

      <nav
        aria-label="Connect"
        className="lg:justify-self-end lg:text-right"
      >
        <h2 className="text-lg font-semibold leading-snug tracking-tight text-foreground">
          Connect
        </h2>
        <ul className="mt-2 flex flex-col">
          {connectLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="text-base leading-snug text-muted-foreground transition-colors hover:text-foreground"
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
