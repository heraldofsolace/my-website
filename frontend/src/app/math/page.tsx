import type { Metadata } from "next";
import HomeSections from "@/components/HomeSections";
import PersonJsonLd from "@/components/PersonJsonLd";
import { personas } from "@/lib/personaData";

const content = personas.math;

export const metadata: Metadata = {
  title: content.title,
  description: `${content.tagline}. ${content.heroBioBefore}${content.heroBioEmphasis}${content.heroBioAfter}`,
  alternates: {
    canonical: "/math",
  },
  openGraph: {
    title: content.title,
    description: content.tagline,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: content.title,
    description: content.tagline,
  },
};

export default function MathHome() {
  return (
    <>
      <PersonJsonLd persona="math" />
      <HomeSections />
    </>
  );
}
