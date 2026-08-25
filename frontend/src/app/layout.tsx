import type { Metadata } from "next";
import Script from "next/script";
import { MotionConfig } from "framer-motion";
import { display, mono } from "@/lib/fonts";
import { PersonaProvider } from "@/lib/persona";
import Cursor from "@/components/Cursor";
import Intro from "@/components/Intro";
import ScrollProgress from "@/components/ScrollProgress";
import ConsoleEgg from "@/components/ConsoleEgg";
import PiEasterEgg from "@/components/PiEasterEgg";
import "./globals.css";

const title = "Aniket Bhattacharyea — Developer Relations & Technical Content";
const description =
  "Worry-free developer marketing. Technical content creation, DevRel consulting, and content strategy for developer tools companies.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://abhattacharyea.dev"),
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Aniket Bhattacharyea",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="grain cursor-none-desktop min-h-full bg-bg font-sans text-fg">
        {/* Invisible until focused (first Tab stop on every page) — lets
            keyboard/screen-reader users jump straight past the nav (logo,
            5 links, persona toggle, mobile menu button) to the actual page
            content instead of tabbing through all of it every time. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-fg focus:px-6 focus:py-3 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-bg"
        >
          Skip to content
        </a>
        <Script
          src="https://umami.abhattacharyea.dev/script.js"
          data-website-id="66866d14-8fbd-4230-b1d4-361a05faaf7d"
          strategy="afterInteractive"
        />
        <ConsoleEgg />
        {/* reducedMotion="user" makes every motion.* component site-wide
            respect prefers-reduced-motion automatically (essentially free —
            transforms/opacity still apply, just instantly instead of
            animated) — the alternative was manually checking the media
            query in every single animated component individually, which
            most of them didn't do (only AsciiField and Intro did). */}
        <MotionConfig reducedMotion="user">
          <PersonaProvider>
            <Intro />
            <ScrollProgress />
            <Cursor />
            <PiEasterEgg />
            {children}
          </PersonaProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
