import { profile } from "@/lib/data";
import { strapiMediaUrl, type PostData } from "@/lib/strapi";

export default function ArticleJsonLd({ post }: { post: PostData }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: profile.name,
      url: "https://abhattacharyea.dev",
    },
    ...(post.feature_image && {
      image: [strapiMediaUrl(post.feature_image.url)],
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://abhattacharyea.dev/blogs/${post.documentId}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
