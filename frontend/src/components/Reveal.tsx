"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {/* framer-motion@13.1.1's declared children type (ReactNode |
          MotionValueNumber | MotionValueString) doesn't structurally
          accept a plain ReactElement under the newer @types/react@19.2
          ReactPortal shape — a types-package-version clash, not a real
          runtime issue (this has rendered correctly all along). `as
          ReactNode` re-triggers the same check since that's the type
          already being rejected; only `any` actually bypasses it. */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {children as any}
    </motion.div>
  );
}

/**
 * Wraps block-level content (e.g. a heading) with an opaque bar that sits
 * on top of it, then sweeps off to one side on scroll-into-view — the text
 * underneath was there the whole time, the bar just physically occludes it
 * until it passes, so the reveal edge can't drift out of sync with the bar.
 */
export function SweepReveal({
  children,
  className,
  delay = 0,
  barClassName = "bg-accent",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  barClassName?: string;
}) {
  return (
    <div className={`relative block overflow-hidden ${className ?? ""}`}>
      {children}
      <motion.div
        aria-hidden
        className={`absolute inset-0 ${barClassName}`}
        initial={{ x: "0%" }}
        whileInView={{ x: "100%" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  );
}

const wordContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const wordItem: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Splits text into words and reveals them with a per-word stagger + mask.
 * Uses a single parent `whileInView` observer that propagates animation
 * state to child variants, rather than one observer per word — many
 * sibling observers sharing the same viewport options can fail to re-fire
 * after the initial (pre-scroll) callback.
 */
export function RevealWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={wordContainer}
      transition={{ delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
          <motion.span className="inline-block" variants={wordItem}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
