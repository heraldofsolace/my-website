"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { usePersona } from "@/lib/persona";
import type { PostData } from "@/lib/strapi";

const INSTAGRAM_HANDLE = "aniket_astrophotography";

function formatDate(iso?: string | Date) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Pre-resolved on the server (see page.tsx) — media URLs are made absolute
// there, since STRAPI_URL isn't available for this "use client" component
// to resolve relative Strapi upload paths itself.
export type GalleryPhoto = {
  documentId: string;
  src: string;
  alt: string;
  caption: string;
  date?: string | Date;
};

export default function Writing({
  posts,
  astrophotos,
}: {
  posts: PostData[];
  astrophotos: GalleryPhoto[];
}) {
  const { persona } = usePersona();

  if (persona === "math") {
    return <AstrophotographyGallery photos={astrophotos} />;
  }

  if (posts.length === 0) return null;

  return (
    <section
      id="writing"
      className="border-t border-line px-6 py-28 md:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            From the blog
          </span>
          <Link
            href="/blogs"
            data-cursor-hover
            className="font-mono text-xs uppercase tracking-widest text-fg underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
          >
            Read more →
          </Link>
        </div>

        <h2 className="mt-6 max-w-2xl font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          Learn how to grow the developer audience you deserve.
        </h2>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {posts.map((post, i) => (
            <Reveal key={post.documentId} delay={i * 0.06} className="h-full">
              <motion.div whileHover={{ backgroundColor: "var(--bg-soft)" }} className="h-full">
                <Link
                  href={`/blogs/${post.documentId}`}
                  data-cursor-hover
                  className="flex h-full flex-col justify-between gap-8 bg-transparent p-8"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-muted">
                    {formatDate(post.publishedAt)}
                  </span>
                  <h3 className="font-display text-xl font-medium leading-snug tracking-tight sm:text-2xl">
                    {post.title}
                  </h3>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AstrophotographyGallery({ photos }: { photos: GalleryPhoto[] }) {
  return (
    <section
      id="writing"
      className="border-t border-line px-6 py-28 md:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            Through the lens
          </span>
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="font-mono text-xs uppercase tracking-widest text-fg underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
          >
            @{INSTAGRAM_HANDLE} on Instagram →
          </a>
        </div>

        <h2 className="mt-6 max-w-2xl font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          A few frames from the night sky.
        </h2>

        {photos.length === 0 ? (
          <p className="mt-14 font-mono text-sm text-muted">
            More frames coming soon.
          </p>
        ) : (
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {photos.map((photo, i) => (
              <Reveal key={photo.documentId} delay={Math.min(i * 0.08, 0.3)}>
                <div className="group relative aspect-square overflow-hidden rounded-2xl border border-line bg-bg-soft">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {photo.caption && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-white">
                        {photo.caption}
                      </p>
                      {photo.date && (
                        <p className="mt-1 font-mono text-[10px] text-white/70">
                          {formatDate(photo.date)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
