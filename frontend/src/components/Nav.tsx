"use client";

import Link from "next/link";
import { useState } from "react";
import { nav, profile } from "@/lib/data";
import { usePersona } from "@/lib/persona";
import { useActiveHash } from "@/lib/useActiveHash";
import PersonaToggle from "./PersonaToggle";
import StaggeredMenu, { type StaggeredMenuItem } from "./StaggeredMenu";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { persona } = usePersona();

  // A hardcoded "/#work" broke navigation on math — every link, including
  // the logo, jumped back to devrel instead of scrolling within the
  // current persona's own page. Prefix with whichever path is active, and
  // drop devrel-only items (Projects) rather than link to a section that
  // isn't there on math (Projects.tsx renders nothing there).
  const basePath = persona === "math" ? "/math" : "/";
  const items: StaggeredMenuItem[] = nav
    .filter((item) => !item.devrelOnly || persona === "devrel")
    .map((item) => {
      const label = persona === "math" && item.mathLabel ? item.mathLabel : item.label;
      return {
        label,
        ariaLabel: `Jump to the ${label} section`,
        href: `${basePath}#${item.hash}`,
        hash: item.hash,
      };
    });

  const activeHash = useActiveHash(
    items.map((item) => item.hash).filter((hash): hash is string => !!hash)
  );

  return (
    <StaggeredMenu
      open={open}
      onOpenChange={setOpen}
      items={items}
      activeHash={activeHash}
      socialItems={profile.socials}
      navControl={<PersonaToggle />}
      panelExtra={
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            {profile.availability}
          </span>
        </div>
      }
      logo={
        <Link
          href={basePath}
          data-cursor-hover
          className="font-display text-lg font-semibold tracking-tight text-fg"
        >
          {profile.initials}
          <span className="text-accent">.</span>
        </Link>
      }
    />
  );
}
