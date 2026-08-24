"use client";

import { Reveal } from "./Reveal";
import { usePersona } from "@/lib/persona";

const CONTENT = {
  devrel: {
    label: "Experience",
    heading: "Where I've worked",
    items: [
      { time: "2021", title: "Developer Advocate", place: "Draft.dev" },
      { time: "2020", title: "Freelancer", place: "Various clients" },
      { time: "2018", title: "Web Developer", place: "DataSutram" },
    ],
  },
  math: {
    label: "Education",
    heading: "Where I've studied",
    items: [
      {
        time: "2023",
        title: "M.Phys. Astrophysics",
        place: "The Open University (UK)",
      },
      { time: "2020", title: "M.Sc. Mathematics", place: "RKMVERI" },
      {
        time: "2017",
        title: "B.Sc. Mathematics",
        place: "St. Xavier's College, Kolkata",
      },
    ],
  },
};

export default function Experience() {
  const { persona } = usePersona();
  const content = CONTENT[persona];

  return (
    <section
      id="experience"
      className="border-t border-line px-6 py-28 md:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          {content.label}
        </span>

        <h2 className="mt-6 max-w-2xl font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {content.heading}
        </h2>

        <div className="mt-16 border-t border-line">
          {content.items.map((item, i) => (
            <Reveal
              key={`${item.time}-${item.title}`}
              delay={Math.min(i * 0.06, 0.3)}
            >
              <div className="grid grid-cols-1 gap-3 border-b border-line py-10 sm:grid-cols-[minmax(0,200px)_1fr] sm:items-baseline sm:gap-8">
                <span className="font-display text-5xl font-semibold tracking-tight text-muted sm:text-6xl lg:text-7xl">
                  {item.time}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-medium tracking-tight text-fg sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-mono text-sm uppercase tracking-widest text-accent-soft">
                    @ {item.place}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
