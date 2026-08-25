// Real-time Saturn ring tilt, for the math-persona cursor easter egg
// (Cursor.tsx) — the cursor's ring is drawn at this real angle, not a
// decorative constant.
//
// B = the "Saturnicentric latitude of the Earth" — how many degrees the ring
// plane is opened up as seen from Earth right now. It oscillates roughly
// sinusoidally between about -27° and +27° over Saturn's ~29.5-year orbit,
// crossing 0° (rings edge-on) whenever Earth passes through the ring plane.
// Formula: Meeus, "Astronomical Algorithms", ch. 45. Positions of Earth and
// Saturn come from JPL's low-precision Keplerian elements (good to ~1' of
// arc from 1800-2050, plenty for a decorative tilt angle) rather than a full
// planetary theory — no need for VSOP87-level precision here.
//
// Sanity-checked against known events: 2009-09-04 and 2025-03-23 ring-plane
// crossings both come out within ~0.2° of edge-on (B≈0), and the "wide open"
// Cassini Grand Finale moment (Oct 2017) comes out at B≈27°, matching the
// widely-reported near-maximum tilt at the time.

const D2R = Math.PI / 180;

type OrbitalElements = {
  a: number;
  adot: number;
  e: number;
  edot: number;
  i: number;
  idot: number;
  l: number;
  ldot: number;
  peri: number;
  peridot: number;
  node: number;
  nodedot: number;
};

// J2000.0 mean elements + linear secular rates (deg/century, AU/century).
// Source: JPL "Keplerian Elements for Approximate Positions of the Major
// Planets" (valid 1800 AD-2050 AD).
const EARTH: OrbitalElements = {
  a: 1.00000018,
  adot: -0.00000003,
  e: 0.01673163,
  edot: -0.00003661,
  i: -0.00054346,
  idot: -0.01337178,
  l: 100.46691572,
  ldot: 35999.37306329,
  peri: 102.93005885,
  peridot: 0.3179526,
  node: -5.11260389,
  nodedot: -0.24123856,
};

const SATURN: OrbitalElements = {
  a: 9.53667594,
  adot: -0.0012506,
  e: 0.05386179,
  edot: -0.00050991,
  i: 2.48599187,
  idot: 0.00193609,
  l: 49.95424423,
  ldot: 1222.49362201,
  peri: 92.59887831,
  peridot: -0.41897216,
  node: 113.66242448,
  nodedot: -0.28867794,
};

function solveKepler(meanAnomalyRad: number, e: number): number {
  let E = meanAnomalyRad;
  for (let i = 0; i < 8; i++) {
    E -= (E - e * Math.sin(E) - meanAnomalyRad) / (1 - e * Math.cos(E));
  }
  return E;
}

/** Heliocentric ecliptic (J2000) rectangular coordinates, in AU. */
function heliocentricPosition(
  el: OrbitalElements,
  centuriesSinceJ2000: number
): [number, number, number] {
  const T = centuriesSinceJ2000;
  const a = el.a + el.adot * T;
  const e = el.e + el.edot * T;
  const i = (el.i + el.idot * T) * D2R;
  const l = (el.l + el.ldot * T) * D2R;
  const peri = (el.peri + el.peridot * T) * D2R;
  const node = (el.node + el.nodedot * T) * D2R;
  const argPeri = peri - node;

  let meanAnomaly = l - peri;
  meanAnomaly = Math.atan2(Math.sin(meanAnomaly), Math.cos(meanAnomaly));
  const E = solveKepler(meanAnomaly, e);

  const xOrbit = a * (Math.cos(E) - e);
  const yOrbit = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const cosO = Math.cos(node);
  const sinO = Math.sin(node);
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);
  const cosW = Math.cos(argPeri);
  const sinW = Math.sin(argPeri);

  const x =
    (cosW * cosO - sinW * sinO * cosI) * xOrbit +
    (-sinW * cosO - cosW * sinO * cosI) * yOrbit;
  const y =
    (cosW * sinO + sinW * cosO * cosI) * xOrbit +
    (-sinW * sinO + cosW * cosO * cosI) * yOrbit;
  const z = sinW * sinI * xOrbit + cosW * sinI * yOrbit;

  return [x, y, z];
}

/**
 * Current tilt of Saturn's rings as seen from Earth, in degrees. Positive
 * means we're looking at the north face of the rings, negative the south;
 * magnitude ranges roughly 0° (edge-on) to ~27° (wide open).
 */
export function getSaturnRingTiltDeg(date: Date = new Date()): number {
  const julianDay = date.getTime() / 86400000 + 2440587.5;
  const T = (julianDay - 2451545.0) / 36525;

  const [xe, ye, ze] = heliocentricPosition(EARTH, T);
  const [xs, ys, zs] = heliocentricPosition(SATURN, T);

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
