"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Springs up from 0 to `value` on mount. Deliberately doesn't gate on
 * scroll-into-view (unlike most of this site's reveal animations) — the
 * surrounding `Reveal` wrapper already handles the staggered entrance, and
 * gating this on its own IntersectionObserver-based `useInView` proved
 * unreliable specifically when this component remounts while the section
 * is already on screen (e.g. the persona toggle swapping these stats out
 * without a scroll happening) — the counter would sporadically get stuck
 * at 0. Animating unconditionally sidesteps that entirely.
 */
export default function Counter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 30, stiffness: 90 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return () => unsub();
  }, [spring]);

  return (
    <span className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}
