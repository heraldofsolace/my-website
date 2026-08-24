import { profile } from "@/lib/data";
import { personas, type PersonaId } from "@/lib/personaData";

/**
 * schema.org Person structured data, one per persona/URL — see
 * app/page.tsx (devrel) and app/math/page.tsx (math). Not in the shared
 * HomeSections component since which persona a given URL represents is
 * fixed per-route, not something to infer at render time.
 */
export default function PersonJsonLd({ persona }: { persona: PersonaId }) {
  const content = personas[persona];

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: `https://abhattacharyea.dev${persona === "math" ? "/math" : ""}`,
    jobTitle: content.role,
    description: content.tagline,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location,
    },
    sameAs: profile.socials.map((social) => social.href),
    knowsAbout: content.keywords,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
