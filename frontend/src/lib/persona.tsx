"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import PersonaTransition from "@/components/PersonaTransition";
import { personas, type PersonaId } from "@/lib/personaData";

// Re-exported so existing `import { personas, type PersonaId } from
// "@/lib/persona"` call sites (most components) don't need to change —
// only server-side files that need this data at module-eval time (route
// metadata, JSON-LD, opengraph-image) should import from personaData.ts
// directly instead.
export { personas, type PersonaId, type PersonaContent, type PaperItem, papers } from "@/lib/personaData";

const PersonaContext = createContext<{
  persona: PersonaId;
  requestSwitch: () => void;
} | null>(null);

/** Wraps the app; holds which persona is active. Not persisted across
 * reloads on purpose — every visit starts on whichever persona its URL
 * represents (devrel at "/", math at "/math" — see app/math/page.tsx,
 * which exists so that persona is actually indexable rather than only
 * reachable by a client-side toggle). Switching plays a fullscreen
 * transition (see PersonaTransition) rather than swapping content
 * instantly — the actual persona flip (and the URL update that keeps it
 * in sync with "/" vs "/math") happens partway through it, hidden behind
 * the overlay. */
export function PersonaProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [persona, setPersona] = useState<PersonaId>(() =>
    pathname === "/math" ? "math" : "devrel"
  );
  const [transitioning, setTransitioning] = useState(false);

  // Mirrors `persona` without handleSwap needing it as a dependency.
  // PersonaTransition stays mounted for the whole transition and re-runs
  // its timer-scheduling effect whenever onSwap's identity changes — so a
  // handleSwap that changed identity every time persona changed (e.g. via
  // a `[persona, router]` dependency array) would re-trigger that effect
  // right after firing, calling itself again and flipping persona back and
  // forth forever. Keeping handleSwap referentially stable avoids that.
  const personaRef = useRef(persona);
  useEffect(() => {
    personaRef.current = persona;
  }, [persona]);

  const requestSwitch = useCallback(() => {
    setTransitioning(true);
  }, []);

  const handleSwap = useCallback(() => {
    // Plain (non-functional) setState + router.replace as sibling calls,
    // not one nested inside the other — router.replace triggers its own
    // setState internally, and React can invoke a functional updater during
    // render, which doesn't allow triggering another component's setState
    // from inside it ("Cannot update a component while rendering a
    // different component").
    const next: PersonaId = personaRef.current === "devrel" ? "math" : "devrel";
    setPersona(next);
    // No scroll reset — this should feel like a same-page toggle, not a
    // navigation, even though it is one under the hood. replace (not push)
    // so repeated toggling doesn't pile up browser-history entries.
    router.replace(next === "math" ? "/math" : "/", { scroll: false });
  }, [router]);

  const handleDone = useCallback(() => {
    setTransitioning(false);
  }, []);

  // Keep the tab title in sync — layout.tsx's metadata.title covers the
  // initial (devrel) load and search-engine crawls; this only fires after
  // a client-side switch.
  useEffect(() => {
    document.title = personas[persona].title;
  }, [persona]);

  return (
    <PersonaContext.Provider value={{ persona, requestSwitch }}>
      {children}
      {transitioning && (
        <PersonaTransition onSwap={handleSwap} onDone={handleDone} />
      )}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error("usePersona must be used within PersonaProvider");
  return ctx;
}
