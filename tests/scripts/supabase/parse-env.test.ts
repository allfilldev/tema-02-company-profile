import { describe, expect, it } from "vitest";
import { parseEnvFile } from "../../../scripts/lib/parse-env";

describe("parseEnvFile", () => {
  it("reads plain, quoted, and spaced entries and skips comments and blank lines", () => {
    const text = ["# komentar", "", "A=1", 'B="dua tiga"', "C='empat'", "  D = lima  ", "E=", "tanpa-sama-dengan"].join("\n");

    expect(parseEnvFile(text)).toEqual({ A: "1", B: "dua tiga", C: "empat", D: "lima", E: "" });
  });

  it("keeps equals signs inside the value", () => {
    expect(parseEnvFile("URL=postgres://u:p@h/db?sslmode=require")).toEqual({ URL: "postgres://u:p@h/db?sslmode=require" });
  });
});
