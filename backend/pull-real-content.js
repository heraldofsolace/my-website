/* Throwaway script: pulls real content from the production Strapi
 * (https://strapi.abhattacharyea.dev) via its REST API using a full-access
 * API token, and recreates it in the local instance — including feature
 * images. Wipes local services/service-pricings/posts/article-categories
 * first so there's no leftover synthetic seed data mixed in. */
require("dotenv").config();
const fs = require("fs");
const os = require("os");
const path = require("path");
const https = require("https");

const PROD_URL = "https://strapi.abhattacharyea.dev";
const token = process.argv[2];
if (!token) {
  console.error("usage: node pull-real-content.js <api-token>");
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

function downloadToTmp(url) {
  return new Promise((resolve, reject) => {
    const dest = path.join(os.tmpdir(), path.basename(new URL(url).pathname));
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`download ${url} failed: ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve(dest)));
      })
      .on("error", reject);
  });
}

async function run() {
  const strapi = await require("@strapi/strapi").createStrapi().load();

  console.log("Fetching from production...");
  const [categoriesRes, servicesRes, pricingsRes, postsRes] = await Promise.all([
    prodFetch("/api/article-categories"),
    prodFetch("/api/services"),
    prodFetch("/api/service-pricings?populate=service"),
    prodFetch("/api/posts?populate=*&pagination[pageSize]=100"),
  ]);

  console.log(
    `Got ${categoriesRes.data.length} categories, ${servicesRes.data.length} services, ${pricingsRes.data.length} pricings, ${postsRes.data.length} posts`
  );

  // --- Wipe local content (both draft + published rows) ---
  console.log("Wiping local content...");
  for (const uid of [
    "api::post.post",
    "api::service-pricing.service-pricing",
    "api::service.service",
    "api::article-category.article-category",
  ]) {
    await strapi.db.query(uid).deleteMany({});
  }

  // --- Categories ---
  const categoryIdMap = {}; // prod documentId -> local documentId
  for (const c of categoriesRes.data) {
    const created = await strapi.documents("api::article-category.article-category").create({
      data: { name: c.name, slug: c.slug },
      status: "published",
    });
    categoryIdMap[c.documentId] = created.documentId;
    console.log("category:", c.name);
  }

  // --- Services ---
  const serviceIdMap = {};
  for (const s of servicesRes.data) {
    const created = await strapi.documents("api::service.service").create({
      data: {
        name: s.name,
        slug: s.slug,
        summary: s.summary,
        starting_price: s.starting_price,
        description: s.description,
      },
      status: "published",
    });
    serviceIdMap[s.documentId] = created.documentId;
    console.log("service:", s.name);
  }

  // --- Service pricings ---
  for (const p of pricingsRes.data) {
    const serviceDocId = p.service ? serviceIdMap[p.service.documentId] : undefined;
    await strapi.documents("api::service-pricing.service-pricing").create({
      data: {
        name: p.name,
        price: p.price,
        details: p.details,
        ...(serviceDocId ? { service: serviceDocId } : {}),
      },
      status: "published",
    });
    console.log("pricing:", p.name, "->", p.service?.name ?? "(none)");
  }

  // --- Posts (with feature image + categories) ---
  const uploadedFileCache = {}; // prod media documentId -> local file id
  for (const post of postsRes.data) {
    let localFileId;
    const img = post.feature_image;
    if (img) {
      if (uploadedFileCache[img.documentId]) {
        localFileId = uploadedFileCache[img.documentId];
      } else {
        const url = img.url.startsWith("http") ? img.url : `${PROD_URL}${img.url}`;
        console.log("downloading image:", url);
        try {
          const tmpPath = await downloadToTmp(url);
          const stats = fs.statSync(tmpPath);
          const [uploaded] = await strapi.plugin("upload").service("upload").upload({
            data: {},
            files: {
              filepath: tmpPath,
              originalFilename: img.name,
              mimetype: img.mime,
              size: stats.size,
            },
          });
          localFileId = uploaded.id;
          uploadedFileCache[img.documentId] = localFileId;
          fs.unlinkSync(tmpPath);
        } catch (err) {
          // Production's local-provider uploads are on Railway's ephemeral
          // filesystem — files referenced in the DB can 404 after a
          // redeploy wiped the disk. Skip the image rather than aborting
          // the whole pull.
          console.warn(`  skipping missing image (${err.message})`);
        }
      }
    }

    const categoryDocIds = (post.article_categories ?? [])
      .map((c) => categoryIdMap[c.documentId])
      .filter(Boolean);

    await strapi.documents("api::post.post").create({
      data: {
        title: post.title,
        summary: post.summary,
        body: post.body,
        ...(localFileId ? { feature_image: localFileId } : {}),
        ...(categoryDocIds.length ? { article_categories: categoryDocIds } : {}),
      },
      status: "published",
    });
    console.log("post:", post.title);
  }

  console.log("Done.");
  await strapi.destroy();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
