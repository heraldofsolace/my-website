// Deterministic pseudo-random in [0, 1), seeded by index — avoids
// Math.random() hydration mismatches between server and client. Shared by
// every component that scatters characters/drops around by index (Intro,
// PersonaTransition, Hero's click-to-break easter egg).
export function hash(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
