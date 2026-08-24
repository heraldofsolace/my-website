"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import PersonaTransition from "@/components/PersonaTransition";

export type PersonaId = "devrel" | "math";

export type PersonaContent = {
  id: PersonaId;
  label: string;
  title: string;
  role: string;
  tagline: string;
  heroBioBefore: string;
  heroBioEmphasis: string;
  heroBioAfter: string;
  keywords: string[];
};

// TODO: "math" copy is a first draft — swap in your own wording once
// you've settled on how you want to describe this side of things.
export const personas: Record<PersonaId, PersonaContent> = {
  devrel: {
    id: "devrel",
    label: "DevRel",
    title: "Aniket Bhattacharyea — Developer Relations & Technical Content",
    role: "Developer Relations & Technical Content",
    tagline: "Worry-free developer marketing",
    heroBioBefore: "I help developer tools companies earn trust with ",
    heroBioEmphasis: "worry-free",
    heroBioAfter:
      " developer marketing — writing, strategy, and content that developers actually read.",
    keywords: [
      "Technical Writing",
      "DevRel Strategy",
      "Developer Content",
      "SEO",
      "Community Growth",
      "Code Tutorials",
    ],
  },
  math: {
    id: "math",
    label: "Math",
    title: "Aniket Bhattacharyea — Mathematician & Astrophotographer",
    role: "Mathematician & Astrophotographer",
    tagline: "Proofs by day, deep sky by night",
    heroBioBefore: "I chase ",
    heroBioEmphasis: "precision",
    heroBioAfter:
      " — in mathematical proofs during the day, and in long-exposure images of the night sky after dark.",
    keywords: [
      "Number Theory",
      "Astrophotography",
      "Deep-Sky Imaging",
      "Mathematical Research",
      "Image Processing",
      "Telescopes",
    ],
  },
};

export type PaperItem = {
  title: string;
  venue: string;
  year: string;
  href: string;
};

// Pulled from https://orcid.org/0000-0002-5489-4906.
export const papers: PaperItem[] = [
  {
    title:
      "Advancing instance segmentation and WBC classification in peripheral blood smear through domain adaptation: A study on PBC and the novel RV-PBS datasets",
    venue: "Expert Systems with Applications",
    year: "2024",
    href: "https://doi.org/10.1016/j.eswa.2024.123660",
  },
  {
    title:
      "Dynamic Human–Artificial Intelligence Collaboration Framework for Adaptive Work Environments in Industry 5.0",
    venue: "Artificial Intelligence and Communication Techniques in Industry 5.0",
    year: "2024",
    href: "https://doi.org/10.1201/9781003494027",
  },
];

const PersonaContext = createContext<{
  persona: PersonaId;
  requestSwitch: () => void;
} | null>(null);

/** Wraps the app; holds which persona is active. Not persisted across
 * reloads on purpose — every visit starts on the primary (devrel) persona,
 * switching is a same-session toggle. Switching plays a fullscreen
 * transition (see PersonaTransition) rather than swapping content
 * instantly — the actual persona flip happens partway through it, hidden
 * behind the overlay. */
export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<PersonaId>("devrel");
  const [transitioning, setTransitioning] = useState(false);

  const requestSwitch = useCallback(() => {
    setTransitioning(true);
  }, []);

  const handleSwap = useCallback(() => {
    setPersona((p) => (p === "devrel" ? "math" : "devrel"));
  }, []);

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
