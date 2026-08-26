# Project context

## App profile

Personal portfolio site for Aniket Bhattacharyea, built with Next.js (App
Router) under `frontend/` in this npm-workspace monorepo. Content (services,
blog posts, work items, astrophotography gallery, software projects) is
fetched server-side from a Strapi backend (`backend/`, not yet scaffolded in
this repo checkout; a production instance runs at
`strapi-production-410d.up.railway.app`). This test project (`e2e/`) is its
own workspace member alongside `frontend/` and `backend/`.

The site has two "personas" toggled client-side (`PersonaProvider` in
`frontend/src/lib/persona.tsx`), each with its own indexable URL:

- **devrel** (default, `/`) — "Developer Relations & Technical Content".
  Nav/section labels lean toward writing, DevRel strategy, and a Software
  Projects section.
- **math** (`/math`) — "Mathematician & Astrophotographer". Same page
  structure (`HomeSections.tsx` is shared), different copy/labels, plus a
  live solar-system hero background (`SolarSystemBg.tsx`) and a pi-digits
  easter egg (`PiEasterEgg.tsx`).

Switching personas plays a fullscreen transition (`PersonaTransition.tsx`)
and updates the URL via `router.replace` (no new history entry, no scroll
reset).

Key pages/features:

- `/` and `/math` — shared `HomeSections`: Nav, Hero, Statement, Work,
  Projects, AsciiArt, About, Experience, Services, Clients, Testimonials,
  Writing (blog posts + astrophotography gallery), Footer.
- `/blogs` and `/blogs/[id]` — blog post listing and detail (Strapi-backed,
  rendered via `BlocksContent.tsx`).
- `/services/[slug]` — individual service detail pages.
- `/api/redeploy` — POST endpoint that triggers a Railway redeploy after a
  Strapi content edit; not a user-facing page.
- Misc: console easter eggs (`ConsoleEgg.tsx` — `whoami()`/`hire()`), an
  `X-Are-You-Hiring` response header.

## Risk profile

- **Persona correctness** is the site's distinguishing feature and its
  biggest regression risk: wrong copy/labels/nav items showing under the
  wrong persona, or the URL and displayed persona getting out of sync after
  a toggle.
- Content sections (`Writing`, `Services`, `Projects`, `Work`) depend on
  live Strapi data — empty/slow/erroring Strapi responses are a realistic
  failure mode worth covering, not just the happy path.
- Accessibility was recently audited (heading order, focus visibility,
  reduced motion, skip link — see git history) — regressions there matter.
- Fragile-by-nature: the persona transition animation, the solar-system
  background, and other motion/easter-egg components are more prone to
  visual/interaction bugs than plain content.

## Testing scope

**In scope:** persona toggle + URL sync (`/` ↔ `/math`), nav across both
personas, home page section rendering, blog list/detail navigation, service
detail pages, basic accessibility (skip link, focus visibility).

**Out of scope (for now):** the Strapi backend itself and its admin UI
(`backend/` isn't scaffolded yet), the `/api/redeploy` endpoint (no UI,
Railway-secret-gated), astrophotography/blog *content* correctness (that's
CMS data, not app behavior), console easter eggs.

## User roles

None — the site is fully public with no login or protected routes. No
roles/permissions to model.

## Data strategy

Content is read-only from the tester's point of view (no forms that write
back to Strapi from the public site). Tests read whatever content Strapi
currently has rather than creating/cleaning up fixtures. Running the app
locally requires a local Strapi instance reachable at `STRAPI_URL`
(defaults to `http://localhost:1337`, see `frontend/.env.example`) — if it's
not running, content-dependent sections may render empty rather than erroring.

## Targets

- **Base URL:** `http://localhost:3000` (local dev — `npm run dev` /
  `npx nx run frontend:dev` from the repo root, default Next.js port).
  Production deployment URL not yet recorded here — add it when tests need
  to target it.
- **Auth:** none.
- **Special setup:** frontend dev server + a reachable Strapi backend (local
  or the production Railway instance, via `STRAPI_URL`/`NEXT_PUBLIC_STRAPI_URL`
  in `frontend/.env.local`) for content sections to render real data.

## Known facts and decisions

- Monorepo: Nx-managed npm workspace, three members — `frontend/`,
  `backend/` (unscaffolded), `e2e/` (this Shiplight project, added when
  scaffolding — see root `package.json` `workspaces`).
- `SHIPLIGHT_API_TOKEN` in `e2e/.env` reuses the token already configured
  for the Shiplight MCP server in the repo root's `.mcp.json`.

## Open questions

- Production deployment URL for the frontend (for eventually testing against
  a real deployment rather than local dev).
- Whether/when to add coverage against the production Strapi instance vs.
  local-only.
