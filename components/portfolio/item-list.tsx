import type { ListItem } from "@/lib/portfolio-data"

type ItemListProps = {
  heading?: string
  items: ListItem[]
  className?: string
}

/**
 * Reusable titled list. Each row shows a bold title and a one-line
 * muted description, with a soft rounded highlight on hover.
 * Drop it anywhere — intro, project pages, tooling sections.
 */
export function ItemList({ heading, items, className }: ItemListProps) {
  return (
    <section className={className}>
      {heading ? (
        <h2 className="mb-3 text-base font-bold tracking-tight text-foreground">
          {heading}
        </h2>
      ) : null}
      {/*
        The resting highlight needs the rows held apart. Abutting rows share an
        edge, which is invisible while only the hovered one is filled but reads
        as a single dented slab once they all are — 8px separates them back
        into three cards. Desktop keeps the flush stack, where a gap would show
        as a jump between rows.
      */}
      <ul className="flex flex-col max-lg:gap-2 [@media(hover:none)]:gap-2">
        {items.map((item) => (
          <li key={item.title}>
            {/*
              The highlight rests on everywhere but desktop, and only desktop
              reveals it on hover. Two conditions, because either one alone
              misses a case:
              - Below `lg` (mobile and tablet) it rests on whatever the input,
                so a tablet with a trackpad reads the same as one without, and
                both match the phone layout they sit closest to.
              - `hover: none` keeps it on at any width, for a touch screen
                large enough to pass for desktop, which has no hover to reveal
                it with.
            */}
            <div className="-mx-4 rounded-2xl px-4 py-3 transition-colors hover:bg-muted max-lg:bg-muted [@media(hover:none)]:bg-muted">
              <p className="text-detail font-bold tracking-tight text-foreground">
                {item.title}
              </p>
              <p className="mt-0.5 text-detail text-muted-foreground text-pretty">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
