import type { MetadataRoute } from "next";
import { getPosts, getServices } from "@/lib/strapi";

const BASE_URL = "https://abhattacharyea.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postsRes, services] = await Promise.all([
    getPosts(1, 100),
    getServices(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/math`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blogs`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const postRoutes: MetadataRoute.Sitemap = postsRes.data.map((post) => ({
    url: `${BASE_URL}/blogs/${post.documentId}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: service.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes, ...serviceRoutes];
}
