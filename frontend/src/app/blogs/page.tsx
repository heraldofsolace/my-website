import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { profile } from "@/lib/data";
import { getPosts } from "@/lib/strapi";

const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: `Writing — ${profile.name}`,
  description:
    "Articles on developer content, technical writing, and developer relations.",
};

function formatDate(iso?: string | Date) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { data: posts, meta } = await getPosts(page, PAGE_SIZE);
  const { pageCount, total } = meta.pagination;

  return (
    <>
      <Nav />
      <main id="main-content">
        <section className="border-b border-line px-6 pb-16 pt-36 md:px-10">
          <div className="mx-auto max-w-7xl">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              Writing — {total} article{total === 1 ? "" : "s"}
            </span>
            <Reveal>
              <h1 className="mt-6 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-6xl">
                Learn how to grow the developer audience you deserve.
              </h1>
            </Reveal>
          </div>
        </section>

        <section className="px-6 py-16 md:px-10">
          <div className="mx-auto max-w-7xl">
            {posts.length === 0 ? (
              <p className="text-muted">No articles published yet — check back soon.</p>
            ) : (
              <div className="border-t border-line">
                {posts.map((post, i) => (
                  <Reveal key={post.documentId} delay={Math.min(i * 0.04, 0.3)}>
                    <Link
                      href={`/blogs/${post.documentId}`}
                      data-cursor-hover
                      className="group grid grid-cols-1 gap-2 border-b border-line py-8 transition-colors hover:bg-bg-soft sm:grid-cols-[140px_1fr] sm:items-baseline sm:gap-6 sm:px-4"
                    >
                      <span className="font-mono text-xs uppercase tracking-widest text-muted">
                        {formatDate(post.publishedAt)}
                      </span>
                      <div>
                        <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
                          {post.title}
                        </h2>
                        {post.summary && (
                          <p className="mt-2 max-w-2xl text-muted">{post.summary}</p>
                        )}
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}

            {pageCount > 1 && (
              <div className="mt-14 flex items-center justify-between font-mono text-xs uppercase tracking-widest">
                {page > 1 ? (
                  <Link
                    href={page - 1 === 1 ? "/blogs" : `/blogs?page=${page - 1}`}
                    data-cursor-hover
                    className="text-fg transition-colors hover:text-accent"
                  >
                    ← Newer
                  </Link>
                ) : (
                  <span />
                )}
                <span className="text-muted">
                  Page {page} / {pageCount}
                </span>
                {page < pageCount ? (
                  <Link
                    href={`/blogs?page=${page + 1}`}
                    data-cursor-hover
                    className="text-fg transition-colors hover:text-accent"
                  >
                    Older →
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
