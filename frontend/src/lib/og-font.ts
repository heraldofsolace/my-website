/**
 * `next/og`'s ImageResponse renders with Satori, which needs raw font
 * bytes — it can't use `next/font`'s CSS-variable wrapping. This fetches
 * the actual font file from Google Fonts' CSS API (requesting only the
 * glyphs `text` needs, and forcing a UA that gets served TTF instead of
 * WOFF2, which Satori doesn't support).
 */
export async function loadGoogleFont(
  family: string,
  weight: number,
  text: string
): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  )}:wght@${weight}&text=${encodeURIComponent(text)}`;

  const css = await fetch(cssUrl, {
    headers: {
      // A UA old enough that Google serves .ttf rather than .woff2.
      "User-Agent":
        "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.34 (KHTML, like Gecko) Chrome/9.0.601.0 Safari/534.34",
    },
  }).then((res) => res.text());

  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype|woff)'\)/);
  if (!match) {
    throw new Error(`Could not find a font file URL for ${family}`);
  }

  const res = await fetch(match[1]);
  if (!res.ok) {
    throw new Error(`Failed to download font file for ${family}: ${res.status}`);
  }
  return res.arrayBuffer();
}
