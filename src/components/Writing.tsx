"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { posts } from "@/lib/data";

export default function Writing() {
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
          <a
            href="https://abhattacharyea.dev/blogs"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="font-mono text-xs uppercase tracking-widest text-fg underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
          >
            Read more →
          </a>
        </div>

        <h2 className="mt-6 max-w-2xl font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          Learn how to grow the developer audience you deserve.
        </h2>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {posts.map((post, i) => (
            <Reveal key={post.href} delay={i * 0.06} className="h-full">
              <motion.a
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                whileHover={{ backgroundColor: "var(--bg-soft)" }}
                className="flex h-full flex-col justify-between gap-8 bg-bg p-8"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-muted">
                  {post.date}
                </span>
                <h3 className="font-display text-xl font-medium leading-snug tracking-tight sm:text-2xl">
                  {post.title}
                </h3>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
