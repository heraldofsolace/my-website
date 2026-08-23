import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";

// Primary face, used site-wide for both headings and body copy.
export const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Numerals, tags, nav, labels.
export const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});
