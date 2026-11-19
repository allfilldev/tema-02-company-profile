import { createHash } from "node:crypto";

const UNKNOWN_IP = "unknown";

export function hashIp(ip: string, salt: string): string {
  if (salt.length === 0) {
    throw new Error("A salt is required to hash an ip address");
  }
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) {
    return forwarded;
  }
  return headers.get("x-real-ip")?.trim() || UNKNOWN_IP;
}
