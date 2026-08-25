// Shared low-precision orbital mechanics — real heliocentric planet
// positions from JPL's published Keplerian elements, used by both the
// Saturn ring-tilt cursor (saturnTilt.ts) and the live solar-system Hero
// background (SolarSystemBg.tsx). Not a full planetary theory (no
// perturbation terms), but accurate to well under a degree, which is
// plenty for a decorative "where are the planets right now" visual.

export const D2R = Math.PI / 180;

export type OrbitalElements = {
  a: number; // semi-major axis, AU
  adot: number; // AU / century
  e: number; // eccentricity
  edot: number; // / century
  i: number; // inclination, deg
  idot: number; // deg / century
  l: number; // mean longitude, deg
  ldot: number; // deg / century
  peri: number; // longitude of perihelion, deg
  peridot: number; // deg / century
  node: number; // longitude of ascending node, deg
  nodedot: number; // deg / century
};

export type PlanetId =
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

// J2000.0 mean elements + linear secular rates (deg/century, AU/century).
// Source: JPL Solar System Dynamics, "Keplerian Elements for Approximate
// Positions of the Major Planets", table valid 1800 AD-2050 AD
// (https://ssd.jpl.nasa.gov/planets/approx_pos.html) — fetched and
// transcribed directly from that page, not from memory.
export const PLANET_ELEMENTS: Record<PlanetId, OrbitalElements> = {
  mercury: {
    a: 0.38709927, adot: 0.00000037,
    e: 0.20563593, edot: 0.00001906,
    i: 7.00497902, idot: -0.00594749,
    l: 252.2503235, ldot: 149472.67411175,
    peri: 77.45779628, peridot: 0.16047689,
    node: 48.33076593, nodedot: -0.12534081,
  },
  venus: {
    a: 0.72333566, adot: 0.0000039,
    e: 0.00677672, edot: -0.00004107,
    i: 3.39467605, idot: -0.0007889,
    l: 181.9790995, ldot: 58517.81538729,
    peri: 131.60246718, peridot: 0.00268329,
    node: 76.67984255, nodedot: -0.27769418,
  },
  earth: {
    a: 1.00000261, adot: 0.00000562,
    e: 0.01671123, edot: -0.00004392,
    i: -0.00001531, idot: -0.01294668,
    l: 100.46457166, ldot: 35999.37244981,
    peri: 102.93768193, peridot: 0.32327364,
    node: 0, nodedot: 0,
  },
  mars: {
    a: 1.52371034, adot: 0.00001847,
    e: 0.0933941, edot: 0.00007882,
    i: 1.84969142, idot: -0.00813131,
    l: -4.55343205, ldot: 19140.30268499,
    peri: -23.94362959, peridot: 0.44441088,
    node: 49.55953891, nodedot: -0.29257343,
  },
  jupiter: {
    a: 5.202887, adot: -0.00011607,
    e: 0.04838624, edot: -0.00013253,
    i: 1.30439695, idot: -0.00183714,
    l: 34.39644051, ldot: 3034.74612775,
    peri: 14.72847983, peridot: 0.21252668,
    node: 100.47390909, nodedot: 0.20469106,
  },
  saturn: {
    a: 9.53667594, adot: -0.0012506,
    e: 0.05386179, edot: -0.00050991,
    i: 2.48599187, idot: 0.00193609,
    l: 49.95424423, ldot: 1222.49362201,
    peri: 92.59887831, peridot: -0.41897216,
    node: 113.66242448, nodedot: -0.28867794,
  },
  uranus: {
    a: 19.18916464, adot: -0.00196176,
    e: 0.04725744, edot: -0.00004397,
    i: 0.77263783, idot: -0.00242939,
    l: 313.23810451, ldot: 428.48202785,
    peri: 170.9542763, peridot: 0.40805281,
    node: 74.01692503, nodedot: 0.04240589,
  },
  neptune: {
    a: 30.06992276, adot: 0.00026291,
    e: 0.00859048, edot: 0.00005105,
    i: 1.77004347, idot: 0.00035372,
    l: -55.12002969, ldot: 218.45945325,
    peri: 44.96476227, peridot: -0.32241464,
    node: 131.78422574, nodedot: -0.00508664,
  },
};

/** Julian centuries since J2000.0 (TT ≈ UT for this purpose). */
export function centuriesSinceJ2000(date: Date): number {
  const julianDay = date.getTime() / 86400000 + 2440587.5;
  return (julianDay - 2451545.0) / 36525;
}

function solveKepler(meanAnomalyRad: number, e: number): number {
  let E = meanAnomalyRad;
  for (let i = 0; i < 8; i++) {
    E -= (E - e * Math.sin(E) - meanAnomalyRad) / (1 - e * Math.cos(E));
  }
  return E;
}

/** Heliocentric ecliptic (J2000) rectangular coordinates, in AU. */
export function heliocentricPosition(
  el: OrbitalElements,
  centuriesSinceJ2000Value: number
): [number, number, number] {
  const T = centuriesSinceJ2000Value;
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

/** Heliocentric position of a given planet at a given date, in AU. */
export function getHeliocentricPosition(
  planet: PlanetId,
  date: Date = new Date()
): [number, number, number] {
  return heliocentricPosition(PLANET_ELEMENTS[planet], centuriesSinceJ2000(date));
}
