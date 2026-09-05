"use client";

import { useState } from "react";
import Image from "next/image";
import { clients, teachingPlaces, stats, type Client } from "@/lib/data";
import { usePersona } from "@/lib/persona";
import { Reveal } from "./Reveal";
import Counter from "./Counter";
import DriftWall, { type DriftWallItem } from "./DriftWall";

// Same figure About.tsx's stat grid shows under "Clients served" — pulled
// from the one shared array rather than re-counting DRIFT_ITEMS below, so
// the two sections can't quietly disagree with each other.
const CLIENTS_STAT = stats.find((s) => s.label === "Clients served");

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

const DRIFT_ITEMS: DriftWallItem[] = clients
  .filter((c): c is Client & { domain: string } => !!c.domain)
  .map((c) => ({
    image: `https://www.google.com/s2/favicons?domain=${c.domain}&sz=128`,
    title: c.name,
  }));

/** Devrel's "Companies I've helped": fullscreen, the headline stat on the
 * left and a wall of client logos drifting upward on the right — each one
 * grayscale at rest, revealing its name and full color on hover/focus
 * (DriftWall's own `.is-active` state, see the port's added caption). No
 * section label; the stat itself is the header here. */
function CompanyDriftWall() {
  return (
    <section className="relative flex min-h-[100svh] items-center border-t border-line py-20">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-10">
        <Reveal>
          {CLIENTS_STAT && (
            <p className="font-display text-8xl font-semibold tracking-tight text-fg sm:text-9xl">
              <Counter value={CLIENTS_STAT.value} suffix={CLIENTS_STAT.suffix} />
            </p>
          )}
          <p className="mt-6 max-w-xs font-mono text-sm uppercase tracking-[0.3em] text-muted">
            Companies helped build trust with developers
          </p>
        </Reveal>

        <div className="relative h-[360px] md:h-[70vh]">
          <DriftWall
            items={DRIFT_ITEMS}
            columns={6}
            tileWidth={140}
            tileHeight={140}
            gap={16}
            radius={16}
            tilt={14}
            turn={-10}
            perspective={1400}
            depth={100}
            speed={26}
            variance={0.4}
            parallax={0.4}
            lift={40}
            fade={0.55}
            dim={0.5}
            grayscale
            overlayColor="var(--bg)"
          />
        </div>
      </div>
    </section>
  );
}

export default function Clients() {
  const { persona } = usePersona();
  return persona === "math" ? <TeachingMarquee /> : <CompanyDriftWall />;
}
