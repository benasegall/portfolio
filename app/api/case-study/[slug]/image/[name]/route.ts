import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse, type NextRequest } from "next/server"
import { getPrivateProject } from "@/lib/private/case-studies"
import { ACCESS_COOKIE, tokenIsValid } from "@/lib/private/gate"

/*
 * Serves a private case study's images, and only to a visitor holding a valid
 * access cookie. The files sit in `private/images/<slug>/`, outside `public/`,
 * because anything in `public/` can be fetched by URL with no password at all.
 *
 * The folder is bundled into this function through `outputFileTracingIncludes`
 * in next.config.mjs — files the code only reads at runtime are not traced
 * automatically, and without that they would be missing once deployed.
 */

type Context = { params: Promise<{ slug: string; name: string }> }

const TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
}

const HEADERS = {
  "X-Robots-Tag": "noindex, nofollow",
  // An image opened directly as a page — an SVG especially — runs nothing.
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
}

// Names come from the URL, so only plain file names are allowed: no slashes,
// no dots beyond the extension, nothing that could climb out of the folder.
const SAFE_NAME = /^[a-z0-9][a-z0-9-]*\.(webp|png|jpg|svg)$/

export async function GET(request: NextRequest, { params }: Context) {
  const { slug, name } = await params
  const notFound = () => new NextResponse(null, { status: 404, headers: HEADERS })

  if (!getPrivateProject(slug) || !SAFE_NAME.test(name)) return notFound()
  if (!tokenIsValid(request.cookies.get(ACCESS_COOKIE)?.value)) {
    return new NextResponse(null, { status: 401, headers: HEADERS })
  }

  try {
    const file = await readFile(path.join(process.cwd(), "private", "images", slug, name))
    return new NextResponse(new Uint8Array(file), {
      headers: {
        ...HEADERS,
        "Content-Type": TYPES[path.extname(name)],
        // Private, so no shared cache ever holds it; an hour in the browser so
        // swiping back through a gallery doesn't refetch every panel.
        "Cache-Control": "private, max-age=3600",
      },
    })
  } catch {
    return notFound()
  }
}
