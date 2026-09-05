"use client";

import { motion } from "framer-motion";
import { usePersona } from "@/lib/persona";
import StarBorder from "./StarBorder";

export default function PersonaToggle() {
  const { persona, requestSwitch } = usePersona();

  return (
    <StarBorder
      as="button"
      type="button"
      data-cursor-hover
      onClick={requestSwitch}
      aria-label="Visit the other side"
      className="group"
      color="var(--accent)"
      speed="7s"
      thickness={1}
      padding="0.375rem 0.75rem"
      // Kept close to --bg (not --bg-soft) on purpose — the switch track
      // below is --bg-soft, and needs to still read as a lighter pill
      // sitting on top of the button rather than disappearing into a
      // same-toned surface.
      backgroundColor="var(--bg)"
      borderColor="var(--line)"
      textColor="var(--muted)"
    >
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest transition-colors group-hover:text-fg">
        <span className="relative flex h-4 w-8 shrink-0 items-center rounded-full bg-bg-soft">
          <motion.span
            className="absolute h-3 w-3 rounded-full bg-accent"
            animate={{ x: persona === "devrel" ? 2 : 18 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </span>
        {/* Now that this lives directly in the (always-visible) navbar
            header instead of inside the menu panel, it has to share a
            single row with the logo and, below lg, the menu toggle too —
            the label crowded that row on narrow phones, so it drops
            first. */}
        <span className="hidden sm:inline">Visit the other side</span>
      </span>
    </StarBorder>
  );
}
