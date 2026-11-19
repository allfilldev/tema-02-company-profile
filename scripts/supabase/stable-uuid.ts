import { createHash } from "node:crypto";

const NAMESPACE = "6f1c2d3e-4b5a-4c6d-8e7f-9a0b1c2d3e4f";

function uuidBytes(uuid: string): Buffer {
  return Buffer.from(uuid.replace(/-/g, ""), "hex");
}

function formatUuid(bytes: Buffer): string {
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

export function stableUuid(kind: string, id: string): string {
  const hash = createHash("sha1")
    .update(Buffer.concat([uuidBytes(NAMESPACE), Buffer.from(`${kind}:${id}`)]))
    .digest();
  const bytes = Buffer.from(hash.subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return formatUuid(bytes);
}
