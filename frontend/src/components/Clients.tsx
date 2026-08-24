"use client";

import { useState } from "react";
import Image from "next/image";
import { clients, teachingPlaces, type Client } from "@/lib/data";
import { usePersona } from "@/lib/persona";

const COPY = {
  devrel: { label: "Companies I've helped", items: clients },
  math: { label: "Where I've taught", items: teachingPlaces },
};

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

export default function Clients() {
  const { persona } = usePersona();
  const copy = COPY[persona];

  return (
    <section className="border-t border-line py-16">
      <p className="mx-auto mb-10 max-w-7xl px-6 font-mono text-xs uppercase tracking-[0.3em] text-accent md:px-10">
        {copy.label}
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

        <div key={persona} className="animate-marquee flex w-max items-center gap-12 whitespace-nowrap">
          {[...copy.items, ...copy.items].map((client, i) => (
            <ClientBadge key={`${client.name}-${i}`} {...client} />
          ))}
        </div>
      </div>
    </section>
  );
}
