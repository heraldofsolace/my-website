"use client";

import AsciiField, { CHARS_SPACE } from "./AsciiField";
import { usePersona } from "@/lib/persona";

const COPY = {
  devrel: {
    label: "Signal in the noise",
    lineOne: "Content that",
    lineTwo: "compiles.",
  },
  math: {
    label: "Signal in the noise",
    lineOne: "Light from the",
    lineTwo: "past.",
  },
};

export default function AsciiArt() {
  const { persona } = usePersona();
  const copy = COPY[persona];

  return (
    <section className="relative h-[100svh] w-full overflow-hidden border-t border-line bg-bg">
      <AsciiField
        clearCenter
        className="absolute inset-0 h-full w-full"
        chars={persona === "math" ? CHARS_SPACE : undefined}
      />

      <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-center px-6 sm:top-28">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          {copy.label}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <h2 className="font-display text-center text-[12vw] font-semibold leading-[0.95] tracking-tight text-fg sm:text-[7vw] lg:text-[5.5vw]">
          {copy.lineOne}
          <br />
          <span className="text-accent-soft">{copy.lineTwo}</span>
        </h2>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center px-6">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted sm:hidden">
          
        </span>
        <span className="hidden font-mono text-xs uppercase tracking-[0.3em] text-muted sm:inline">
          Move your cursor
        </span>
      </div>
    </section>
  );
}
