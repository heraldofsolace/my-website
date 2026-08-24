import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";
import { loadGoogleFont } from "@/lib/og-font";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const name = profile.name;
  const role = profile.role;
  const tagline = profile.tagline;

  const [displayFont, monoFont] = await Promise.all([
    loadGoogleFont("Bricolage Grotesque", 700, name),
    // `role` renders uppercase via CSS text-transform (needs the uppercase
    // glyphs), `tagline` renders as-is.
    loadGoogleFont("Geist Mono", 500, `${role.toUpperCase()}${tagline}`),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0b0a08",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: "#d64541",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            fontFamily: "Geist Mono",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#d64541",
          }}
        >
          {role}
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Bricolage Grotesque",
            fontSize: 88,
            fontWeight: 700,
            color: "#f6f1e7",
            marginTop: 28,
            lineHeight: 1.05,
          }}
        >
          {name}
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Geist Mono",
            fontSize: 24,
            letterSpacing: 2,
            color: "#948d7e",
            marginTop: 28,
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage Grotesque", data: displayFont, weight: 700, style: "normal" },
        { name: "Geist Mono", data: monoFont, weight: 500, style: "normal" },
      ],
    }
  );
}
