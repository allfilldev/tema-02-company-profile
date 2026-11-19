import { describe, expect, it } from "vitest";
import { validateAdminEmail, validateAdminPassword } from "../../../scripts/supabase/admin-input";

describe("validateAdminEmail", () => {
  it("accepts a normal email and rejects anything else", () => {
    expect(validateAdminEmail("admin@contoh.id")).toBeNull();
    expect(typeof validateAdminEmail("")).toBe("string");
    expect(typeof validateAdminEmail("bukan-email")).toBe("string");
  });
});

describe("validateAdminPassword", () => {
  it("requires at least 12 characters", () => {
    expect(validateAdminPassword("pendek", "pendek")).toMatch(/12/);
    expect(validateAdminPassword("123456789012", "123456789012")).toBeNull();
  });

  it("requires the confirmation to match", () => {
    expect(validateAdminPassword("kata-sandi-panjang", "kata-sandi-lain")).toMatch(/sama|match/i);
  });
});
