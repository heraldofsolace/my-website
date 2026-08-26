# Nav-link locators must be scoped and exact

Plain `page.getByRole('link', { name: '<Label>' })` for a nav item (e.g.
"Work", "Projects", "Gallery") is not safe on this site: `getByRole`'s `name`
match is case-insensitive substring by default, and the home page renders
real Strapi-backed content below the nav (blog post titles, CTAs like "See my
work") that can substring-match a plain nav label — e.g. "Work" matched a
blog post link titled "...Ruby Frameworks..." (contains "work") and the CTA
"See my work", producing a Playwright strict-mode violation (3 elements).

Pattern that avoids it: scope to the header landmark and require an exact
match —

```js
const nav = page.getByRole('banner') // <header> in Nav.tsx
await expect(nav.getByRole('link', { name: 'Work', exact: true })).toBeVisible()
```

Applies to any test asserting on `Nav.tsx` link text, not just the persona
toggle. See `specs/tests/persona-toggle.md`.
