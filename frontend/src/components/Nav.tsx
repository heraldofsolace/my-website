"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { nav, profile } from "@/lib/data";
import { usePersona } from "@/lib/persona";
import PersonaToggle from "./PersonaToggle";

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const { persona } = usePersona();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setSolid(latest > 40);
  });

  // A hardcoded "/#work" broke navigation on math — every link, including
  // the logo, jumped back to devrel instead of scrolling within the
  // current persona's own page. Prefix with whichever path is active, and
  // drop devrel-only items (Projects) rather than link to a section that
  // isn't there on math (Projects.tsx renders nothing there).
  const basePath = persona === "math" ? "/math" : "/";
  const items = nav
    .filter((item) => !item.devrelOnly || persona === "devrel")
    .map((item) => ({
      ...item,
      label: persona === "math" && item.mathLabel ? item.mathLabel : item.label,
      href: `${basePath}#${item.hash}`,
    }));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-bg/80 backdrop-blur-md border-b border-line" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Link
          href={basePath}
          data-cursor-hover
          className="font-display text-lg font-semibold tracking-tight"
        >
          {profile.initials}
          <span className="text-accent">.</span>
        </Link>

        <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-widest text-muted md:flex">
          {items.map((item) => (
            <Link
              key={item.hash}
              href={item.href}
              data-cursor-hover
              className="transition-colors hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              {profile.availability}
            </span>
          </div>
          <PersonaToggle />
        </div>

        <button
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
            className="h-px w-6 bg-fg"
          />
          <motion.span
            animate={{ opacity: open ? 0 : 1 }}
            className="h-px w-6 bg-fg"
          />
          <motion.span
            animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
            className="h-px w-6 bg-fg"
          />
        </button>
      </div>

      <motion.div
        id="mobile-nav"
        initial={false}
        animate={{ height: open ? "auto" : 0 }}
        className="overflow-hidden md:hidden"
      >
        <nav className="flex flex-col gap-1 border-t border-line bg-bg px-6 py-4 font-mono text-sm uppercase tracking-widest text-muted">
          {items.map((item) => (
            <Link
              key={item.hash}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-2"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2">
            <PersonaToggle />
          </div>
        </nav>
      </motion.div>
    </header>
  );
}
