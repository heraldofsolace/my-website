import type { Metadata } from "next";
import { display, mono } from "@/lib/fonts";
import { PersonaProvider } from "@/lib/persona";
import Cursor from "@/components/Cursor";
import Intro from "@/components/Intro";
import ScrollProgress from "@/components/ScrollProgress";
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
        <PersonaProvider>
          <Intro />
          <ScrollProgress />
          <Cursor />
          {children}
        </PersonaProvider>
      </body>
    </html>
  );
}
