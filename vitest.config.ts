import { defineConfig } from "vitest/config";

/**
 * `@mongez/supportive-is` has no `@mongez/*` runtime dependencies, so there
 * are no sibling aliases to self-detect — the predicates are pure JS apart
 * from a handful of DOM-touching helpers (`isFormElement`, `isFormData`,
 * `isBrowser`, `isMobile`, `isMac`, `isDesktop`, `isIE`, `isEdge`, …).
 *
 * Those need `window`, `document`, `navigator`, and a few constructors
 * (`FormData`, `HTMLFormElement`) at module-evaluation and call time. We run
 * the whole suite under `happy-dom` so every test file gets the same global
 * scope; the pure predicates don't care, and the browser-only ones get a
 * working `window`.
 */
export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: false,
    include: ["src/**/*.test.ts"],
  },
});
