import { defineConfig, shiplightConfig } from 'shiplightai';

// testDir '.' scans the whole project; shiplightConfig() defaults its YAML scan
// to the same project root, so nothing extra is needed here. If you narrow
// testDir to a subfolder, pass the same path as scanDir so the two stay in sync:
//   const testDir = './e2e';
//   export default defineConfig({ ...shiplightConfig({ scanDir: testDir }), testDir, ... });
export default defineConfig({
  ...shiplightConfig(),
  testDir: '.',
  testMatch: ['**/*.test.ts', '**/*.yaml.spec.ts'],
  timeout: 120_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15_000,
    video: 'on',
    screenshot: 'on',
    trace: 'on',
  },
  // Tests target http://localhost:3000 (see base_url in tests/*.test.yaml) —
  // start the Next.js frontend ourselves rather than assume it's already
  // running. It fetches from Strapi at request time with no error handling
  // for an unreachable backend (see HomeSections.tsx), so point it at the
  // real production Strapi rather than a local instance CI doesn't have —
  // same public, read-only API URL already used by the frontend's own
  // build step in .github/workflows/ci.yml.
  webServer: {
    command: 'npm run dev',
    cwd: '../frontend',
    url: 'http://localhost:3000',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: {
      STRAPI_URL: process.env.STRAPI_URL ?? 'https://strapi.abhattacharyea.dev',
      NEXT_PUBLIC_STRAPI_URL:
        process.env.NEXT_PUBLIC_STRAPI_URL ?? 'https://strapi.abhattacharyea.dev',
    },
  },
});
