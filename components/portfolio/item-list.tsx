import type { ListItem } from "@/lib/portfolio-data"

type ItemListProps = {
  heading?: string
  items: ListItem[]
  className?: string
}

/**
 * Reusable titled list. Each row shows a bold title and a one-line
 * muted description, on a soft rounded card.
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
        Every row rests filled, at every width and with any input — the rows
        aren't interactive, so there is nothing for a hover to announce. The
        filled rows need holding apart: abutting ones share an edge and read as
        a single dented slab, so 8px separates them back into cards.
      */}
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.title}>
            <div className="-mx-4 rounded-2xl bg-muted px-4 py-3">
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
