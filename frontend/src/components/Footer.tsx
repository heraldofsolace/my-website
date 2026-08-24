"use client";

import MagneticLink from "./MagneticLink";
import Clock from "./Clock";
import { Reveal, SweepReveal } from "./Reveal";
import { profile } from "@/lib/data";
import { usePersona } from "@/lib/persona";

const COPY = {
  devrel: {
    headingBefore: "Let's make your ",
    headingEmphasis: "developer story",
    headingAfter: " worth reading.",
  },
  math: {
    headingBefore: "Wanna talk ",
    headingEmphasis: "maths or space",
    headingAfter: "?",
  },
};

export default function Footer() {
  const { persona } = usePersona();
  const copy = COPY[persona];

  return (
    <footer
      id="contact"
      className="border-t border-line px-6 py-28 md:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Contact
        </span>

        <SweepReveal key={persona} className="mt-6 max-w-3xl" delay={0.05}>
          <h2 className="font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {copy.headingBefore}
            <span className="text-accent-soft">{copy.headingEmphasis}</span>
            {copy.headingAfter}
          </h2>
        </SweepReveal>

        <Reveal delay={0.15}>
          <MagneticLink
            href={`mailto:${profile.email}`}
            className="group mt-12 inline-block break-all font-display text-2xl font-medium tracking-tight text-fg transition-colors hover:text-accent sm:text-4xl"
          >
            {profile.email}
            <span className="ml-3 inline-block transition-transform group-hover:translate-x-2">
              ↗
            </span>
          </MagneticLink>
        </Reveal>

        <div className="mt-20 grid grid-cols-2 gap-8 border-t border-line pt-10 font-mono text-xs uppercase tracking-widest text-muted sm:grid-cols-4">
          <div>
            <p className="text-fg/60">Based in</p>
            <p className="mt-2 text-fg">{profile.location}</p>
          </div>
          <div>
            <p className="text-fg/60">Local time</p>
            <p className="mt-2 text-fg">
              <Clock /> {profile.timezone}
            </p>
          </div>
          {profile.socials.map((social) => (
            <div key={social.href}>
              <p className="text-fg/60">{social.label}</p>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="mt-2 block text-fg transition-colors hover:text-accent"
              >
                Visit ↗
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-widest text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p>Built with Next.js, Tailwind &amp; Framer Motion.</p>
        </div>
      </div>
    </footer>
  );
}
