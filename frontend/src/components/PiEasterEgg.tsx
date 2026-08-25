"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePersona } from "@/lib/persona";
import { PI_DIGITS } from "@/lib/piDigits";

// Easter egg, math persona only: type pi's first 7 digits ("3141592")
// anywhere on the page — not while focused in a text field — and a toast
// confirms it. Not advertised anywhere in the UI on purpose.
const TRIGGER = "3141592";
const TOAST_HOLD_MS = 4000;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA"
  );
}

// `e.key` is layout-dependent — on an AZERTY keyboard, say, the un-shifted
// top-row keys produce letters/accents, not digits, so matching on `.key`
// silently never triggers for a lot of real keyboards. `e.code` is the
// physical key position instead ("Digit3" from the top row, "Numpad3" from
// the numpad), unaffected by layout or by NumLock being off.
function digitFromEvent(e: KeyboardEvent): string | null {
  const match = /^(?:Digit|Numpad)([0-9])$/.exec(e.code);
  return match ? match[1] : null;
}

export default function PiEasterEgg() {
  const { persona } = usePersona();
  const [show, setShow] = useState(false);

  // Reset if persona flips away mid-display, so the toast can't linger
  // onto the devrel side. Set during render (React's documented pattern
  // for adjusting state when a prop changes), not in an effect.
  const [lastPersona, setLastPersona] = useState(persona);
  if (persona !== lastPersona) {
    setLastPersona(persona);
    if (persona !== "math") setShow(false);
  }

  useEffect(() => {
    if (persona !== "math") return;

    let buffer = "";
    function onKeyDown(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;
      const digit = digitFromEvent(e);
      if (!digit) {
        buffer = "";
        return;
      }
      buffer = (buffer + digit).slice(-TRIGGER.length);
      if (buffer === TRIGGER) {
        buffer = "";
        setShow(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [persona]);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), TOAST_HOLD_MS);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-8 z-[90] flex justify-center px-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="rounded-full border border-line bg-bg-soft px-5 py-2.5 font-mono text-xs text-fg shadow-lg">
            🥧 3.{PI_DIGITS}&hellip;
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
