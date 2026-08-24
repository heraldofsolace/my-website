/* Throwaway script: grants public find/findOne on blog-portfolio, then
 * pulls the real blog-portfolio entries from production and recreates them
 * locally, linked to the (already-seeded) local article-categories. */
require("dotenv").config();

const PROD_URL = "https://strapi.abhattacharyea.dev";
const token = process.argv[2];
if (!token) {
  console.error("usage: node pull-blog-portfolio.js <api-token>");
  process.exit(1);
}

async function prodFetch(p) {
  const res = await fetch(`${PROD_URL}${p}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`prod fetch ${p} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function run() {
  const strapi = await require("@strapi/strapi").createStrapi().load();

  // --- Public permissions ---
  const publicRole = await strapi.db
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "public" } });
  for (const action of [
    "api::blog-portfolio.blog-portfolio.find",
    "api::blog-portfolio.blog-portfolio.findOne",
  ]) {
    const existing = await strapi.db
      .query("plugin::users-permissions.permission")
      .findOne({ where: { action, role: publicRole.id } });
    if (!existing) {
      await strapi.db.query("plugin::users-permissions.permission").create({
        data: { action, role: publicRole.id },
      });
      console.log("granted", action);
    } else {
      console.log("already granted", action);
    }
  }

  // --- Fetch prod data ---
  console.log("Fetching from production...");
  const itemsRes = await prodFetch(
    "/api/blog-portfolios?populate=article_categories&pagination[pageSize]=100&sort=publishedAt:desc"
  );
  console.log(`Got ${itemsRes.data.length} blog-portfolio items`);

  // Map prod category slug -> local category documentId (categories were
  // already seeded by pull-real-content.js, with the same slugs).
  const localCategories = await strapi.documents("api::article-category.article-category").findMany({});
  const slugToLocalDocId = Object.fromEntries(localCategories.map((c) => [c.slug, c.documentId]));

  // --- Wipe local blog-portfolio content ---
  await strapi.db.query("api::blog-portfolio.blog-portfolio").deleteMany({});

  for (const item of itemsRes.data) {
    const categoryDocIds = (item.article_categories ?? [])
      .map((c) => slugToLocalDocId[c.slug])
      .filter(Boolean);

    await strapi.documents("api::blog-portfolio.blog-portfolio").create({
      data: {
        title: item.title,
        link: item.link,
        client: item.client,
        published_date: item.published_date ?? null,
        ...(categoryDocIds.length ? { article_categories: categoryDocIds } : {}),
      },
      status: "published",
    });
    console.log("blog-portfolio:", item.title);
  }

  console.log("Done.");
  await strapi.destroy();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
