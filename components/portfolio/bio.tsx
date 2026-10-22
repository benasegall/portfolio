import { profile } from "@/lib/portfolio-data"

export function Bio() {
  return (
    <div className="mt-8 flex flex-col gap-4">
      {profile.bio.map((paragraph) => (
        <p key={paragraph} className="text-base text-muted-foreground text-pretty">
          {paragraph}
        </p>
      ))}
      <p className="text-base text-muted-foreground">
        {profile.current.location}{" "}
        <span className="text-foreground">{profile.current.availability}</span>
      </p>
    </div>
  )
}
