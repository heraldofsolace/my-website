"use client";

// Adapted from React Bits' GridMotion (https://reactbits.dev). Upstream
// drives the per-row parallax with gsap's ticker + gsap.to. Same call as
// TextType.tsx: this site has exactly one animation library (framer-motion,
// used everywhere from Hero's own name reveal to PersonaTransition), so the
// mouse-follow here runs on framer's motion values + springs instead of
// pulling in gsap as a second engine for one continuous drag effect.
import { useEffect, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

interface GridMotionProps {
  items?: (string | ReactNode)[];
  gradientColor?: string;
  className?: string;
}

const ROWS = 4;
const COLS = 7;
const TOTAL_ITEMS = ROWS * COLS;
const MAX_MOVE_AMOUNT = 300;

// Stand-ins for gsap's per-row `inertiaFactors` ([0.6, 0.4, 0.3, 0.2] added
// to a shared base duration, so row 0 settled slowest and row 3 fastest) —
// same ordering, expressed as spring stiffness instead of tween duration.
const ROW_SPRINGS = [
  { stiffness: 26, damping: 20 },
  { stiffness: 34, damping: 20 },
  { stiffness: 40, damping: 20 },
  { stiffness: 48, damping: 20 },
] as const;

function GridRow({
  content,
  mouseXRatio,
  direction,
  spring,
}: {
  content: (string | ReactNode)[];
  mouseXRatio: MotionValue<number>;
  direction: 1 | -1;
  spring: (typeof ROW_SPRINGS)[number];
}) {
  const targetX = useTransform(
    mouseXRatio,
    (ratio) => (ratio * MAX_MOVE_AMOUNT - MAX_MOVE_AMOUNT / 2) * direction
  );
  const x = useSpring(targetX, spring);

  return (
    <motion.div
      className="grid grid-cols-7 gap-4"
      style={{ x, willChange: "transform" }}
    >
      {content.map((item, itemIndex) => (
        <div key={itemIndex} className="relative">
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] bg-[#111] text-[1.5rem] text-white">
            {typeof item === "string" && item.startsWith("http") ? (
              <div
                className="absolute left-0 top-0 h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${item})` }}
              />
            ) : (
              <div className="z-[1] p-4 text-center">{item}</div>
            )}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default function GridMotion({
  items = [],
  gradientColor = "black",
  className = "",
}: GridMotionProps) {
  const mouseXRatio = useMotionValue(0.5);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      mouseXRatio.set(e.clientX / window.innerWidth);
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [mouseXRatio]);

  const defaultItems = Array.from({ length: TOTAL_ITEMS }, (_, i) => `Item ${i + 1}`);
  const combinedItems = items.length > 0 ? items.slice(0, TOTAL_ITEMS) : defaultItems;

  return (
    <div className={`h-full w-full overflow-hidden ${className}`}>
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
        style={{ background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)` }}
      >
        <div className="relative z-[2] grid h-[150vh] w-[150vw] flex-none origin-center grid-cols-1 grid-rows-4 gap-4 rotate-[-15deg]">
          {Array.from({ length: ROWS }, (_, rowIndex) => (
            <GridRow
              key={rowIndex}
              content={combinedItems.slice(rowIndex * COLS, rowIndex * COLS + COLS)}
              mouseXRatio={mouseXRatio}
              direction={rowIndex % 2 === 0 ? 1 : -1}
              spring={ROW_SPRINGS[rowIndex % ROW_SPRINGS.length]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
