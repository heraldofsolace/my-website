"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import MagneticLink from "./MagneticLink";
import SolarSystemBg from "./SolarSystemBg";
import GridMotion from "./GridMotion";
import TextType from "./TextType";
import { profile, clients } from "@/lib/data";
import { personas, usePersona } from "@/lib/persona";
import { hash } from "@/lib/pseudoRandom";
import { PI_DIGITS } from "@/lib/piDigits";

const NAME_LINES = ["Aniket", "Bhattacharyea"];

// DevRel-persona hero background: a parallaxing grid mosaic instead of a
// stock photo — see GridMotion.tsx. Interleaved rather than logos-then-words
// so the texture doesn't read as two distinct blocks: company favicons (the
// same "companies I've helped" set Clients.tsx marquees lower on the page)
// alternating with the persona's own keyword list.
const GRID_LOGO_ITEMS = clients
  .filter((c) => c.domain)
  .map((c) => `https://www.google.com/s2/favicons?domain=${c.domain}&sz=128`);
const HERO_GRID_ITEMS: string[] = Array.from({ length: 28 }, (_, i) =>
  i % 2 === 0
    ? GRID_LOGO_ITEMS[(i / 2) % GRID_LOGO_ITEMS.length]
    : personas.devrel.keywords[((i - 1) / 2) % personas.devrel.keywords.length]
);

// Easter egg, math persona only: click the emphasized "precision" in the
// bio and it counts up pi's digits in its place, one more per click — a
// pun on the word itself. Wraps back to "precision" once it runs out of
// digits to show.
const MAX_PRECISION_CLICKS = PI_DIGITS.length + 1;

function precisionText(clicks: number): string {
  if (clicks <= 0) return "precision";
  const digits = Math.min(clicks - 1, PI_DIGITS.length);
  return digits === 0 ? "3" : `3.${PI_DIGITS.slice(0, digits)}`;
}

// Easter egg: click the name a few times in a row and it breaks apart —
// not advertised anywhere in the UI on purpose.
const BREAK_CLICKS = 5;
const BREAK_CLICK_WINDOW_MS = 2500;
const SHATTER_DURATION_S = 0.6;
const OUCH_HOLD_MS = 3000;

type NamePhase = "idle" | "shatter" | "ouch";

/** Same per-character fly-apart trick as PersonaTransition, but biased to
 * fall (positive dy) rather than scatter evenly — reads as "breaking and
 * falling apart" rather than an explosion. */
function ShatterName() {
  let i = 0;
  return NAME_LINES.map((line) => (
    <span key={line} className="block overflow-hidden pb-[0.12em]">
      <span className="block">
        {line.split("").map((ch) => {
          const seed = i++;
          const dx = (hash(seed * 3.1 + 1) - 0.5) * 260;
          const dy = 60 + hash(seed * 5.7 + 2) * 220;
          const rotate = (hash(seed * 7.3 + 3) - 0.5) * 220;
          return (
            <motion.span
              key={seed}
              className="inline-block"
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{ x: dx, y: dy, rotate, opacity: 0 }}
              transition={{ duration: SHATTER_DURATION_S, ease: [0.4, 0, 0.2, 1] }}
            >
              {ch}
            </motion.span>
          );
        })}
      </span>
    </span>
  ));
}

export default function Hero() {
  const { persona } = usePersona();
  const content = personas[persona];

  const [namePhase, setNamePhase] = useState<NamePhase>("idle");
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const [precisionClicks, setPrecisionClicks] = useState(0);
  function handlePrecisionClick() {
    setPrecisionClicks((c) => (c >= MAX_PRECISION_CLICKS ? 0 : c + 1));
  }
  // Reset on persona switch — Hero doesn't unmount when the persona flips,
  // so without this, switching to devrel and back to math would resume
  // straight into digits instead of starting over from "precision". Set
  // during render (React's documented pattern for adjusting state when a
  // prop changes: https://react.dev/reference/react/useState#storing-information-from-previous-renders),
  // not in an effect, to avoid an extra render/commit cycle for it.
  const [lastPersona, setLastPersona] = useState(persona);
  if (persona !== lastPersona) {
    setLastPersona(persona);
    if (persona !== "math") setPrecisionClicks(0);
  }

  useEffect(() => {
    if (namePhase === "shatter") {
      const t = setTimeout(() => setNamePhase("ouch"), SHATTER_DURATION_S * 1000);
      return () => clearTimeout(t);
    }
    if (namePhase === "ouch") {
      const t = setTimeout(() => setNamePhase("idle"), OUCH_HOLD_MS);
      return () => clearTimeout(t);
    }
  }, [namePhase]);

  function handleNameClick() {
    if (namePhase !== "idle") return; // ignore clicks mid-animation
    clickCountRef.current += 1;
    clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= BREAK_CLICKS) {
      clickCountRef.current = 0;
      setNamePhase("shatter");
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, BREAK_CLICK_WINDOW_MS);
  }

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-32 pb-8"
    >
      <div aria-hidden className="absolute inset-0 z-0">
        {persona === "math" ? (
          // Live solar-system diagram instead of a stock photo — see
          // SolarSystemBg.tsx. No duotone tint below (that's a photo-only
          // treatment); it's already minimal line art in the site palette.
          <SolarSystemBg className="absolute inset-0 h-full w-full" />
        ) : (
          // grayscale mutes the client-logo tiles' brand colors (full-
          // saturation blues/oranges/yellows fought the hero text badly
          // otherwise) down to the same tonal range as everything else in
          // the section — legibility then comes from GridMotion's own
          // radial gradient plus the two scrims below, same as the photo
          // this replaced, rather than an extra flat overlay on top of
          // those (which buried the grid entirely instead of just toning
          // it down).
          <GridMotion
            items={HERO_GRID_ITEMS}
            gradientColor="var(--bg)"
            className="absolute inset-0 grayscale"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/30 to-bg/80" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 z-[1] h-[520px] w-[520px] rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-muted"
        >
          {content.role} — {profile.location}
        </motion.p>
        <h1
          onClick={handleNameClick}
          // lg's 7.2vw has no ceiling tied to the max-w-7xl container below
          // it — past ~1280px viewport width the container's content area
          // freezes at ~1200px while 7.2vw keeps growing with the window,
          // so on a wide-enough monitor (2560px+; confirmed via measured
          // text width vs. container width, not just eyeballed) the name
          // outgrows its box and "Bhattacharyea" clips on the right edge.
          // clamp()'s max caps it at the container's real ceiling instead.
          className="select-none font-display text-[10vw] font-semibold leading-[0.9] tracking-tight sm:text-[9vw] lg:text-[clamp(0px,7.2vw,150px)]"
        >
          {namePhase === "idle" &&
            // Re-mounts (and so replays this slide-up reveal) every time
            // namePhase returns to "idle" — including right after the
            // break/"Ouch" easter egg, where it doubles as a "snapping back
            // into place" recovery animation for free.
            NAME_LINES.map((line, i) => (
              // pb here (not on the h1/motion.span) gives descenders like
              // the "y" in Bhattacharyea room inside this clip box, without
              // touching the reveal animation's own y:"100%" math below.
              <span key={line} className="block overflow-hidden pb-[0.12em]">
                <motion.span
                  className="block"
                  initial={{ y: "150%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 1 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          {namePhase === "shatter" && <ShatterName />}
          {namePhase === "ouch" && (
            <motion.div
              className="block text-accent flex flex-col justify-center gap-2 text-[0.6em] font-mono uppercase tracking-widest sm:text-[0.8em]"
              initial={{ scale: 0.4, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
            >
              <span>Ouch</span>
              <span>:(</span>
            </motion.div>

          )}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-8 max-w-xl text-lg text-muted sm:text-xl"
        >
          {content.heroBioBefore}
          <span
            className="select-none text-fg"
            onClick={persona === "math" ? handlePrecisionClick : undefined}
          >
            {persona === "math"
              ? precisionText(precisionClicks)
              : content.heroBioEmphasis}
          </span>
          {content.heroBioAfter}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticLink
            href="#work"
            className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 font-mono text-xs uppercase tracking-widest text-bg transition-colors hover:bg-accent"
          >
            See my work
          </MagneticLink>
          <MagneticLink
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Get in touch
          </MagneticLink>
        </motion.div>

        {persona === "math" && (
          // Hint that the background isn't a stock illustration — the dot
          // borrows the "recording" convention (small pulsing dot = live)
          // rather than spelling it out in a full sentence. Nested inside
          // this (relatively-positioned) content column rather than the
          // whole section, so bottom-0 lands right above the marquee band
          // below instead of guessing an offset that has to clear it.
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="pointer-events-none absolute bottom-0 right-6 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted sm:flex md:right-10"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Live planetary positions
          </motion.div>
        )}
      </div>

      <div className="relative mt-16 border-y border-line py-8">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 md:px-10">
          <span aria-hidden className="text-accent">
            ✦
          </span>
          {/* key={persona} forces a remount on persona switch — TextType
              keeps its own typing-progress state internally, so without this
              it'd resume mid-word into the new persona's keyword list rather
              than starting the reveal over. */}
          <TextType
            key={persona}
            as="span"
            text={content.keywords}
            typingSpeed={70}
            deletingSpeed={35}
            pauseDuration={1800}
            cursorCharacter="_"
            cursorClassName="text-accent"
            className="font-display text-2xl font-semibold text-fg sm:text-6xl"
          />
        </div>
      </div>
    </section>
  );
}
