import { profile } from "@/lib/portfolio-data"

/**
 * Framed portrait: a white card with a soft shadow around a square image.
 *
 * Placement follows the room available in the page grid. Stacked on mobile;
 * on tablet it sits above the bio in the middle track, because the side
 * columns are only ~93px there — too narrow for a portrait, though fine for
 * the Connect links. At desktop it moves into the left column and fills it,
 * and only then does it break out of the container (`.portrait-bleed`).
 *
 * The hover lift matches the project panels exactly (Vitrine's own values:
 * 6px rise, scale 1.01, .35s cubic-bezier(.2,0,0,1)). Note the transition
 * names `translate` and `scale`, not `transform` — Tailwind v4's translate
 * and scale utilities set those as separate CSS properties.
 */
export function Portrait() {
  return (
    <div className="portrait-bleed md:col-start-2 md:row-start-1 md:self-start lg:col-start-1">
      <div className="w-64 max-w-full rounded-[1.25rem] bg-card p-2 shadow-[0_1px_2px_rgb(0_0_0/0.03)] transition-[translate,scale,box-shadow] duration-[350ms] ease-[cubic-bezier(.2,0,0,1)] hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_4px_10px_rgb(0_0_0/0.05),0_2px_4px_rgb(0_0_0/0.02)] lg:w-full">
        <img
          src={profile.portrait.src}
          alt={profile.portrait.alt}
          width={1280}
          height={1280}
          className="aspect-square w-full rounded-[0.75rem] bg-muted object-cover"
        />
      </div>
    </div>
  )
}
