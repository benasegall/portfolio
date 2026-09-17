/**
 * Moving focus without summoning a focus ring.
 *
 * A focus ring belongs to the keyboard. The browser decides when to draw one
 * — that is what `:focus-visible` is — and when script moves focus it hands
 * the decision to whatever the visitor did last. It counts typing as keyboard
 * use, which is where it goes wrong here: unlocking a gated case study means
 * typing a password, so every focus move after that carried a ring, and
 * closing the sheet left a 2px outline drawn around the project card that a
 * click-opened sheet never showed.
 *
 * Typing is not navigation. This module keeps its own record of how the
 * visitor last acted, ignoring keys pressed into a field, and `focusQuietly`
 * suppresses the ring when that record says the pointer is in charge. It is
 * only ever suppressed for a focus THIS code moves; focus the visitor moves
 * is the browser's business and is left alone.
 *
 * Suppression lasts until the next key that is not typing, so a visitor who
 * unlocks with a password and then reaches for Tab gets the ring back at the
 * first press — the one case where guessing wrong would strand a keyboard
 * user with no visible focus.
 *
 * The marker is `data-quiet-focus`; app/globals.css turns the outline off
 * while it is set.
 */

/** Keys typed into a field are text, not navigation. */
function inTextField(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest("input, textarea, select, [contenteditable]") !== null
  )
}

let lastInput: "pointer" | "keyboard" = "pointer"

if (typeof document !== "undefined") {
  document.addEventListener(
    "pointerdown",
    () => {
      lastInput = "pointer"
    },
    true,
  )
  document.addEventListener(
    "keydown",
    (e) => {
      // Shortcuts are the browser's, not navigation within the page.
      if (e.metaKey || e.ctrlKey || e.altKey || inTextField(e.target)) return
      lastInput = "keyboard"
    },
    true,
  )
}

/** How the visitor last acted, with typing left out. */
export function lastInputWasKeyboard() {
  return lastInput === "keyboard"
}

/**
 * Focus `el` the way the visitor is working: with a ring if they are on the
 * keyboard, without one if they are using a pointer.
 */
export function focusQuietly(el: HTMLElement | null | undefined) {
  if (!el) return

  if (lastInput === "keyboard") {
    el.focus()
    return
  }

  el.dataset.quietFocus = ""
  el.focus()

  // The ring comes back the moment the keyboard is in use after all. Capture,
  // so it runs before anything that stops the event.
  const release = (e: KeyboardEvent) => {
    if (inTextField(e.target)) return
    stop()
  }
  // Nothing to suppress once focus has moved on, and the element may well be
  // gone from the page by then.
  const blur = () => stop()
  function stop() {
    delete el!.dataset.quietFocus
    document.removeEventListener("keydown", release, true)
    el!.removeEventListener("blur", blur)
  }

  document.addEventListener("keydown", release, true)
  el.addEventListener("blur", blur)
}
