"use client";

import { motion } from "framer-motion";
import { usePersona } from "@/lib/persona";

export default function PersonaToggle() {
  const { persona, requestSwitch } = usePersona();

  return (
    <button
      type="button"
      data-cursor-hover
      onClick={requestSwitch}
      aria-label="Visit the other side"
      className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-fg"
    >
      <span className="relative flex h-4 w-8 shrink-0 items-center rounded-full bg-bg-soft">
        <motion.span
          className="absolute h-3 w-3 rounded-full bg-accent"
          animate={{ x: persona === "devrel" ? 2 : 18 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </span>
      {/* Now that this lives directly in the (always-visible) navbar header
          instead of inside the menu panel, it has to share a single row
          with the logo and, below lg, the menu toggle too — the label
          crowded that row on narrow phones, so it drops first. */}
      <span className="hidden sm:inline">Visit the other side</span>
    </button>
  );
}
