/* Throwaway script: invokes the strapi transfer command's action directly,
 * bypassing a bug in this Strapi version's CLI wizard (command.js) where
 * providing --from directly corrupts its own direction-detection logic and
 * sends it into an unwanted interactive "destination URL" prompt. */
require("dotenv").config();
// require()'d via an absolute filesystem path, not a package specifier, so
// it bypasses @strapi/strapi's package.json "exports" restriction (which
// doesn't expose this internal module as a public subpath).
const action = require(
  require.resolve("@strapi/strapi").replace(/dist\/index\.js$/, "dist/src/cli/commands/transfer/action.js")
);

const token = process.argv[2];
if (!token) {
  console.error("usage: node transfer-tmp.js <from-token>");
  process.exit(1);
}

action({
  // The real CLI wizard (command.js) parses --from into a URL instance via
  // a Commander argParser before action.js ever sees it; calling action()
  // directly means we have to do that ourselves.
  from: new URL("https://strapi.abhattacharyea.dev"),
  fromToken: token,
  force: true,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
