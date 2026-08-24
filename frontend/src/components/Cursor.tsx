"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { usePersona } from "@/lib/persona";

export default function Cursor() {
  const { persona } = usePersona();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 30, stiffness: 400, mass: 0.4 });
  const springY = useSpring(y, { damping: 30, stiffness: 400, mass: 0.4 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, [data-cursor-hover]"));
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="cursor-dot pointer-events-none fixed left-0 top-0 z-[70] mix-blend-difference"
      style={{ x: springX, y: springY }}
    >
      {persona === "math" && (
        // Saturn's ring — a tilted ellipse outline centered behind the
        // planet (the circle below). No front/back split; at cursor scale
        // a single ring reads fine. Opts out of the parent's
        // mix-blend-difference (which was washing it out) in favor of a
        // solid, always-vivid accent color — set inline because
        // globals.css's `* { border-color: var(--line) }` is unlayered
        // and beats any `border-{color}` Tailwind utility here.
        <motion.div
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border-3 mix-blend-normal"
          style={{ rotate: -24, borderColor: "var(--accent)" }}
          animate={{
            width: hovering ? 60 : 25,
            height: hovering ? 38 : 11,
          }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
        />
      )}
      {persona === "devrel" ? (
        <motion.div
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 select-none font-display font-bold leading-none text-fg"
          animate={{ fontSize: hovering ? 40 : 16 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
        >
          @
        </motion.div>
      ) : (
        <motion.div
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg"
          animate={{
            width: hovering ? 44 : 15,
            height: hovering ? 44 : 15,
          }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
        />
      )}
    </motion.div>
  );
}
