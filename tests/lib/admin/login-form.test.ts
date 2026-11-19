import { describe, expect, it } from "vitest";
import { INITIAL_LOGIN_STATE, loginErrorMessage, parseLoginForm } from "@/lib/admin/login-form";

function formWith(values: Record<string, string>): FormData {
  const formData = new FormData();
  Object.entries(values).forEach(([name, value]) => formData.set(name, value));
  return formData;
}

describe("parseLoginForm", () => {
  it("returns the trimmed email and the password as typed", () => {
    expect(parseLoginForm(formWith({ email: "  admin@contoh.id ", password: " rahasia " }))).toEqual({
      email: "admin@contoh.id",
      password: " rahasia ",
    });
  });

  it.each([
    [{ email: "", password: "x" }, "Email wajib diisi."],
    [{ email: "bukan-email", password: "x" }, "Format email belum benar."],
    [{ email: "a@b.id", password: "" }, "Password wajib diisi."],
    [{}, "Email wajib diisi."],
  ])("rejects %j", (values, message) => {
    expect(parseLoginForm(formWith(values))).toEqual({ error: message });
  });
});

describe("loginErrorMessage", () => {
  it.each([
    ["invalid_credentials", "Email atau password salah."],
    ["over_request_rate_limit", "Terlalu banyak percobaan. Coba lagi beberapa menit lagi."],
    ["unexpected_failure", "Login gagal. Coba lagi."],
    [undefined, "Login gagal. Coba lagi."],
  ])("maps %s", (code, message) => {
    expect(loginErrorMessage(code)).toBe(message);
  });
});

describe("INITIAL_LOGIN_STATE", () => {
  it("starts without an error or an email", () => {
    expect(INITIAL_LOGIN_STATE).toEqual({ error: null, email: "" });
  });
});
