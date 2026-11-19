import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

const DOM_TEST_PATTERN = "tests/**/*.dom.test.tsx";
const SETUP_FILES = ["tests/setup/next-mocks.ts"];

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["tests/**/*.test.{ts,tsx}"],
          exclude: [...configDefaults.exclude, DOM_TEST_PATTERN],
          setupFiles: SETUP_FILES,
        },
      },
      {
        extends: true,
        test: {
          name: "dom",
          environment: "jsdom",
          include: [DOM_TEST_PATTERN],
          setupFiles: [...SETUP_FILES, "tests/setup/dom-cleanup.ts"],
        },
      },
    ],
  },
});
