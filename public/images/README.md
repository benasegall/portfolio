# Image assets

    site/                     photos used across the site (portrait, OG image…)
    projects/<slug>/          images for one project; <slug> matches the
                              `slug` field in lib/portfolio-data.ts
                              cover.*  is the slider / modal cover image

Paths are referenced from `lib/portfolio-data.ts`, not hardcoded in components.
