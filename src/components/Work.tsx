"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { work } from "@/lib/data";

export default function Work() {
  return (
    <section
      id="work"
      className="border-t border-line px-6 py-28 md:px-10"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left rail — scrolls into view, then sticks while the list scrolls past */}
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-32">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              Selected Work
            </span>
            <p className="mt-6 text-3xl leading-snug text-fg sm:text-4xl">
              &ldquo;I don&apos;t write about your product. I write the
              article a developer would actually bookmark.&rdquo;
            </p>
          </div>
        </div>

        {/* Right — the list, pushed right with a gap column between it and the quote */}
        <div className="lg:col-span-8 lg:col-start-5">
          <p className="max-w-sm text-sm text-muted">
            A sample of technical content written for developer tools
            companies — full archive on request.
          </p>

          <div className="mt-8 border-t border-line">
            {work.map((item, i) => (
              <Reveal key={item.index} delay={Math.min(i * 0.04, 0.3)}>
                <motion.a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hover
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  className="group relative grid grid-cols-[44px_1fr] items-center gap-4 overflow-hidden border-b border-line py-6 sm:grid-cols-[56px_1fr_140px_90px_32px] sm:gap-6"
                >
                  <motion.span
                    variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
                    transition={{ duration: 0.3 }}
                    className="pointer-events-none absolute inset-0 -z-10 bg-bg-soft"
                  />

                  <span className="font-mono text-sm text-muted">
                    {item.index}
                  </span>

                  <div className="min-w-0">
                    <motion.h3
                      variants={{ rest: { x: 0 }, hover: { x: 8 } }}
                      transition={{ type: "spring", stiffness: 300, damping: 26 }}
                      className="truncate font-display text-lg font-medium tracking-tight sm:text-xl"
                    >
                      {item.title}
                    </motion.h3>
                    <p className="mt-1 text-sm text-muted sm:hidden">
                      {item.client} · {item.date}
                    </p>
                  </div>

                  <span className="hidden font-mono text-sm text-muted sm:block">
                    {item.client}
                  </span>

                  <span className="hidden font-mono text-xs uppercase tracking-widest text-muted sm:block">
                    {item.type}
                  </span>

                  <motion.span
                    variants={{
                      rest: { x: 0, rotate: 0, opacity: 0.4 },
                      hover: { x: 4, rotate: 45, opacity: 1 },
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="hidden justify-self-end font-display text-2xl text-accent sm:block"
                  >
                    →
                  </motion.span>
                </motion.a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
