import { describe, expect, it } from "vitest";
import { decideAdminAccess } from "@/lib/site/admin-access";

describe("decideAdminAccess", () => {
  it.each(["/admin", "/admin/layanan", "/admin/login"])("hides %s in demo mode, with or without a session", (pathname) => {
    expect(decideAdminAccess({ pathname, isDemo: true, hasSession: false })).toBe("not-found");
    expect(decideAdminAccess({ pathname, isDemo: true, hasSession: true })).toBe("not-found");
  });

  it.each(["/admin", "/admin/layanan", "/admin/artikel/baru"])("sends %s to the login page without a session", (pathname) => {
    expect(decideAdminAccess({ pathname, isDemo: false, hasSession: false })).toBe("login");
  });

  it.each(["/admin", "/admin/layanan"])("allows %s with a session", (pathname) => {
    expect(decideAdminAccess({ pathname, isDemo: false, hasSession: true })).toBe("allow");
  });

  it("always allows the login page outside demo mode so it cannot lock itself out", () => {
    expect(decideAdminAccess({ pathname: "/admin/login", isDemo: false, hasSession: false })).toBe("allow");
    expect(decideAdminAccess({ pathname: "/admin/login", isDemo: false, hasSession: true })).toBe("allow");
  });
});
