"use client"

import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { ArrowRight, X } from "lucide-react"
import type { GatedProject, Project } from "@/lib/portfolio-data"

type PasswordGateProps = {
  project: GatedProject | null
  onClose: () => void
  onUnlock: (project: Project) => void
}

/**
 * The password prompt for a gated case study.
 *
 * Built only from what the site already uses: the sheet's backdrop, card and
 * radius, and the round icon button of its close control — every button the
 * site has is one of those, so the enter button is too, with an arrow in place
 * of the cross. The check itself happens on the server (see
 * app/api/case-study/[slug]); nothing here knows the password or holds the
 * case study until the server sends it back.
 */
export function PasswordGate({ project, onClose, onUnlock }: PasswordGateProps) {
  if (!project) return null
  // Keyed, so every opening starts clean: no stale password or message.
  return <GateDialog key={project.slug} project={project} onClose={onClose} onUnlock={onUnlock} />
}

const WRONG = "That password is wrong. Try again."
const FAILED = "Something went wrong. Try again in a moment."

function tooManyAttempts(ms: number) {
  const minutes = Math.max(1, Math.ceil(ms / 60_000))
  return `Too many attempts. Try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`
}

function GateDialog({
  project,
  onClose,
  onUnlock,
}: {
  project: GatedProject
  onClose: () => void
  onUnlock: (project: Project) => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const labelId = useId()
  const inputId = useId()
  const messageId = useId()

  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const locked = lockedUntil !== null

  // Read through a ref, so a new callback from the parent never re-runs the
  // effects below — re-running the first would pull focus back to the field.
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  /*
   * Keep Tab inside the dialog, close on Escape, and hold the page still
   * underneath — the same contract as the project sheet. Returning focus to
   * the card is the caller's job, since only it knows which card opened the
   * gate.
   */
  useEffect(() => {
    const dialog = dialogRef.current

    const focusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>("button:not([disabled]), input") ?? [],
      ).filter((el) => el.getClientRects().length > 0)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current()
        return
      }
      if (e.key !== "Tab" || !dialog) return
      const items = focusable()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (!dialog.contains(active)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKey)
    document.body.classList.add("sheet-open")
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.classList.remove("sheet-open")
    }
  }, [])

  // When a lockout runs out, clear it and hand the field back.
  useEffect(() => {
    if (lockedUntil === null) return
    const timer = setTimeout(() => {
      setLockedUntil(null)
      setMessage(null)
      inputRef.current?.focus()
    }, Math.max(0, lockedUntil - Date.now()))
    return () => clearTimeout(timer)
  }, [lockedUntil])

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!password || pending || locked) return
    setPending(true)

    try {
      const response = await fetch(`/api/case-study/${project.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        cache: "no-store",
      })

      if (response.ok) {
        onUnlock((await response.json()) as Project)
        return
      }

      if (response.status === 429) {
        const { retryAfterMs } = (await response.json().catch(() => ({}))) as {
          retryAfterMs?: number
        }
        const wait = retryAfterMs ?? 60_000
        setLockedUntil(Date.now() + wait)
        setMessage(tooManyAttempts(wait))
        setPassword("")
        // The button is about to be disabled, and a disabled button drops
        // focus to the page behind the dialog. The field keeps it instead,
        // and reads the message out through aria-describedby.
        inputRef.current?.focus()
      } else if (response.status === 401) {
        setMessage(WRONG)
        // Selected rather than cleared: a typo can be fixed, and retyping
        // replaces it anyway.
        inputRef.current?.select()
      } else {
        setMessage(FAILED)
      }
    } catch {
      setMessage(FAILED)
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      {/* The sheet's own backdrop layer, for the same reasons — see
          project-modal.tsx. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[26rem] rounded-[2rem] bg-card p-8 shadow-2xl"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 flex size-10 cursor-pointer items-center justify-center rounded-full bg-card text-foreground shadow-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X aria-hidden="true" />
          </button>

          <form onSubmit={submit} noValidate>
            {/* One line doing two jobs: it says what to do, and it is the
                field's label, so the field needs no placeholder text. Padded
                clear of the close button it sits level with. */}
            <label
              id={labelId}
              htmlFor={inputId}
              className="block pr-12 text-base font-bold tracking-tight text-foreground"
            >
              Enter a password to access this project
            </label>

            <div className="mt-5 flex items-center gap-3">
              <input
                ref={inputRef}
                id={inputId}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // Read-only rather than disabled during a lockout: a disabled
                // field drops focus to the page behind the dialog.
                readOnly={locked}
                aria-disabled={locked}
                aria-describedby={messageId}
                aria-invalid={message === WRONG}
                className="h-10 min-w-0 flex-1 rounded-full border border-input bg-card px-4 text-base text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring aria-disabled:cursor-default aria-disabled:text-muted-foreground"
              />
              <button
                type="submit"
                aria-label="Enter"
                // Not disabled while a check is in flight — that would drop
                // focus from the button just pressed; submit() ignores repeats.
                disabled={!password || locked}
                className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-card text-foreground shadow-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:opacity-40 disabled:hover:bg-card"
              >
                <ArrowRight aria-hidden="true" />
              </button>
            </div>

            {/* The line is always there, so nothing moves when a message
                appears in it. `--destructive` is the site's medium grey — the
                palette has no red on purpose. */}
            <p id={messageId} aria-live="polite" className="mt-3 min-h-6 text-base text-destructive">
              {message}
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
