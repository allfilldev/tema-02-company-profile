import { describe, expect, it } from "vitest";
import { clientIpFrom, hashIp } from "@/lib/site/ip-hash";

describe("hashIp", () => {
  it("is deterministic and 64 hex characters", () => {
    const first = hashIp("203.0.113.7", "garam");

    expect(first).toBe(hashIp("203.0.113.7", "garam"));
    expect(first).toMatch(/^[0-9a-f]{64}$/);
  });

  it("differs per ip and per salt and never contains the raw ip", () => {
    expect(hashIp("203.0.113.7", "garam")).not.toBe(hashIp("203.0.113.8", "garam"));
    expect(hashIp("203.0.113.7", "garam")).not.toBe(hashIp("203.0.113.7", "lain"));
    expect(hashIp("203.0.113.7", "garam")).not.toContain("203.0.113.7");
  });

  it("refuses an empty salt", () => {
    expect(() => hashIp("203.0.113.7", "")).toThrow(/salt/);
  });
});

describe("clientIpFrom", () => {
  it("takes the first forwarded address", () => {
    expect(clientIpFrom(new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }))).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip and then to unknown", () => {
    expect(clientIpFrom(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(clientIpFrom(new Headers())).toBe("unknown");
  });
});
