// Real-time Saturn ring tilt, for the math-persona cursor easter egg
// (Cursor.tsx) — the cursor's ring is drawn at this real angle, not a
// decorative constant.
//
// B = the "Saturnicentric latitude of the Earth" — how many degrees the ring
// plane is opened up as seen from Earth right now. It oscillates roughly
// sinusoidally between about -27° and +27° over Saturn's ~29.5-year orbit,
// crossing 0° (rings edge-on) whenever Earth passes through the ring plane.
// Formula: Meeus, "Astronomical Algorithms", ch. 45. Positions of Earth and
// Saturn come from orbitalMechanics.ts's low-precision Keplerian elements
// (good to ~1' of arc from 1800-2050, plenty for a decorative tilt angle)
// rather than a full planetary theory — no need for VSOP87-level precision
// here.
//
// Sanity-checked against known events: 2009-09-04 and 2025-03-23 ring-plane
// crossings both come out within ~0.2° of edge-on (B≈0), and the "wide open"
// Cassini Grand Finale moment (Oct 2017) comes out at B≈27°, matching the
// widely-reported near-maximum tilt at the time.

import {
  D2R,
  PLANET_ELEMENTS,
  centuriesSinceJ2000,
  heliocentricPosition,
} from "@/lib/orbitalMechanics";

/**
 * Current tilt of Saturn's rings as seen from Earth, in degrees. Positive
 * means we're looking at the north face of the rings, negative the south;
 * magnitude ranges roughly 0° (edge-on) to ~27° (wide open).
 */
export function getSaturnRingTiltDeg(date: Date = new Date()): number {
  const T = centuriesSinceJ2000(date);

  const [xe, ye, ze] = heliocentricPosition(PLANET_ELEMENTS.earth, T);
  const [xs, ys, zs] = heliocentricPosition(PLANET_ELEMENTS.saturn, T);

  const dx = xs - xe;
  const dy = ys - ye;
  const dz = zs - ze;

  const lambda = Math.atan2(dy, dx);
  const beta = Math.atan2(dz, Math.sqrt(dx * dx + dy * dy));

  // Orientation of Saturn's ring plane relative to the ecliptic (Meeus 45.1).
  const ringInclination = (28.075216 - 0.012998 * T) * D2R;
  const ringNode = (169.50847 + 1.394681 * T) * D2R;

  const sinB =
    Math.sin(ringInclination) * Math.cos(beta) * Math.sin(lambda - ringNode) -
    Math.cos(ringInclination) * Math.sin(beta);

  return Math.asin(sinB) / D2R;
}
