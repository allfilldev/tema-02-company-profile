import { describe, expect, it } from "vitest";
import { buildMessageActivity } from "@/core/application/admin/message-activity";

const TODAY = new Date("2026-11-19T05:00:00.000Z");

describe("buildMessageActivity", () => {
  it("returns 14 ascending days by default ending on today in Jakarta", () => {
    const result = buildMessageActivity([], TODAY);

    expect(result).toHaveLength(14);
    expect(result[0].date).toBe("2026-11-06");
    expect(result[13].date).toBe("2026-11-19");
  });

  it("returns all zeros for empty input", () => {
    expect(buildMessageActivity([], TODAY).every((entry) => entry.count === 0)).toBe(true);
  });

  it("counts messages per Jakarta day and zero-fills the rest", () => {
    const result = buildMessageActivity(
      [{ createdAt: "2026-11-19T01:00:00.000Z" }, { createdAt: "2026-11-19T02:00:00.000Z" }, { createdAt: "2026-11-17T10:00:00.000Z" }],
      TODAY,
    );

    expect(result.find((entry) => entry.date === "2026-11-19")?.count).toBe(2);
    expect(result.find((entry) => entry.date === "2026-11-17")?.count).toBe(1);
    expect(result.find((entry) => entry.date === "2026-11-18")?.count).toBe(0);
  });

  it("assigns a late UTC message to the next Jakarta day", () => {
    const result = buildMessageActivity([{ createdAt: "2026-11-18T18:30:00.000Z" }], TODAY);

    expect(result.find((entry) => entry.date === "2026-11-19")?.count).toBe(1);
    expect(result.find((entry) => entry.date === "2026-11-18")?.count).toBe(0);
  });

  it("ignores messages outside the range and invalid dates", () => {
    const result = buildMessageActivity([{ createdAt: "2026-10-01T00:00:00.000Z" }, { createdAt: "2026-12-01T00:00:00.000Z" }, { createdAt: "not a date" }], TODAY);

    expect(result.reduce((sum, entry) => sum + entry.count, 0)).toBe(0);
  });

  it("honours a custom number of days", () => {
    expect(buildMessageActivity([], TODAY, 7)).toHaveLength(7);
  });
});
