"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import MagneticLink from "./MagneticLink";
import { profile } from "@/lib/data";
import { personas, usePersona } from "@/lib/persona";

export default function Hero() {
  const { persona } = usePersona();
  const content = personas[persona];

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-32 pb-8"
    >
      <div aria-hidden className="absolute inset-0 z-0">
        <Image
          key={persona}
          src={persona === "math" ? "/hero2.jpg" : "/hero.jpg"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center grayscale"
        />
        {/* Duotone tint + scrim so the photo reads as atmosphere, not a
            literal stock shot fighting the type for contrast. */}
        <div
          className="absolute inset-0 mix-blend-color"
          style={{ backgroundColor: "var(--bg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/30 to-bg/80" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 z-[1] h-[520px] w-[520px] rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-muted"
        >
          {content.role} — {profile.location}
        </motion.p>

        <p className="overflow-hidden text-2xl text-accent-soft sm:text-3xl">
          <motion.span
            className="block"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            I am
          </motion.span>
        </p>

        <h1 className="font-display text-[10vw] font-semibold leading-[0.9] tracking-tight sm:text-[9vw] lg:text-[7.2vw]">
          {["Aniket", "Bhattacharyea"].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.2 + i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-8 max-w-xl text-lg text-muted sm:text-xl"
        >
          {content.heroBioBefore}
          <span className="text-fg">{content.heroBioEmphasis}</span>
          {content.heroBioAfter}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticLink
            href="#work"
            className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 font-mono text-xs uppercase tracking-widest text-bg transition-colors hover:bg-accent"
          >
            See my work
          </MagneticLink>
          <MagneticLink
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Get in touch
          </MagneticLink>
        </motion.div>
      </div>

      <div className="relative mt-16 border-y border-line py-5 bg-red-500">
        <div className="animate-marquee flex w-max gap-5 whitespace-nowrap font-display text-2xl text-white sm:text-7xl ">
          {[...content.keywords, ...content.keywords].map((word, i) => (
            <span key={i} className="flex items-center gap-5">
              {word}
              <span className="text-white/50">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
