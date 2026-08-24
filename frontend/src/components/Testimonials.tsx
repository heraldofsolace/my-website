"use client";

import { Reveal } from "./Reveal";
import { usePersona } from "@/lib/persona";

type Testimonial = {
  quote: string;
  author: string;
  role?: string;
};

const COPY = {
  devrel: {
    label: "Testimonials",
    heading: "What clients say",
    items: [
      {
        quote:
          "I was delighted when Aniket was able to build what I asked for within my time frame and budget; I was absolutely stoked when he continued to improve the tool over three iterations as well as handle ongoing maintenance and patiently answer questions from my limited technical knowledge. I definitely plan to work with him again!",
        author: "Chris Wolfgang",
      },
    ] as Testimonial[],
  },
  math: {
    label: "Testimonials",
    heading: "What students say",
    items: [
      {
        quote: "Great teacher, with a great sense of humour.",
        author: "Student",
        role: "Sky Watchers' Association",
      },
    ] as Testimonial[],
  },
};

export default function Testimonials() {
  const { persona } = usePersona();
  const copy = COPY[persona];

  if (copy.items.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="border-t border-line px-6 py-28 md:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          {copy.label}
        </span>

        <h2 className="mt-6 max-w-2xl font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {copy.heading}
        </h2>

        <div className="mt-16 space-y-16">
          {copy.items.map((t, i) => (
            <Reveal key={`${t.author}-${i}`} delay={Math.min(i * 0.1, 0.3)}>
              <figure className="max-w-4xl border-t border-line pt-10">
                <blockquote>
                  <p className="font-display text-2xl font-medium leading-snug tracking-tight text-fg sm:text-3xl lg:text-4xl">
                    <span aria-hidden className="text-accent">
                      &ldquo;
                    </span>
                    {t.quote}
                    <span aria-hidden className="text-accent">
                      &rdquo;
                    </span>
                  </p>
                </blockquote>
                <figcaption className="mt-6 font-mono text-xs uppercase tracking-widest text-muted">
                  {t.author}
                  {t.role && <> · {t.role}</>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
