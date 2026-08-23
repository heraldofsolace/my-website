"use client";

import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

type Props = HTMLMotionProps<"a"> & {
  children: ReactNode;
  strength?: number;
};

export default function MagneticLink({ children, strength = 0.35, className, ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={className}
      data-cursor-hover
      {...rest}
    >
      {children}
    </motion.a>
  );
}
