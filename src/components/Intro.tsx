"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

const HOLD_MS = 750;
const SPLIT_DURATION = 0.9;

/**
 * One-time full-screen intro: the name on a red field, held for a beat,
 * then the field splits top/bottom and slides away to reveal the site.
 * Lives in the root layout, so it plays once per full page load and never
 * replays on client-side route changes.
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
    }, HOLD_MS + SPLIT_DURATION * 1000);

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
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-accent"
        animate={{ y: split ? "-100%" : 0 }}
        transition={{ duration: SPLIT_DURATION, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="absolute inset-x-0 top-0 flex h-[100svh] items-center justify-center px-6">
          <NameMark />
        </div>
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
