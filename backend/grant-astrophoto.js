/* Throwaway script: grants public find/findOne on astrophoto. */
require("dotenv").config();

async function run() {
  const strapi = await require("@strapi/strapi").createStrapi().load();

  const publicRole = await strapi.db
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "public" } });

  for (const action of [
    "api::astrophoto.astrophoto.find",
    "api::astrophoto.astrophoto.findOne",
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

  await strapi.destroy();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
