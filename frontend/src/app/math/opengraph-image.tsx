import { profile } from "@/lib/data";
import { personas } from "@/lib/personaData";
import { OG_IMAGE_SIZE, renderProfileOgImage } from "@/lib/og-image";

const content = personas.math;

export const alt = `${profile.name} — ${content.role}`;
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderProfileOgImage({
    name: profile.name,
    role: content.role,
    tagline: content.tagline,
  });
}
