import qs from "qs";
import type {
  APIResponseData,
  CollectionTypeResponse,
} from "@/types/types";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";

export type ServiceData = APIResponseData<"api::service.service">;
export type ServicePricingData = APIResponseData<"api::service-pricing.service-pricing">;
export type PostData = APIResponseData<"api::post.post">;
export type ArticleCategoryData = APIResponseData<"api::article-category.article-category">;
export type BlogPortfolioData = APIResponseData<"api::blog-portfolio.blog-portfolio">;
export type AstrophotoData = APIResponseData<"api::astrophoto.astrophoto">;

/** Resolves a Strapi media `url` (often relative) to an absolute URL. */
export function strapiMediaUrl(url: string): string {
  return /^https?:\/\//.test(url) ? url : `${STRAPI_URL}${url}`;
}

async function strapiFetch<T>(
  path: string,
  query?: Record<string, unknown>
): Promise<T | null> {
  const search = query ? `?${qs.stringify(query, { encodeValuesOnly: true })}` : "";
  // Cached indefinitely (build-time SSG): these pages are static. Content
  // updates go live on the next build/deploy — trigger one from Strapi via
  // a webhook to POST /api/redeploy (see app/api/redeploy/route.ts). There
  // is deliberately no time-based revalidation here.
  const res = await fetch(`${STRAPI_URL}/api${path}${search}`, {
    headers: {
      ...(process.env.STRAPI_API_TOKEN
        ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
        : {}),
    },
    cache: "force-cache",
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(
      `Strapi request to ${path} failed: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}

export async function getServices(): Promise<ServiceData[]> {
  const res = await strapiFetch<CollectionTypeResponse<"api::service.service">>(
    "/services",
    { sort: "name:asc", populate: "*" }
  );
  return res?.data ?? [];
}

export async function getServiceBySlug(slug: string): Promise<ServiceData | null> {
  const res = await strapiFetch<CollectionTypeResponse<"api::service.service">>(
    "/services",
    {
      filters: { slug: { $eq: slug } },
      populate: { service_pricings: { populate: "*" } },
    }
  );
  return res?.data[0] ?? null;
}

export async function getLatestPosts(limit: number): Promise<PostData[]> {
  const res = await strapiFetch<CollectionTypeResponse<"api::post.post">>(
    "/posts",
    {
      sort: "publishedAt:desc",
      pagination: { limit },
      populate: "*",
    }
  );
  return res?.data ?? [];
}

export async function getPosts(
  page: number,
  pageSize: number
): Promise<CollectionTypeResponse<"api::post.post">> {
  const res = await strapiFetch<CollectionTypeResponse<"api::post.post">>(
    "/posts",
    {
      sort: "publishedAt:desc",
      pagination: { page, pageSize },
      populate: "*",
    }
  );
  return (
    res ?? {
      data: [],
      meta: { pagination: { page: 1, pageSize, pageCount: 0, total: 0 } },
    }
  );
}

export async function getPostByDocumentId(documentId: string): Promise<PostData | null> {
  const res = await strapiFetch<{ data: PostData }>(`/posts/${documentId}`, {
    populate: "*",
  });
  return res?.data ?? null;
}

export async function getWorkItems(): Promise<BlogPortfolioData[]> {
  const res = await strapiFetch<CollectionTypeResponse<"api::blog-portfolio.blog-portfolio">>(
    "/blog-portfolios",
    {
      sort: "publishedAt:desc",
      populate: "article_categories",
      pagination: { pageSize: 100 },
    }
  );
  return res?.data ?? [];
}

export async function getAstrophotos(): Promise<AstrophotoData[]> {
  const res = await strapiFetch<CollectionTypeResponse<"api::astrophoto.astrophoto">>(
    "/astrophotos",
    {
      sort: "Date:desc",
      populate: "image",
      pagination: { pageSize: 100 },
    }
  );
  return res?.data ?? [];
}
