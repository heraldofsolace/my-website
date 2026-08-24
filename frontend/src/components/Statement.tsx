"use client";

import { Reveal } from "./Reveal";
import { usePersona } from "@/lib/persona";

const COPY = {
  devrel: (
    <>
      I&apos;m a{" "}
      <span className="text-accent-soft">
        Software Developer and Developer Advocate
      </span>
      . I specialize in Full Stack Web Development using{" "}
      <span className="text-accent-soft">Next.js and Ruby on Rails</span>. I
      help companies produce technically solid content that resonates with
      developers.
    </>
  ),
  math: (
    <>
      I have an MSc. in <span className="text-accent-soft">Mathematics</span>,
      and I&apos;m currently studying M.Phys. in{" "}
      <span className="text-accent-soft">
        Astrophysics and Space Sciences
      </span>
      . I&apos;m an amateur{" "}
      <span className="text-accent-soft">Astrophotographer</span> and a
      member of the{" "}
      <span className="text-accent-soft">
        Sky Watchers&apos; Association, Kolkata
      </span>
      .
    </>
  ),
};

export default function Statement() {
  const { persona } = usePersona();

  return (
    <section className="flex min-h-[100svh] items-center border-t border-line px-6 py-24 md:px-10">
      <Reveal className="mx-auto max-w-6xl">
        <p className="font-display text-[7vw] font-medium leading-[1.15] tracking-tight text-fg sm:text-[5vw] lg:text-[3.6vw]">
          {COPY[persona]}
        </p>
      </Reveal>
    </section>
  );
}
