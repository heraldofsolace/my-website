"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  BlocksRenderer,
  type BlocksContent as StrapiBlocksContent,
} from "@strapi/blocks-react-renderer";
import { strapiMediaUrl } from "@/lib/strapi";

// prism-react-renderer + the extra prismjs grammars pull in a real chunk of
// JS (~35KB) — most posts have no code blocks at all, so code-split it
// rather than shipping that to every blog post's client bundle. Still
// server-rendered (no `ssr: false`) so code blocks appear in the initial
// HTML for crawlers/no-JS same as everything else here.
const CodeBlock = dynamic(() => import("@/components/CodeBlock"));

/**
 * Renders Strapi's Blocks rich-text format with the site's own type system —
 * no italics anywhere (matches the rest of the site), accent-colored links,
 * and code styled in the mono face.
 */
export default function BlocksContent({ content }: { content: StrapiBlocksContent }) {
  return (
    <div className="max-w-none space-y-6 text-lg leading-relaxed text-muted sm:text-xl">
      <BlocksRenderer
        content={content}
        blocks={{
          paragraph: ({ children }) => <p>{children}</p>,
          heading: ({ children, level }) => {
            const sizes: Record<number, string> = {
              1: "text-4xl sm:text-5xl",
              2: "text-3xl sm:text-4xl",
              3: "text-2xl sm:text-3xl",
              4: "text-xl sm:text-2xl",
              5: "text-lg sm:text-xl",
              6: "text-base sm:text-lg",
            };
            const Tag = `h${level}` as `h1` | `h2` | `h3` | `h4` | `h5` | `h6`;
            return (
              <Tag
                className={`mt-10 font-display font-semibold tracking-tight text-fg first:mt-0 ${sizes[level]}`}
              >
                {children}
              </Tag>
            );
          },
          list: ({ children, format }) =>
            format === "ordered" ? (
              <ol className="list-decimal space-y-2 pl-6 marker:text-accent">
                {children}
              </ol>
            ) : (
              <ul className="list-disc space-y-2 pl-6 marker:text-accent">
                {children}
              </ul>
            ),
          "list-item": ({ children }) => <li className="pl-1">{children}</li>,
          quote: ({ children }) => (
            <blockquote className="border-l-2 border-accent pl-6 text-fg">
              {children}
            </blockquote>
          ),
          // Strapi's code block carries a `language` (set via the Blocks
          // editor's language picker) that @strapi/blocks-react-renderer's
          // own types don't declare, even though it's there at runtime —
          // widen the prop type locally rather than trusting the package.
          code: ({ plainText, language }: { plainText?: string; language?: string }) => (
            <CodeBlock code={plainText ?? ""} language={language} />
          ),
          link: ({ children, url }) => (
            <Link
              href={url}
              target={url.startsWith("http") ? "_blank" : undefined}
              rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
              data-cursor-hover
              className="text-accent underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
            >
              {children}
            </Link>
          ),
          image: ({ image }) => (
            <span className="block overflow-hidden rounded-2xl border border-line">
              <Image
                src={strapiMediaUrl(image.url)}
                alt={image.alternativeText ?? ""}
                width={image.width}
                height={image.height}
                sizes="(min-width: 1024px) 720px, 100vw"
                className="h-auto w-full"
              />
              {image.caption && (
                <span className="block px-1 pt-3 font-mono text-xs uppercase tracking-widest text-muted">
                  {image.caption}
                </span>
              )}
            </span>
          ),
        }}
        modifiers={{
          bold: ({ children }) => <strong className="text-fg font-medium">{children}</strong>,
          // No italics anywhere on this site — render emphasis via color instead.
          italic: ({ children }) => <span className="text-accent-soft">{children}</span>,
          underline: ({ children }) => <span className="underline underline-offset-4">{children}</span>,
          strikethrough: ({ children }) => <span className="line-through">{children}</span>,
          code: ({ children }) => (
            <code className="rounded bg-bg-soft px-1.5 py-0.5 font-mono text-[0.9em] text-fg">
              {children}
            </code>
          ),
        }}
      />
    </div>
  );
}
