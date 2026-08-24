"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

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
            <NameMark />
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
          <NameMark />
        </div>
      </motion.div>
    </div>
  );
}

function NameMark() {
  return (
    <motion.h1
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-center font-display text-[6.5vw] font-semibold leading-[1.05] tracking-tight text-bg sm:text-[6vw] lg:text-[4.5vw]"
    >
      {profile.name}
    </motion.h1>
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

// Deterministic pseudo-random in [0, 1), seeded by index — avoids
// Math.random() hydration mismatches between server and client.
function hash(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

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
