"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import type { BlogPortfolioData } from "@/lib/strapi";
import { papers, usePersona } from "@/lib/persona";

type Row = {
  key: string;
  title: string;
  meta: string; // client (devrel) or venue (math)
  tag: string; // category (devrel) or year (math)
  href: string;
};

const COPY = {
  devrel: {
    label: "Selected Work",
    quote:
      "“I don’t write about your product. I write the article a developer would actually bookmark.”",
    subhead: "Technical content written for developer tools companies.",
  },
  math: {
    label: "Published Papers",
    // TODO: placeholder — personalize once the papers list below is real.
    quote: "“Mathematics is the language the universe is written in.”",
    subhead: "Peer-reviewed work in number theory and related fields.",
  },
};

export default function Work({ items }: { items: BlogPortfolioData[] }) {
  const { persona } = usePersona();
  const copy = COPY[persona];

  const rows: Row[] =
    persona === "devrel"
      ? items.map((item) => ({
          key: item.documentId,
          title: item.title,
          meta: item.client,
          tag: item.article_categories?.[0]?.name ?? "Article",
          href: item.link,
        }))
      : papers.map((paper) => ({
          key: paper.title,
          title: paper.title,
          meta: paper.venue,
          tag: paper.year,
          href: paper.href,
        }));

  if (rows.length === 0) return null;

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
              {copy.label}
            </span>
            <p className="mt-6 text-3xl leading-snug text-fg sm:text-4xl">
              {copy.quote}
            </p>
          </div>
        </div>

        {/* Right — the list, pushed right with a gap column between it and the quote */}
        <div className="lg:col-span-8 lg:col-start-5">
          <p className="max-w-sm text-sm text-muted">{copy.subhead}</p>

          <div className="mt-8 border-t border-line">
            {rows.map((row, i) => {
              const index = String(i + 1).padStart(2, "0");

              return (
                <Reveal key={row.key} delay={Math.min(i * 0.04, 0.3)}>
                  <motion.a
                    href={row.href}
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
                      {index}
                    </span>

                    <div className="min-w-0">
                      <motion.h3
                        variants={{ rest: { x: 0 }, hover: { x: 8 } }}
                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                        className="truncate font-display text-lg font-medium tracking-tight sm:text-xl"
                      >
                        {row.title}
                      </motion.h3>
                      <p className="mt-1 text-sm text-muted sm:hidden">
                        {row.meta} · {row.tag}
                      </p>
                    </div>

                    <span className="hidden font-mono text-sm text-muted sm:block">
                      {row.meta}
                    </span>

                    <span className="hidden font-mono text-xs uppercase tracking-widest text-muted sm:block">
                      {row.tag}
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
