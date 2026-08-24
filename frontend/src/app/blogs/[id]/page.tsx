import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import BlocksContent from "@/components/BlocksContent";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { profile } from "@/lib/data";
import {
  getPosts,
  getPostByDocumentId,
  strapiMediaUrl,
  type ArticleCategoryData,
} from "@/lib/strapi";

export async function generateStaticParams() {
  const { data: posts } = await getPosts(1, 100);
  return posts.map((post) => ({ id: post.documentId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostByDocumentId(id);
  if (!post) return {};

  const title = `${post.title} — ${profile.name}`;

  return {
    title,
    description: post.summary,
    alternates: {
      canonical: `/blogs/${post.documentId}`,
    },
    openGraph: {
      title,
      description: post.summary,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [profile.name],
      // Falls back to the site-wide opengraph-image when there's no
      // feature image — only override it here when we actually have one.
      ...(post.feature_image && {
        images: [
          {
            url: strapiMediaUrl(post.feature_image.url),
            width: post.feature_image.width,
            height: post.feature_image.height,
            alt: post.feature_image.alternativeText ?? post.title,
          },
        ],
      }),
    },
    // Metadata objects aren't deep-merged with the parent layout's — if we
    // don't set our own `twitter` here, Twitter Cards for every post would
    // silently fall back to the root layout's site-wide title/description.
    twitter: {
      card: "summary_large_image",
      title,
      description: post.summary,
      ...(post.feature_image && {
        images: [strapiMediaUrl(post.feature_image.url)],
      }),
    },
  };
}

function formatDate(iso?: string | Date) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostByDocumentId(id);
  if (!post) notFound();

  // The relation's typed shape omits id/documentId even though the API
  // response includes them — see ArticleCategoryData for the accurate shape.
  const categories = (post.article_categories ?? []) as ArticleCategoryData[];

  return (
    <>
      <ArticleJsonLd post={post} />
      <Nav />
      <main>
        <section className="border-b border-line px-6 pb-16 pt-36 md:px-10">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blogs"
              data-cursor-hover
              className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-fg"
            >
              ← All writing
            </Link>

            <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-accent">
              {formatDate(post.publishedAt)}
            </p>

            <Reveal>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {post.title}
              </h1>
            </Reveal>

            {post.summary && (
              <Reveal delay={0.1}>
                <p className="mt-6 text-lg text-muted sm:text-xl">{post.summary}</p>
              </Reveal>
            )}

            {categories.length > 0 && (
              <Reveal delay={0.16}>
                <div className="mt-8 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <span
                      key={category.documentId}
                      className="rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-muted"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>

        {post.feature_image && (
          <section className="border-b border-line px-6 py-12 md:px-10">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-line">
              <Image
                src={strapiMediaUrl(post.feature_image.url)}
                alt={post.feature_image.alternativeText ?? post.title}
                width={post.feature_image.width ?? 1600}
                height={post.feature_image.height ?? 900}
                sizes="(min-width: 1024px) 896px, 100vw"
                className="h-auto w-full"
                priority
              />
            </div>
          </section>
        )}

        <section className="px-6 py-16 md:px-10">
          <div className="mx-auto max-w-3xl">
            <BlocksContent content={post.body} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
