# Image assets

    site/                     photos used across the site (portrait, OG image…)
    projects/<slug>/          images for one project; <slug> matches the
                              `slug` field in lib/portfolio-data.ts
                              cover.webp     slider / modal cover image
                              <block>-NN.webp      gallery panel
                              <block>-NN-full.webp lightbox (highResSrc)

`<block>` matches a `MediaBlock` id in lib/portfolio-data.ts. Panels are capped
at 1600px on the long edge, lightbox copies at 2600px; both WebP.

Sources are trimmed of their uniform borders and padded to one aspect ratio per
gallery, so a row of panels sits at a single height. The originals live outside
the repo.

Paths are referenced from `lib/portfolio-data.ts`, not hardcoded in components.
