import "server-only"

import { createHash, createHmac, timingSafeEqual } from "node:crypto"

/*
 * The password gate for private case studies.
 *
 * Everything here runs on the server. The password lives in an environment
 * variable, the check happens in a route handler, and the case study is only
 * sent once it passes — so there is nothing in the page's JavaScript for anyone
 * to read without the password. A check made in the browser would have had to
 * ship both the password and the content to every visitor.
 */

/** Holds proof of a correct password, so images can be gated too: an <img>
 *  cannot send a password, but it does send cookies. */
export const ACCESS_COOKIE = "case_study_access"

/** Scoped to the gated routes, so the cookie goes nowhere else on the site. */
export const ACCESS_COOKIE_PATH = "/api/case-study"

/** Server-side limit on an access token, independent of the cookie itself.
 *  The cookie clears when the browser closes, but a copied token should not
 *  outlive a day. */
const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000

/** How long a run of wrong attempts is remembered after the last one. */
const FAILURE_MEMORY_SECONDS = 24 * 60 * 60

function password(): string | null {
  return process.env.CASE_STUDY_PASSWORD || null
}

/** False until the password is set in the environment. With no password the
 *  gate stays shut rather than opening for an empty one. */
export function isConfigured(): boolean {
  return password() !== null
}

function sha256(value: string): Buffer {
  return createHash("sha256").update(value).digest()
}

/**
 * Compares in constant time. Hashing both sides first gives buffers of equal
 * length, which `timingSafeEqual` requires, and means the comparison takes the
 * same time whatever was typed — so response timing cannot be used to guess
 * the password a character at a time.
 */
export function passwordMatches(attempt: string): boolean {
  const expected = password()
  if (!expected) return false
  return timingSafeEqual(sha256(attempt), sha256(expected))
}

/*
 * Access tokens are `<expiry>.<signature>`, signed with the password itself.
 * That keeps the gate to one environment variable, and it means changing the
 * password signs everyone out at once, which is what you want if it leaks.
 */
function sign(expiry: number, key: string): string {
  return createHmac("sha256", key).update(`case-study-access:${expiry}`).digest("base64url")
}

export function issueToken(): string {
  const key = password()
  if (!key) throw new Error("CASE_STUDY_PASSWORD is not set")
  const expiry = Date.now() + TOKEN_LIFETIME_MS
  return `${expiry}.${sign(expiry, key)}`
}

export function tokenIsValid(token: string | undefined): boolean {
  const key = password()
  if (!key || !token) return false
  const [expiryText, signature] = token.split(".")
  const expiry = Number(expiryText)
  if (!Number.isFinite(expiry) || expiry < Date.now() || !signature) return false
  const expected = Buffer.from(sign(expiry, key))
  const given = Buffer.from(signature)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

/*
 * Lockout.
 *
 * Attempts are counted per connection, not per browser — keyed on the address
 * Vercel's edge reports, so clearing cookies or switching browsers does not
 * reset the count. The address is hashed before it is stored: a hash is all
 * the counter needs, and it keeps raw addresses out of a third-party store.
 *
 * The count clears 24 hours after the last wrong attempt, and a correct
 * password clears it at once.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  const address = forwarded || request.headers.get("x-real-ip") || "local"
  return createHash("sha256").update(`case-study-gate:${address}`).digest("hex").slice(0, 32)
}

/** Seconds of lockout earned by the nth wrong attempt. */
export function lockoutSeconds(failures: number): number {
  if (failures <= 5) return 0
  if (failures === 6) return 60
  if (failures === 7) return 5 * 60
  if (failures === 8) return 15 * 60
  return 60 * 60
}

/*
 * Upstash, over its REST API rather than its SDK, so the gate adds no
 * dependencies. The Vercel integration provisions the `KV_REST_API_*` names;
 * the `UPSTASH_REDIS_REST_*` ones are what Upstash uses outside Vercel.
 *
 * Returns null when the store cannot be reached. Callers then skip the lockout
 * but still check the password: an outage at a third party should not shut out
 * people who were given the password, and the password remains the real lock.
 */
async function redis(commands: (string | number)[][]): Promise<unknown[] | null> {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  try {
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands.map((command) => command.map(String))),
      cache: "no-store",
    })
    if (!response.ok) return null
    const results = (await response.json()) as { result?: unknown; error?: string }[]
    if (results.some((entry) => entry.error)) return null
    return results.map((entry) => entry.result)
  } catch {
    return null
  }
}

const failuresKey = (key: string) => `gate:failures:${key}`
const lockKey = (key: string) => `gate:lock:${key}`

/** Milliseconds left on a lockout, or 0 when not locked (or unknowable). */
export async function lockRemainingMs(key: string): Promise<number> {
  const results = await redis([["PTTL", lockKey(key)]])
  const remaining = Number(results?.[0])
  return Number.isFinite(remaining) && remaining > 0 ? remaining : 0
}

/** Records a wrong attempt; returns the lockout it earns, in milliseconds. */
export async function recordFailure(key: string): Promise<number> {
  const results = await redis([
    ["INCR", failuresKey(key)],
    ["EXPIRE", failuresKey(key), FAILURE_MEMORY_SECONDS],
  ])
  const failures = Number(results?.[0])
  if (!Number.isFinite(failures)) return 0

  const seconds = lockoutSeconds(failures)
  if (seconds > 0) await redis([["SET", lockKey(key), "1", "EX", seconds]])
  return seconds * 1000
}

export async function clearFailures(key: string): Promise<void> {
  await redis([["DEL", failuresKey(key), lockKey(key)]])
}
