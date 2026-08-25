"use client";

import { useEffect, useState } from "react";
import {
  PLANET_ELEMENTS,
  centuriesSinceJ2000,
  heliocentricPosition,
  type PlanetId,
} from "@/lib/orbitalMechanics";

// Math-persona hero background: a live top-down diagram of the solar
// system, planets placed at their real current heliocentric longitude —
// computed once on mount (a static "right now" snapshot, not animated;
// real orbital motion is imperceptible over the length of a visit anyway).
// Orbit radii are schematic (sqrt-compressed AU, not linear-to-scale —
// Neptune's real distance would put it ~80x further out than Mercury,
// unusable on screen), but angles are the genuine current positions.

const PLANET_ORDER: PlanetId[] = [
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
];

// Not to scale — categorical by planet class (terrestrial / gas giant /
// ice giant), tuned by feel for a clean diagram rather than measured.
const PLANET_DOT_RADIUS: Record<PlanetId, number> = {
  mercury: 3, venus: 4, earth: 4.5, mars: 3.5,
  jupiter: 8, saturn: 7.5, uranus: 6, neptune: 6,
};

const VIEWBOX_SIZE = 800;
const CENTER = VIEWBOX_SIZE / 2;
const MIN_ORBIT_R = 55;
const MAX_ORBIT_R = 380;

type PlanetPoint = {
  id: PlanetId;
  x: number;
  y: number;
  orbitR: number;
  labelX: number;
  labelY: number;
  anchor: "start" | "end";
};

function computePlanetPoints(date: Date): PlanetPoint[] {
  const T = centuriesSinceJ2000(date);

  const distances = PLANET_ORDER.map((id) => {
    const [x, y] = heliocentricPosition(PLANET_ELEMENTS[id], T);
    return Math.sqrt(x * x + y * y);
  });
  const sqrtDistances = distances.map(Math.sqrt);
  const minSqrt = Math.min(...sqrtDistances);
  const maxSqrt = Math.max(...sqrtDistances);

  return PLANET_ORDER.map((id, i) => {
    const [x, y] = heliocentricPosition(PLANET_ELEMENTS[id], T);
    const angle = Math.atan2(y, x);
    const orbitR =
      MIN_ORBIT_R +
      ((sqrtDistances[i] - minSqrt) / (maxSqrt - minSqrt)) *
        (MAX_ORBIT_R - MIN_ORBIT_R);

    const px = CENTER + orbitR * Math.cos(angle);
    const py = CENTER + orbitR * Math.sin(angle);
    const labelOffset = PLANET_DOT_RADIUS[id] + 14;
    const onRightHalf = Math.cos(angle) >= 0;

    return {
      id,
      x: px,
      y: py,
      orbitR,
      labelX: px + (onRightHalf ? 1 : -1) * labelOffset,
      labelY: py,
      anchor: onRightHalf ? "start" : "end",
    };
  });
}

export default function SolarSystemBg({ className }: { className?: string }) {
  // Computed client-only, after mount — same reasoning as the Saturn ring
  // tilt in Cursor.tsx: the same computation run once during SSR and again
  // during client hydration can come back stringified to a different
  // decimal precision, a real hydration mismatch even though the
  // underlying value is "the same". Starting from null and filling in via
  // an effect sidesteps that; nothing here is needed for SEO.
  const [points, setPoints] = useState<PlanetPoint[] | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- external read (today's date), not derivable during render; see comment above.
    setPoints(computePlanetPoints(new Date()));
  }, []);

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      {points && (
        <>
          {points.map((p) => (
            <circle
              key={`orbit-${p.id}`}
              cx={CENTER}
              cy={CENTER}
              r={p.orbitR}
              fill="none"
              stroke="var(--fg)"
              strokeOpacity={0.14}
              strokeWidth={1}
            />
          ))}

          <circle cx={CENTER} cy={CENTER} r={16} fill="var(--accent)" />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={30}
            fill="none"
            stroke="var(--accent)"
            strokeOpacity={0.35}
            strokeWidth={1}
          />

          {points.map((p) => (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r={PLANET_DOT_RADIUS[p.id]} fill="var(--fg)" fillOpacity={0.85} />
              <text
                x={p.labelX}
                y={p.labelY}
                textAnchor={p.anchor}
                dominantBaseline="middle"
                className="font-mono uppercase"
                fontSize={11}
                letterSpacing={2}
                fill="var(--fg)"
                fillOpacity={0.55}
              >
                {p.id}
              </text>
            </g>
          ))}
        </>
      )}
    </svg>
  );
}
