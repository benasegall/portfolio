import { NextResponse, type NextRequest } from "next/server"
import { getPrivateProject } from "@/lib/private/case-studies"
import {
  ACCESS_COOKIE,
  ACCESS_COOKIE_PATH,
  clearFailures,
  clientKey,
  isConfigured,
  issueToken,
  lockRemainingMs,
  passwordMatches,
  recordFailure,
  tokenIsValid,
} from "@/lib/private/gate"

/*
 * The only way to a private case study.
 *
 * GET returns it to a visitor who already holds a valid access cookie, so
 * someone who has entered the password this session goes straight to the
 * sheet. POST checks a password, applies the lockout, and on success sets the
 * cookie and returns the case study.
 *
 * Every response is uncacheable and marked noindex: the case study has no page
 * of its own, so this route is the only place a crawler could find it.
 */

type Context = { params: Promise<{ slug: string }> }

const HEADERS = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
}

function respond(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...HEADERS, ...extra } })
}

function tooManyAttempts(retryAfterMs: number) {
  return respond({ error: "too_many_attempts", retryAfterMs }, 429, {
    "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
  })
}

export async function GET(request: NextRequest, { params }: Context) {
  const { slug } = await params
  const project = getPrivateProject(slug)
  if (!project) return respond({ error: "not_found" }, 404)
  if (!tokenIsValid(request.cookies.get(ACCESS_COOKIE)?.value)) {
    return respond({ error: "password_required" }, 401)
  }
  return respond(project)
}

export async function POST(request: NextRequest, { params }: Context) {
  const { slug } = await params
  const project = getPrivateProject(slug)
  if (!project) return respond({ error: "not_found" }, 404)
  if (!isConfigured()) return respond({ error: "not_configured" }, 503)

  const key = clientKey(request)

  // Inside a lockout every attempt is refused unchecked, the right password
  // included — otherwise the lockout would not slow a guesser down at all.
  const lockedFor = await lockRemainingMs(key)
  if (lockedFor > 0) return tooManyAttempts(lockedFor)

  let attempt = ""
  try {
    const body = (await request.json()) as { password?: unknown }
    if (typeof body.password === "string") attempt = body.password.slice(0, 256)
  } catch {
    // An unreadable body is simply a wrong password.
  }

  if (!passwordMatches(attempt)) {
    const lockout = await recordFailure(key)
    return lockout > 0 ? tooManyAttempts(lockout) : respond({ error: "wrong_password" }, 401)
  }

  await clearFailures(key)
  const response = respond(project)
  // No maxAge, so it is a session cookie and clears when the browser closes.
  response.cookies.set(ACCESS_COOKIE, issueToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: ACCESS_COOKIE_PATH,
  })
  return response
}
