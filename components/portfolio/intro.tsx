import { profile, connectLinks } from "@/lib/portfolio-data"

export function Intro() {
  return (
    <section className="portfolio-frame grid min-h-[min(760px,88vh)] grid-cols-4 gap-4 px-6 py-16 md:grid-cols-12 md:gap-0 md:px-8 md:py-24">
      <div className="col-span-4 flex flex-col justify-between md:col-span-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">01 / Profile</p>
        <p className="hidden max-w-[12rem] text-sm leading-relaxed text-muted-foreground md:block">An experience designer interested in the choices behind the interface.</p>
      </div>

      <div className="col-span-4 flex flex-col justify-center text-center md:col-span-6">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-brand">London · USA · IBM</p>
        <h1 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">{profile.name}</h1>
        <p className="mt-2 text-xl tracking-tight text-muted-foreground">{profile.role}</p>
        <div className="mx-auto mt-12 flex max-w-lg flex-col gap-5 text-left md:text-center">
          {profile.bio.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-muted-foreground text-pretty">{paragraph}</p>
          ))}
          <p className="text-base leading-relaxed text-muted-foreground">{profile.current.prefix}{" "}<span className="font-semibold text-foreground">{profile.current.company}</span></p>
        </div>
      </div>

      <nav aria-label="Connect" className="col-span-4 mt-12 md:col-span-3 md:mt-0 md:flex md:flex-col md:items-end md:justify-between md:text-right">
        <div>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">03 / Contact</p>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Connect</h2>
          <ul className="mt-3 flex flex-col gap-1">
            {connectLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noreferrer" : undefined} className="text-base text-muted-foreground transition-colors hover:text-brand focus-visible:text-brand">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-12 hidden max-w-[12rem] text-sm leading-relaxed text-muted-foreground md:block">Open to thoughtful collaborations and difficult questions.</p>
      </nav>
    </section>
  )
}
