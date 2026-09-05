"use client";

// Adapted from React Bits' StaggeredMenu (https://reactbits.dev). Upstream
// choreographs the reveal as one big hand-built gsap.timeline (prelayers,
// then panel, then item stagger, then socials, each at a hand-computed
// insert time) plus a separate cycling-text and icon-morph animation driven
// by their own gsap tweens. Same call as every other React Bits port in
// this codebase (TextType, GridMotion): framer-motion is the site's one
// animation library, and it already has a declarative way to express
// exactly this shape of animation — parent/child `variants` with
// `staggerChildren` — so the whole sequence is expressed that way instead
// of a second engine's imperative timeline.
//
// Deliberately dropped from upstream: the multi-cycle "Menu → Close →
// Menu → Close" text scramble (nice flourish, not a feature — a plain
// crossfade says the same thing), the CSS-custom-property trick for
// animating a `::after`-generated item number (there's no reason the
// number can't just be a real element and animate normally), and the
// menuButtonColor/openMenuButtonColor/changeMenuColorOnOpen color-tweening
// (this site's panel is dark in both states, so the toggle button never
// needs to change color). `colors`/`logoUrl` also don't fit a site with no
// logo image and its own fixed palette — swapped for a `logo` ReactNode
// and hardcoded theme colors (`text-accent`, `bg-bg-soft`, etc., same
// tokens every other component here uses) instead of configurable ones.
import { AnimatePresence, motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  href: string;
}

export interface StaggeredMenuSocialItem {
  label: string;
  href: string;
}

interface StaggeredMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  position?: "left" | "right";
  logo?: ReactNode;
  closeOnClickAway?: boolean;
  /** Rendered in the panel below the nav items, above the socials — this
   * site's PersonaToggle + availability badge don't exist upstream, and a
   * fixed slot here beats forcing them into `items` as fake links. */
  panelExtra?: ReactNode;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const layerVariants: Variants = {
  hidden: (position: "left" | "right") => ({ x: position === "left" ? "-100%" : "100%" }),
  visible: { x: "0%", transition: { duration: 0.5, ease: EASE } },
};

const panelVariants: Variants = {
  hidden: (position: "left" | "right") => ({ x: position === "left" ? "-100%" : "100%" }),
  visible: {
    x: "0%",
    transition: { duration: 0.6, ease: EASE, delay: 0.15 },
  },
};

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.45 } },
};

const itemVariants: Variants = {
  hidden: { y: "140%", rotate: 10, opacity: 0 },
  visible: { y: "0%", rotate: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
};

const numberVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, delay: 0.15 } },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, delay: 0.55 } },
};

const socialListVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.7 } },
};

const socialItemVariants: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: EASE } },
};

export default function StaggeredMenu({
  open,
  onOpenChange,
  items,
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  position = "right",
  logo,
  closeOnClickAway = true,
  panelExtra,
}: StaggeredMenuProps) {
  const panelRef = useRef<HTMLElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  const close = () => onOpenChange(false);

  // The panel stays mounted off-screen (transform only, so it can slide
  // back in) rather than unmounting — without this, its links would still
  // sit in the tab order and stay mouse-clickable while invisible.
  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !open;
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    function handleClickAway(e: MouseEvent) {
      if (!closeOnClickAway) return;
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (toggleBtnRef.current?.contains(target)) return;
      close();
    }

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickAway);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickAway);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closeOnClickAway]);

  const panelSide = position === "left" ? "left-0" : "right-0";

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
        <div className="pointer-events-auto">{logo}</div>
        <button
          ref={toggleBtnRef}
          type="button"
          onClick={() => onOpenChange(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          data-cursor-hover
          className="pointer-events-auto flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-fg"
        >
          <span className="relative h-[1em] w-12 overflow-hidden text-right">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={open ? "close" : "menu"}
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.3, ease: EASE }}
                className="block"
              >
                {open ? "Close" : "Menu"}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
            <motion.span
              animate={{ rotate: open ? 45 : 0, y: open ? 0 : -3 }}
              className="absolute h-px w-3.5 bg-fg"
            />
            <motion.span
              animate={{ opacity: open ? 0 : 1 }}
              className="absolute h-px w-3.5 bg-fg"
            />
            <motion.span
              animate={{ rotate: open ? -45 : 0, y: open ? 0 : 3 }}
              className="absolute h-px w-3.5 bg-fg"
            />
          </span>
        </button>
      </header>

      {/* Underlay layers — a quick two-tone color sweep that reveals just
          ahead of the actual panel, rather than the panel simply appearing. */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-y-0 ${panelSide} z-40 w-full sm:w-[420px]`}
      >
        {(["var(--bg-soft)", "var(--accent)"] as const).map((color, i) => (
          <motion.div
            key={color}
            custom={position}
            variants={layerVariants}
            initial="hidden"
            animate={open ? "visible" : "hidden"}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
            className="absolute inset-0"
            style={{ background: color }}
          />
        ))}
      </div>

      <motion.aside
        id="staggered-menu-panel"
        ref={panelRef}
        custom={position}
        variants={panelVariants}
        initial="hidden"
        animate={open ? "visible" : "hidden"}
        aria-hidden={!open}
        className={`fixed inset-y-0 ${panelSide} z-40 flex h-full w-full flex-col overflow-y-auto border-line bg-bg p-8 pt-28 sm:w-[420px] sm:p-10 sm:pt-32 ${
          position === "left" ? "border-r" : "border-l"
        } ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <motion.ul
          variants={listVariants}
          initial="hidden"
          animate={open ? "visible" : "hidden"}
          className="flex flex-col gap-1"
        >
          {items.map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <motion.div variants={itemVariants}>
                <Link
                  href={item.href}
                  aria-label={item.ariaLabel}
                  onClick={close}
                  data-cursor-hover
                  className="group flex items-baseline justify-between py-2 font-display text-4xl font-semibold uppercase tracking-tight text-fg transition-colors hover:text-accent sm:text-5xl"
                >
                  {item.label}
                  {displayItemNumbering && (
                    <motion.span
                      variants={numberVariants}
                      className="font-mono text-sm tracking-widest text-accent"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            </li>
          ))}
        </motion.ul>

        {panelExtra && (
          <motion.div variants={fadeInVariants} initial="hidden" animate={open ? "visible" : "hidden"} className="mt-10">
            {/* framer-motion's bundled types don't like an arbitrary
                consumer ReactNode as a motion element's direct children
                (see TextType.tsx's cursorCharacter for the same mismatch) —
                a plain wrapper div sidesteps it. */}
            <div>{panelExtra}</div>
          </motion.div>
        )}

        {displaySocials && socialItems.length > 0 && (
          <div className="mt-auto pt-10">
            <motion.h3
              variants={fadeInVariants}
              initial="hidden"
              animate={open ? "visible" : "hidden"}
              className="font-mono text-xs uppercase tracking-[0.3em] text-accent"
            >
              Elsewhere
            </motion.h3>
            <motion.ul
              variants={socialListVariants}
              initial="hidden"
              animate={open ? "visible" : "hidden"}
              className="mt-4 flex flex-row flex-wrap items-center gap-5"
            >
              {socialItems.map((social) => (
                <motion.li key={social.href} variants={socialItemVariants}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-hover
                    className="font-mono text-sm uppercase tracking-widest text-muted transition-colors hover:text-fg"
                  >
                    {social.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        )}
      </motion.aside>
    </>
  );
}
