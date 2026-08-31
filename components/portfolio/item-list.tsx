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
        into three cards. Hover devices keep the flush stack, where a gap would
        show as a jump between rows.
      */}
      <ul className="flex flex-col [@media(hover:none)]:gap-2">
        {items.map((item) => (
          <li key={item.title}>
            {/*
              The highlight rests on where there is no hover to reveal it.
              Keyed on `hover: none` rather than a width, because the reason is
              the input and not the screen: a pointer that cannot hover never
              earns the affordance, so the rows carry it at rest instead. That
              also covers a touch laptop and leaves a narrow desktop window
              alone. Tailwind's own `hover:` is already wrapped in
              `(hover: hover)`, so the two are exact complements.
            */}
            <div className="-mx-4 rounded-2xl px-4 py-3 transition-colors hover:bg-muted [@media(hover:none)]:bg-muted">
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
