/* Throwaway local dev-seeding script — sets public permissions and creates
 * sample content so the frontend integration can be exercised end to end.
 * Not part of the deliverable; deleted after verification. */
const strapi = require("@strapi/strapi");

async function run() {
  const app = await strapi.createStrapi().load();

  // --- Public permissions for the content the frontend needs to read ---
  const publicRole = await app.db
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "public" } });

  const actions = [
    "api::service.service.find",
    "api::service.service.findOne",
    "api::service-pricing.service-pricing.find",
    "api::service-pricing.service-pricing.findOne",
    "api::post.post.find",
    "api::post.post.findOne",
    "api::article-category.article-category.find",
    "api::article-category.article-category.findOne",
    "plugin::upload.file.find",
    "plugin::upload.file.findOne",
  ];

  for (const action of actions) {
    const existing = await app.db
      .query("plugin::users-permissions.permission")
      .findOne({ where: { action, role: publicRole.id } });
    if (!existing) {
      await app.db.query("plugin::users-permissions.permission").create({
        data: { action, role: publicRole.id },
      });
      console.log("granted", action);
    } else {
      console.log("already granted", action);
    }
  }

  // --- Sample content ---
  const alreadySeeded = await app.db.query("api::service.service").findOne();
  if (alreadySeeded) {
    console.log("content already seeded, skipping");
    await app.destroy();
    process.exit(0);
  }

  const service1 = await app.documents("api::service.service").create({
    data: {
      name: "Technical Content Writing",
      slug: "technical-content-writing",
      summary:
        "SEO-friendly blog posts written for developers, complete with working code snippets, screenshots, and a demo application.",
      starting_price: "$500 onwards",
      description: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "I write technically accurate, SEO-friendly content for developer tools companies.",
            },
          ],
        },
      ],
    },
    status: "published",
  });

  await app.documents("api::service-pricing.service-pricing").create({
    data: {
      name: "One-off",
      price: "$400",
      details: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "Per 1,500-2,000 word article." }],
        },
      ],
      service: service1.documentId,
    },
    status: "published",
  });

  await app.documents("api::service.service").create({
    data: {
      name: "DevRel Consulting",
      slug: "devrel-consulting",
      summary:
        "Audit your product and DevRel strategy, then build and execute a content plan to engage developers.",
      starting_price: "$2,000 onwards",
      description: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "Full DevRel strategy and execution." }],
        },
      ],
    },
    status: "published",
  });

  const category = await app.documents("api::article-category.article-category").create({
    data: { name: "Tutorials", slug: "tutorials" },
    status: "published",
  });

  await app.documents("api::post.post").create({
    data: {
      title: "How to Seed Strapi Content Programmatically",
      summary: "A quick look at using the Strapi v5 Document Service API from a Node script.",
      body: [
        {
          type: "heading",
          level: 2,
          children: [{ type: "text", text: "Why seed programmatically" }],
        },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "The Document Service API makes it easy to create records outside the admin panel, which is handy for local development and testing.",
            },
          ],
        },
        {
          type: "list",
          format: "unordered",
          children: [
            {
              type: "list-item",
              children: [{ type: "text", text: "Fast to set up" }],
            },
            {
              type: "list-item",
              children: [{ type: "text", text: "Repeatable across environments" }],
            },
          ],
        },
      ],
      article_categories: [category.documentId],
    },
    status: "published",
  });

  await app.documents("api::post.post").create({
    data: {
      title: "A Second Test Post",
      summary: "Second post to check that the /blogs listing page paginates and sorts correctly.",
      body: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "Just some body content for testing." }],
        },
      ],
    },
    status: "published",
  });

  console.log("seed complete");
  await app.destroy();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
