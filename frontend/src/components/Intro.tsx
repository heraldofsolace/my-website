"use client";

import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { hash } from "@/lib/pseudoRandom";
import { introQuotes, type IntroQuote } from "@/lib/introQuotes";

const HOLD_MS = 750;
const SPLIT_DURATION = 0.9;

// Drop timing — see GooDrops. Kept as constants so OVERLAY_DURATION can be
// derived from them instead of guessed.
const DROP_MAX_DELAY = 0.22;
const DROP_MAX_FALL_DURATION = 0.75;
const CAP_FADE_DURATION = 0.2;
const DROPS_END =
  DROP_MAX_DELAY + DROP_MAX_FALL_DURATION + CAP_FADE_DURATION + 0.1;
const OVERLAY_DURATION = Math.max(SPLIT_DURATION, DROPS_END);

/**
 * One-time full-screen intro: the name on a red field, held for a beat,
 * then the field splits top/bottom and slides away to reveal the site —
 * with gooey liquid drops dripping from the retreating top half as it
 * pulls away. Lives in the root layout, so it plays once per full page
 * load and never replays on client-side route changes.
 */
export default function Intro() {
  const [phase, setPhase] = useState<"hold" | "split" | "done">("hold");

  // Picked once, client-side only, and shared by both mirrored halves below
  // (each picking independently would show two different quotes at once).
  // Starts null — rendered as the site name in the meantime — rather than
  // via Math.random() at render time, which would differ between server
  // and client and cause a hydration mismatch (same class of bug as the
  // Saturn cursor tilt earlier in this file's sibling components).
  const [quote, setQuote] = useState<IntroQuote | null>(null);
  useEffect(() => {
    // Deliberately synchronous: Math.random() is the external-system read
    // that the null fallback above exists to defer past SSR/first paint —
    // there's no client/server-agreeable way to pick it during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuote(introQuotes[Math.floor(Math.random() * introQuotes.length)]);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      const skipTimer = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(skipTimer);
    }

    document.body.style.overflow = "hidden";
    const splitTimer = setTimeout(() => setPhase("split"), HOLD_MS);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, HOLD_MS + OVERLAY_DURATION * 1000);

    return () => {
      clearTimeout(splitTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  const split = phase === "split";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[110] overflow-hidden"
    >
      <GooFilter />

      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-accent"
        animate={{ y: split ? "-100%" : 0 }}
        transition={{ duration: SPLIT_DURATION, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-0 top-0 flex h-[100svh] items-center justify-center px-6">
            <QuoteMark quote={quote} />
          </div>
        </div>
        {/* Anchored to this bar's own bottom edge (the seam), so it rides
            up with the bar as it retreats — the drops read as dripping
            off the edge rather than hanging in fixed space. */}
        {split && <GooDrops />}
      </motion.div>

      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-accent"
        animate={{ y: split ? "100%" : 0 }}
        transition={{ duration: SPLIT_DURATION, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="absolute inset-x-0 bottom-0 flex h-[100svh] items-center justify-center px-6">
          <QuoteMark quote={quote} />
        </div>
      </motion.div>
    </div>
  );
}

// Quotes vary wildly in length (a one-liner pun vs. someone pasting in a
// whole lecture transcript), so a fixed font size can't work for all of
// them — instead measure the rendered text and shrink it to fit.
const MAX_QUOTE_FONT_PX = 40;
const MIN_QUOTE_FONT_PX = 9;

function QuoteMark({ quote }: { quote: IntroQuote | null }) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(MAX_QUOTE_FONT_PX);

  useLayoutEffect(() => {
    if (!quote || !textRef.current) return;
    const el = textRef.current;
    // Both mirrored halves center this same content within their own
    // full-viewport-height box, each cropped to just its own half (see the
    // top/bottom overflow-hidden clipping in Intro's render above) — so
    // between the two, nearly the *entire* centered content is reconstructed
    // across the seam, not just one half's worth. Budget close to a full
    // window height, not half of it. Tuned by feel, not measured precisely,
    // same as this file's other animation constants.
    const heightBudget = window.innerHeight * 0.78;

    let size = MAX_QUOTE_FONT_PX;
    for (let i = 0; i < 8; i++) {
      el.style.fontSize = `${size}px`;
      const overflowRatio = el.scrollHeight / heightBudget;
      if (overflowRatio <= 1 || size <= MIN_QUOTE_FONT_PX) break;
      // Shrink proportionally to how far over budget it is rather than by
      // a fixed step — a one-line pun and a wall of text need very
      // different amounts of shrinking to converge in a handful of passes.
      size = Math.max(MIN_QUOTE_FONT_PX, Math.floor(size / overflowRatio));
    }
    setFontSize(size);
  }, [quote]);

  // No quote landed yet (very first paint, pre-hydration) — render nothing
  // rather than the name as a placeholder. The red field is already fully
  // visible either way; the only difference is whether text is in it yet,
  // and that gap is a single frame at most. Showing the name first and
  // then swapping in the quote a moment later reads as a visible flash —
  // worse than a blank beat, not better.
  if (!quote) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      // max-h + overflow-hidden is a last-resort safety net, not the
      // primary mechanism — the shrink loop above should always land
      // under budget first. Keeps an even longer future quote contained
      // rather than spilling into the rest of the page.
      className="mx-auto max-h-[80svh] max-w-4xl overflow-hidden text-center"
    >
      <p
        ref={textRef}
        className="font-display font-semibold leading-tight tracking-tight text-bg"
        style={{ fontSize }}
      >
        {quote.text}
      </p>
      {quote.author && (
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-bg/70">
          — {quote.author}
        </p>
      )}
    </motion.div>
  );
}

/** Hidden SVG filter def that gives the drops their liquid, merging look. */
function GooFilter() {
  return (
    <svg aria-hidden className="absolute h-0 w-0">
      <defs>
        <filter id="intro-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
          />
        </filter>
      </defs>
    </svg>
  );
}

const DROP_COUNT = 9;

/**
 * Drops hanging off the seam where the two halves meet, right as they
 * start to pull apart. Each drop is a fixed "cap" plus a "bead" that falls
 * and shrinks away from it — the goo filter blurs them into one blob while
 * they're close, so the bead reads as stretching off the cap before it
 * pinches off, exactly like a real drip.
 */
function GooDrops() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 h-0"
      style={{ filter: "url(#intro-goo)" }}
    >
      {Array.from({ length: DROP_COUNT }, (_, i) => {
        const left = 6 + hash(i * 3.1 + 1) * 88;
        const capSize = 9 + hash(i * 5.7 + 2) * 9;
        const beadSize = capSize * 0.85;
        const fall = 70 + hash(i * 7.3 + 3) * 110;
        const delay = hash(i * 9.1 + 4) * DROP_MAX_DELAY;
        const duration =
          0.5 + hash(i * 11.3 + 5) * (DROP_MAX_FALL_DURATION - 0.5);

        return (
          <div
            key={i}
            className="absolute top-0 -translate-x-1/2"
            style={{ left: `${left}%` }}
          >
            <motion.div
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
              style={{ width: capSize, height: capSize }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{
                delay: delay + duration,
                duration: CAP_FADE_DURATION,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-accent"
              style={{ width: beadSize, height: beadSize }}
              initial={{ y: -beadSize * 0.4, opacity: 1, scale: 1 }}
              animate={{ y: fall, opacity: 0, scale: 0.4 }}
              transition={{ delay, duration, ease: [0.7, 0, 0.84, 0] }}
            />
          </div>
        );
      })}
    </div>
  );
}
