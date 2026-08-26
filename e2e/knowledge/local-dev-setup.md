# Local dev setup for running the frontend under test

- **Strapi must be reachable** for the frontend to render at all. `HomeSections`
  (rendered on both `/` and `/math`) fetches services/posts/work
  items/astrophotos/projects from Strapi server-side with no error handling —
  if the fetch throws (e.g. `ECONNREFUSED`), the whole page 500s. There is no
  partial-render fallback.
- The scaffolded local backend (`backend/`, Strapi) needs a Postgres database
  on `127.0.0.1:5433` that is **not** currently running/available in this dev
  environment — `npm run develop` in `backend/` fails with
  `ECONNREFUSED 127.0.0.1:5433`.
- As a workaround, `frontend/.env.local`'s `STRAPI_URL` /
  `NEXT_PUBLIC_STRAPI_URL` were pointed at production Strapi instead of the
  unreachable local one — use the canonical custom domain
  `https://strapi.abhattacharyea.dev` (not the raw Railway URL), matching
  what `.github/workflows/ci.yml` and `e2e/playwright.config.ts`'s
  `webServer` both already use. This is a live change to a real dev file,
  not project-local Shiplight state — confirm with the user before assuming
  it's still in place, and revert to `http://127.0.0.1:1337` once local
  Postgres is set up, unless they'd rather keep testing against production
  content.
- CI (`.github/workflows/ci.yml`'s `e2e` job) doesn't need this workaround:
  `e2e/playwright.config.ts`'s `webServer` starts the frontend itself
  (`npm run dev` in `../frontend`) with `STRAPI_URL`/`NEXT_PUBLIC_STRAPI_URL`
  defaulted to the same production Strapi, so `npx shiplight test` works
  from a clean checkout with no local Strapi/Postgres at all.
- **Playwright's own Chromium can't launch on this host** (a Nix/CachyOS
  system with no system-wide X11/NSS libs) — it fails with
  `error while loading shared libraries: libxcb.so.1` (and then `libnspr4.so`,
  etc.) even after `npx playwright install chromium`. Fixed durably in the
  repo's `flake.nix`: the dev shell's `shellHook` now exports `LD_LIBRARY_PATH`
  covering Chromium's runtime deps (`nss`, `nspr`, `libxcb`, `gtk3`, `mesa`,
  etc.) via `pkgs.lib.makeLibraryPath`. Requires re-entering the Nix dev shell
  (`nix develop`) for a Shiplight MCP server or `npx shiplight test` run to
  pick it up — a shell/session started before this fix landed will still fail.
  (nixpkgs' own `playwright-driver.browsers` was tried first and rejected: the
  pinned nixpkgs revision (nixos-26.05) ships an older Chromium build than
  this repo's `@playwright/test` expects, so Playwright can't find the
  browser folder it wants under that path.)
