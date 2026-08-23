"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import AsciiField from "./AsciiField";
import { services } from "@/lib/data";

const N = services.length;

function PageCounter({
  scrollYProgress,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(N - 1, Math.round(v * (N - 1))));
  });

  return (
    <span className="font-mono text-xs tracking-widest text-muted">
      {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
    </span>
  );
}

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Panels are each 100vw; the track needs to travel (N-1) full screens.
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(N - 1) * 100}vw`]);
  const barScale = useTransform(scrollYProgress, [0, 1], [1 / N, 1]);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative border-t border-line"
      style={{ height: `${N * 100}svh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="flex h-full" style={{ x }}>
          {services.map((service, i) => {
            const isRed = i % 2 === 1;

            return (
              <div
                key={service.index}
                className={`relative flex h-[100svh] w-screen shrink-0 flex-col justify-center overflow-hidden px-6 md:px-10 ${
                  isRed ? "bg-accent" : "bg-bg"
                }`}
              >
                {!isRed && (
                  <>
                    <AsciiField className="absolute inset-0 h-full w-full" />
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
                  {service.index}
                </span>

                <div className="relative mx-auto w-full max-w-3xl">
                  <span
                    className={`font-mono text-xs uppercase tracking-[0.3em] ${
                      isRed ? "text-bg/70" : "text-accent"
                    }`}
                  >
                    Services — {service.index}/{String(N).padStart(2, "0")}
                  </span>
                  <p
                    className={`mt-4 font-mono text-sm ${
                      isRed ? "text-bg/80" : "text-accent-soft"
                    }`}
                  >
                    {service.price}
                  </p>
                  <h3
                    className={`mt-4 font-display text-4xl font-medium tracking-tight sm:text-6xl lg:text-7xl ${
                      isRed ? "text-bg" : "text-fg"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`mt-8 max-w-xl text-lg sm:text-xl ${
                      isRed ? "text-bg/70" : "text-muted"
                    }`}
                  >
                    {service.description}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-widest ${
                          isRed
                            ? "border-bg/30 text-bg/80"
                            : "border-line text-muted"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/services/${service.slug}`}
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
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center px-6">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-line/50 bg-bg/60 px-6 py-4 backdrop-blur">
            <PageCounter scrollYProgress={scrollYProgress} />
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
    </section>
  );
}
