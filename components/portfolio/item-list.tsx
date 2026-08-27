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
        <h2 className="mb-3 text-detail font-medium leading-snug tracking-tight text-foreground">
          {heading}
        </h2>
      ) : null}
      <ul className="flex flex-col">
        {items.map((item) => (
          <li key={item.title}>
            <div className="-mx-4 rounded-2xl px-4 py-3 transition-colors hover:bg-muted">
              <p className="text-detail font-medium leading-snug tracking-tight text-foreground">
                {item.title}
              </p>
              <p className="mt-0.5 text-detail leading-snug text-muted-foreground text-pretty">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
