"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { hash } from "@/lib/pseudoRandom";

const HOLD_MS = 550;
const SHATTER_DURATION = 1;
// The red field starts fading a bit after the shatter begins (so the break
// reads clearly against solid red first) and finishes after the shatter —
// a smooth fade-out instead of the field just vanishing the instant the
// last character does.
const BG_FADE_DELAY = SHATTER_DURATION * 0.3;
const BG_FADE_DURATION = SHATTER_DURATION * 0.8;
const TOTAL_AFTER_HOLD = BG_FADE_DELAY + BG_FADE_DURATION;
const TEXT = "Loading the other side";
// Explicit escape, not a literal space — a plain " " here is the sole
// content of an inline-block span and gets collapsed away by normal CSS
// whitespace rules, which is exactly the "no gap between letters" bug.
const NBSP = " ";

/**
 * Fullscreen red overlay shown while switching persona: the text holds
 * for a beat, then breaks into per-character pieces that fly apart and
 * fade, and the red field itself fades out shortly after (rather than
 * cutting out the instant the last piece does). The actual persona swap
 * (onSwap) fires right as the break begins, hidden behind the still-solid
 * field — so nothing underneath is visible mid-swap. onDone fires once
 * the field has fully faded.
 */
export default function PersonaTransition({
  onSwap,
  onDone,
}: {
  onSwap: () => void;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<"hold" | "shatter">("hold");

  useEffect(() => {
    const shatterTimer = setTimeout(() => {
      onSwap();
      setPhase("shatter");
    }, HOLD_MS);
    const doneTimer = setTimeout(
      () => onDone(),
      HOLD_MS + TOTAL_AFTER_HOLD * 1000
    );
    return () => {
      clearTimeout(shatterTimer);
      clearTimeout(doneTimer);
    };
  }, [onSwap, onDone]);

  const shattering = phase === "shatter";
  const chars = TEXT.split("");

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-accent px-6"
      initial={{ opacity: 1 }}
      animate={{ opacity: shattering ? 0 : 1 }}
      transition={{
        duration: BG_FADE_DURATION,
        delay: shattering ? BG_FADE_DELAY : 0,
        ease: "easeOut",
      }}
    >
      <p className="text-center font-display text-4xl font-semibold tracking-tight text-bg sm:text-5xl lg:text-6xl">
        {chars.map((ch, i) => {
          const dx = (hash(i * 3.1 + 1) - 0.5) * 500;
          const dy = (hash(i * 5.7 + 2) - 0.5) * 400;
          const rotate = (hash(i * 7.3 + 3) - 0.5) * 360;

          return (
            <motion.span
              key={i}
              className="inline-block"
              animate={
                shattering
                  ? { x: dx, y: dy, rotate, opacity: 0 }
                  : { x: 0, y: 0, rotate: 0, opacity: 1 }
              }
              transition={{ duration: SHATTER_DURATION, ease: [0.4, 0, 0.2, 1] }}
            >
              {ch === " " ? NBSP : ch}
            </motion.span>
          );
        })}
      </p>
    </motion.div>
  );
}
