"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { clients, teachingPlaces, type Client } from "@/lib/data";
import { usePersona } from "@/lib/persona";
import InfiniteSpiral, { type InfiniteSpiralItem } from "./InfiniteSpiral";

function ClientBadge({ name, domain }: Client) {
  const [failed, setFailed] = useState(false);
  const showInitials = failed || !domain;

  return (
    <div className="group flex shrink-0 items-center gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-fg/90 opacity-60 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0 sm:h-16 sm:w-16">
        {showInitials ? (
          <span className="font-display text-xs font-semibold text-bg">
            {name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 3)}
          </span>
        ) : (
          // Google's favicon service — small icon badges, but the only
          // source with universal coverage across every client here (logo
          // APIs like Clearbit's are no longer reachable).
          <Image
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
            alt={name}
            width={128}
            height={128}
            unoptimized
            onError={() => setFailed(true)}
            className="h-7 w-7 object-contain sm:h-8 sm:w-8"
          />
        )}
      </div>
      <span className="font-display text-2xl font-medium text-muted transition-colors group-hover:text-fg sm:text-3xl">
        {name}
      </span>
    </div>
  );
}

/** Math persona only now — devrel's "Companies I've helped" moved to
 * CompanySpiral below. A handful of teaching venues reads fine as a
 * marquee; it doesn't need the spiral treatment. */
function TeachingMarquee() {
  return (
    <section className="border-t border-line py-16">
      <p className="mx-auto mb-10 max-w-7xl px-6 font-mono text-xs uppercase tracking-[0.3em] text-accent md:px-10">
        Where I&apos;ve taught
      </p>

      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent"
        />

        <div className="animate-marquee flex w-max items-center gap-12 whitespace-nowrap">
          {[...teachingPlaces, ...teachingPlaces].map((place, i) => (
            <ClientBadge key={`${place.name}-${i}`} {...place} />
          ))}
        </div>
      </div>
    </section>
  );
}

const SPIRAL_ITEMS: InfiniteSpiralItem[] = clients
  .filter((c): c is Client & { domain: string } => !!c.domain)
  .map((c) => ({
    src: `https://www.google.com/s2/favicons?domain=${c.domain}&sz=128`,
    alt: c.name,
    label: c.name,
  }));

/** Devrel's "Companies I've helped": a slow InfiniteSpiral of client logos
 * on the right, with whichever one is currently front-and-center named in
 * text on the left — InfiniteSpiral's onActiveChange (added in the port,
 * not upstream) is what makes that possible. */
function CompanySpiral() {
  const [active, setActive] = useState(SPIRAL_ITEMS[0]?.label ?? "");

  return (
    <section className="border-t border-line py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:items-center md:gap-16 md:px-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            Companies I&apos;ve helped
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-6 font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl"
            >
              {active}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="relative h-[360px] sm:h-[440px]">
          <InfiniteSpiral
            items={SPIRAL_ITEMS}
            animationMode="auto"
            // Slow enough to still read as "a name changing every few
            // seconds" rather than a spinning gallery, but 0.06 turned out
            // to be too slow in practice.
            speed={0.14}
            radius={130}
            cardWidth={92}
            cardHeight={92}
            verticalSpacing={54}
            cardsPerTurn={7}
            imageFit="contain"
            grayscale={1}
            pauseOnHover
            onActiveChange={(item) => setActive(item.label ?? item.alt)}
          />
        </div>
      </div>
    </section>
  );
}

export default function Clients() {
  const { persona } = usePersona();
  return persona === "math" ? <TeachingMarquee /> : <CompanySpiral />;
}
