import type { Metadata } from "next";
import { display, mono } from "@/lib/fonts";
import Cursor from "@/components/Cursor";
import Intro from "@/components/Intro";
import ScrollProgress from "@/components/ScrollProgress";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aniket Bhattacharyea — Developer Relations & Technical Content",
  description:
    "Worry-free developer marketing. Technical content creation, DevRel consulting, and content strategy for developer tools companies.",
  metadataBase: new URL("https://abhattacharyea.dev"),
  openGraph: {
    title: "Aniket Bhattacharyea — Developer Relations & Technical Content",
    description:
      "Worry-free developer marketing for developer tools companies.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="grain cursor-none-desktop min-h-full bg-bg font-sans text-fg">
        <Intro />
        <ScrollProgress />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
