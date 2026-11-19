import { describe, expect, it } from "vitest";
import { formatNextSteps } from "../../../scripts/theme/next-steps";

describe("formatNextSteps", () => {
  const lines = formatNextSteps("/work/my themes/contoh");

  it("quotes the folder so paths with spaces still work", () => {
    expect(lines).toContain('  cd "/work/my themes/contoh"');
  });

  it("installs dependencies and points to the theme guide", () => {
    expect(lines).toContain("  npm install");
    expect(lines.join("\n")).toContain("THEME.md");
  });

  it("does not tell the user to start the dev server from a shell", () => {
    expect(lines.join("\n")).not.toContain("npm run dev");
  });
});
