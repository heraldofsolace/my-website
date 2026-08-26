# Test Spec: Persona toggle (/ ↔ /math)

## Status

Ready

## Goal

Toggling persona via the nav's "Visit the other side" control switches the
displayed persona's copy and nav labels, and keeps the URL in sync (`/` for
devrel, `/math` for math) — in both directions, from both starting points.

## User Roles

None — anonymous visitor, fully public site.

## Starting Point

- Base URL: http://localhost:3000
- Auth: none

## Preconditions

- Frontend dev server running (`npm run dev` from repo root).
- Strapi backend reachable at `STRAPI_URL`/`NEXT_PUBLIC_STRAPI_URL` (local or
  production Railway instance) — `HomeSections` fetches services/posts/work
  items/astrophotos/projects server-side and 500s if Strapi is unreachable.

## Journeys And Variants

### Devrel → Math

- Priority: P0
- Preconditions: Start at `/`.
- Steps:
  1. Load `/`.
  2. Verify devrel-only nav item "Projects" is visible and "Papers"/"Gallery"
     (math labels) are not.
  3. Click the persona toggle ("Visit the other side").
  4. Wait for the transition overlay to finish.
- Expected result: URL becomes `/math`; nav shows "Papers" (not "Work") and
  "Gallery" (not "Writing"); "Projects" is no longer present; hero copy
  reflects the math persona ("Mathematician & Astrophotographer" role).
- Edge cases: none beyond the reverse direction (separate journey below).
- Out of scope: the transition animation's visual correctness (covered by
  `review design`, not this functional test).

### Math → Devrel

- Priority: P0
- Preconditions: Start at `/math`.
- Steps:
  1. Load `/math`.
  2. Verify nav shows "Papers" and "Gallery", and no "Projects" item.
  3. Click the persona toggle.
  4. Wait for the transition overlay to finish.
- Expected result: URL becomes `/`; nav shows "Work", "Projects", and
  "Writing"; hero copy reflects the devrel persona ("Developer Relations &
  Technical Content" role).
- Edge cases: none.
- Out of scope: same as above.

## Test Data

None — no created records; the test only reads whichever content Strapi
currently serves and asserts on persona-toggle-driven UI, not content
correctness.

## Assertions

- Nav item text differs correctly per persona (Work/Papers, Writing/Gallery,
  Projects present only on devrel).
- URL path matches the active persona after toggling, in both directions.
- Hero role/tagline text matches the active persona after toggling.

## Cleanup

None.

## Implementation Plan

- Test files: `tests/persona-toggle.test.yaml`
- Implementation order: single file, two journeys (one per direction) —
  either two `statements` blocks in one suite, or two single-test files if a
  suite adds no shared setup value here.
- Flakiness risks: the transition overlay is timed (~550ms hold + ~1.1s
  shatter/fade, see `PersonaTransition.tsx`); assert post-toggle state with a
  `VERIFY`/`WAIT_UNTIL` on the resulting URL or content rather than a fixed
  `WAIT`, so timing changes to the animation don't need the test updated.
- Data setup: none.

## Implementation

- Test files: `tests/persona-toggle.test.yaml`
- Coverage: both directions (devrel→math, math→devrel) in one test —
  nav-label swap, "Projects" appearing only on devrel, hero role text, and
  URL sync, verified after each toggle. Toggle button located via
  `getByRole('button', { name: 'Visit the other side' })`; nav checks scoped
  to `getByRole('banner')` with `exact: true` (see
  `knowledge/nav-locator-pattern.md` for why). Confirmed passing with 0
  self-heals against local dev (pointed at production Strapi).
- Known gaps: hero role text assertions use natural-language `VERIFY` (no
  stable locator/test-id on that `<p>` in `Hero.tsx`) — self-heals but isn't
  the fast deterministic path. Doesn't cover the transition animation's
  visual correctness (out of scope, see above) or mobile viewport nav
  (desktop only).

## Notes

- Local dev requires Strapi reachable — `frontend/.env.local` was
  temporarily pointed at the production Railway Strapi
  (`strapi-production-410d.up.railway.app`) instead of an unreachable local
  instance (no local Postgres running). Confirm with the user whether to
  keep this or revert once local Strapi is available. See
  `knowledge/local-dev-setup.md`.
- An unrelated pre-existing React console error ("Encountered two children
  with the same key") appeared during the walk on both `/` and `/math` —
  likely a duplicate `documentId` in Strapi-backed list data (not caused by
  this test). Worth a product-side look; not investigated further here as
  it didn't affect this test's assertions.
