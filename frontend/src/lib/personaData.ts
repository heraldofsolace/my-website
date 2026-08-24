// Plain data — deliberately *not* "use client" (unlike persona.tsx, which
// holds the React context/provider/hooks) so server components (route
// metadata, JSON-LD, opengraph-image) can import it directly. Importing
// data re-exported from a "use client" module at server-side module-eval
// time (e.g. metadata's top-level `const content = personas.math`) isn't
// reliable — it evaluated to undefined during a real build.

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
