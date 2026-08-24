"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import AsciiField, { CHARS_SPACE } from "./AsciiField";
import type { ServiceData } from "@/lib/strapi";
import { usePersona } from "@/lib/persona";

type Row = {
  key: string;
  name: string;
  summary: string;
  price?: string;
  href?: string;
};

// TODO: placeholder — personalize the wording once you've settled on it.
const MATH_SERVICES: Row[] = [
  {
    key: "tuition",
    name: "Tuition",
    summary: "Mathematics tuition for school and college students.",
  },
  {
    key: "astronomy-training",
    name: "Astronomy Training",
    summary:
      "Astronomy training for school and college students as part of the Sky Watchers' Association, Kolkata.",
  },
  {
    key: "astrophotography",
    name: "Astrophotography",
    summary: "Amateur astrophotography.",
  },
];

function ServicePanel({
  row,
  index,
  N,
  isRed,
  persona,
}: {
  row: Row;
  index: string;
  N: number;
  isRed: boolean;
  persona: ReturnType<typeof usePersona>["persona"];
}) {
  return (
    <>
      {!isRed && (
        <>
          <AsciiField
            className="absolute inset-0 h-full w-full"
            chars={persona === "math" ? CHARS_SPACE : undefined}
          />
          {/* Scrim so the text block stays legible over the field */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/75 to-transparent" />
        </>
      )}

      <span
        aria-hidden
        className={`pointer-events-none absolute -right-[6vw] top-1/2 -translate-y-1/2 select-none font-display text-[42vw] font-semibold leading-none ${
          isRed ? "text-bg/10" : "text-bg-soft"
        }`}
      >
        {index}
      </span>

      <div className="relative mx-auto w-full max-w-3xl">
        <span
          className={`font-mono text-xs uppercase tracking-[0.3em] ${
            isRed ? "text-bg/70" : "text-accent"
          }`}
        >
          Services — {index}/{String(N).padStart(2, "0")}
        </span>
        {row.price && (
          <p
            className={`mt-4 font-mono text-sm ${
              isRed ? "text-bg/80" : "text-accent-soft"
            }`}
          >
            {row.price}
          </p>
        )}
        <h3
          className={`mt-4 font-display text-4xl font-medium tracking-tight sm:text-6xl lg:text-7xl ${
            isRed ? "text-bg" : "text-fg"
          }`}
        >
          {row.name}
        </h3>
        <p
          className={`mt-8 max-w-xl text-lg sm:text-xl ${
            isRed ? "text-bg/70" : "text-muted"
          }`}
        >
          {row.summary}
        </p>

        {row.href && (
          <Link
            href={row.href}
            data-cursor-hover
            className={`mt-10 inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors ${
              isRed
                ? "bg-bg text-fg hover:bg-black"
                : "bg-fg text-bg hover:bg-accent"
            }`}
          >
            Learn more
            <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </>
  );
}

function PageCounter({
  scrollYProgress,
  count,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  count: number;
}) {
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(count - 1, Math.round(v * (count - 1))));
  });

  return (
    <span className="font-mono text-xs tracking-widest text-muted">
      {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
    </span>
  );
}

export default function Services({ services }: { services: ServiceData[] }) {
  const { persona } = usePersona();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const rows: Row[] =
    persona === "devrel"
      ? services.map((s) => ({
          key: s.documentId,
          name: s.name,
          summary: s.summary,
          price: s.starting_price,
          href: `/services/${s.slug}`,
        }))
      : MATH_SERVICES;

  const N = rows.length;

  // Panels are each 100vw; the track needs to travel (N-1) full screens.
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${Math.max(N - 1, 0) * 100}vw`]);
  const barScale = useTransform(scrollYProgress, [0, 1], [1 / Math.max(N, 1), 1]);

  if (N === 0) return null;

  return (
    <section id="services" className="border-t border-line">
      {/* Mobile: a plain vertical stack — the horizontal scroll-hijack
          below doesn't translate well to touch scrolling. */}
      <div className="flex flex-col sm:hidden">
        {rows.map((row, i) => {
          const isRed = i % 2 === 1;
          const index = String(i + 1).padStart(2, "0");

          return (
            <div
              key={row.key}
              className={`relative flex min-h-[85svh] flex-col justify-center overflow-hidden px-6 py-20 ${
                isRed ? "bg-accent" : "bg-bg"
              }`}
            >
              <ServicePanel
                row={row}
                index={index}
                N={N}
                isRed={isRed}
                persona={persona}
              />
            </div>
          );
        })}
      </div>

      {/* Desktop/tablet: vertical scroll drives a horizontal panel track. */}
      <div
        ref={containerRef}
        className="relative hidden sm:block"
        style={{ height: `${N * 100}svh` }}
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div className="flex h-full" style={{ x }}>
            {rows.map((row, i) => {
              const isRed = i % 2 === 1;
              const index = String(i + 1).padStart(2, "0");

              return (
                <div
                  key={row.key}
                  className={`relative flex h-[100svh] w-screen shrink-0 flex-col justify-center overflow-hidden px-6 md:px-10 ${
                    isRed ? "bg-accent" : "bg-bg"
                  }`}
                >
                  <ServicePanel
                    row={row}
                    index={index}
                    N={N}
                    isRed={isRed}
                    persona={persona}
                  />
                </div>
              );
            })}
          </motion.div>

          <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center px-6">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-line/50 bg-bg/60 px-6 py-4 backdrop-blur">
              <PageCounter scrollYProgress={scrollYProgress} count={N} />
              <div className="h-px w-40 overflow-hidden bg-line">
                <motion.div
                  style={{ scaleX: barScale }}
                  className="h-full w-full origin-left bg-accent"
                />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                Keep scrolling
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
