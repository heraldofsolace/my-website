"use client";

import { useEffect, useState } from "react";

/** Scrollspy: which of the given element ids is currently crossing the
 * horizontal band through the middle of the viewport. Home-page-only in
 * practice — /blogs, /services/[slug] etc. don't have sections with these
 * ids, so `document.getElementById` finds nothing there and this just
 * stays null, which is the correct "nothing to highlight" state. */
export function useActiveHash(hashes: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  // hashes is rebuilt (new array identity) on every render of the caller —
  // depending on its contents rather than its identity keeps this effect
  // from tearing down and rebuilding its observer every render.
  const key = hashes.join(",");

  useEffect(() => {
    const elements = key
      .split(",")
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // A thin band through the vertical center of the viewport — whichever
    // section is crossing it counts as "current", the usual scrollspy trick.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
