export const profile = {
  name: "Aniket Bhattacharyea",
  initials: "AB",
  role: "Developer Relations & Technical Content",
  tagline: "Worry-free developer marketing",
  location: "Kolkata, India",
  timezone: "GMT+5:30",
  email: "aniket@abhattacharyea.dev",
  availability: "Booking new clients for Q4",
  socials: [
    { label: "GitHub", href: "https://github.com/heraldofsolace" },
    { label: "LinkedIn", href: "https://linkedin.com/in/heraldofsolace" },
  ],
};

export const stats = [
  { value: 5, suffix: "+", label: "Years as a developer" },
  { value: 3, suffix: "+", label: "Years in developer relations" },
  { value: 150, suffix: "+", label: "Technical articles shipped" },
  { value: 30, suffix: "+", label: "Clients served" },
];

// Services and blog posts are fetched from Strapi — see src/lib/strapi.ts.

// `domain` is used to fetch a favicon badge — omit it for places without a
// meaningful/known one, and the badge falls back to initials.
export type Client = { name: string; domain?: string };

export const clients: Client[] = [
  { name: "Fingerprint", domain: "fingerprint.com" },
  { name: "Bright Data", domain: "brightdata.com" },
  { name: "Earthly", domain: "earthly.dev" },
  { name: "FusionAuth", domain: "fusionauth.io" },
  { name: "JetBrains GoLand", domain: "jetbrains.com" },
  { name: "Dropbox Sign", domain: "dropboxsign.com" },
  { name: "Loft Labs", domain: "loft.sh" },
  { name: "Tailscale", domain: "tailscale.com" },
  { name: "Strapi", domain: "strapi.io" },
  { name: "ScrapingBee", domain: "scrapingbee.com" },
  { name: "Prove", domain: "prove.com" },
  { name: "Aviator", domain: "aviator.co" },
  { name: "Draft.dev", domain: "draft.dev" },
  { name: "Rewind", domain: "rewind.com" },
  { name: "StreamNative", domain: "streamnative.io" },
  { name: "Clerk", domain: "clerk.com" },
];

export const teachingPlaces: Client[] = [
  { name: "Sky Watchers' Association" },
  { name: "St. Xavier's College (Autonomous), Kolkata", domain: "sxccal.edu" },
  { name: "Allen Kota", domain: "allen.in" },
];

// Selected work (blog-portfolio) is fetched from Strapi — see src/lib/strapi.ts.

// `hash` only, not a full href — Nav.tsx prefixes it with whichever
// persona's own path ("/" or "/math") is currently active. A hardcoded
// "/#work" broke navigation on math: clicking any link, even the logo,
// jumped back to devrel instead of scrolling within the current page.
// `devrelOnly` hides an item entirely on math rather than linking to a
// section that isn't there (Projects.tsx renders nothing on math).
// `mathLabel` overrides `label` on math, for the two sections whose
// content is different enough there that the devrel label reads wrong:
// Work.tsx shows "Published Papers" on math, not the devrel "Selected
// Work"; Writing.tsx shows an astrophotography gallery ("Through the
// lens"), not blog writing. About and Services keep the same eyebrow
// text ("About", "Services — N/M") on both personas, so no override
// needed there.
export const nav = [
  { label: "Work", mathLabel: "Papers", hash: "work" },
  { label: "Projects", hash: "projects", devrelOnly: true },
  { label: "About", hash: "about" },
  { label: "Services", hash: "services" },
  { label: "Writing", mathLabel: "Gallery", hash: "writing" },
  { label: "Contact", hash: "contact" },
];
