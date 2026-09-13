# Private assets

Files here are **not** served by the site directly. Anything in `public/` is
fetchable by URL with no password, so images for a password-protected case
study live here instead:

    images/<slug>/            images for one gated case study; <slug> matches
                              its card in lib/portfolio-data.ts
                              <block>-NN.webp       gallery panel
                              <block>-NN-full.webp  lightbox (highResSrc)

They are streamed by `app/api/case-study/[slug]/image/[name]`, and only to a
visitor holding the access cookie a correct password sets. The case study text
itself is in `lib/private/case-studies.ts`.

Naming and sizing follow `public/images/README.md`. The folder is bundled into
the image route by `outputFileTracingIncludes` in `next.config.mjs`; a file
added here needs no other wiring beyond its entry in the case study.

The cover is the exception. The homepage card is public, so a gated project's
cover goes in `public/images/projects/<slug>/cover.webp` like every other, and
must be safe for anyone to see.
