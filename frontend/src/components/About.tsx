"use client";

import { Reveal, RevealWords } from "./Reveal";
import Counter from "./Counter";
import { stats } from "@/lib/data";
import { usePersona } from "@/lib/persona";

const MATH_STATS = [
  { value: 5, suffix: "", label: "Years Studying Mathematics" },
  { value: 3, suffix: "+", label: "Years in Astrophysics" },
  { value: 2, suffix: "", label: "Papers Published" },
];

const COPY = {
  devrel: {
    headlineLead: "Reach your developer audience with",
    headlineEmphasis: "confidence.",
    body: (
      <>
        Speaking to developers isn&apos;t easy — they value quality over
        buzzwords and can see right through marketing speak. I bridge that
        gap: five years as a developer, three years in developer relations,
        and a habit of shipping content that reads like it was written by
        someone who&apos;s actually shipped code.
      </>
    ),
  },
  math: {
    headlineLead: "Where proof meets",
    headlineEmphasis: "wonder.",
    body: (
      <>
        I chase the same feeling in a chalkboard and a telescope eyepiece —
        that instant when scattered facts snap into a pattern you can see.
        Mathematics trained me to sit with a problem until it gives way;
        astronomy gave me somewhere to point that patience. Every clear night
        with the Sky Watchers&apos; Association is a reminder that the
        universe rewards attention — the longer you look, the more it shows
        you.
      </>
    ),
  },
};

export default function About() {
  const { persona } = usePersona();
  const copy = COPY[persona];
  const rows = persona === "devrel" ? stats : MATH_STATS;

  return (
    <section
      id="about"
      className="border-t border-line px-6 py-28 md:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          About
        </span>

        <h2
          key={persona}
          className="mt-6 max-w-4xl font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
        >
          <RevealWords text={copy.headlineLead} />{" "}
          <span className="text-accent-soft">
            <RevealWords text={copy.headlineEmphasis} delay={0.3} />
          </span>
        </h2>

        <Reveal key={`${persona}-body`} delay={0.15}>
          <p className="mt-8 max-w-2xl text-lg text-muted">{copy.body}</p>
        </Reveal>

        <div
          className={`mt-20 grid gap-x-8 gap-y-12 border-t border-line pt-12 ${
            rows.length === 4
              ? "grid-cols-2 md:grid-cols-4"
              : rows.length === 3
                ? "grid-cols-2 sm:grid-cols-3"
                : "grid-cols-2"
          }`}
        >
          {rows.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <p className="font-display text-5xl font-semibold tracking-tight text-fg sm:text-6xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
