import { describe, expect, it } from "vitest";
import { buildMessageActivity, buildMessageHeatmap, computeTrendPercent } from "@/core/application/admin/message-activity";

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

describe("buildMessageHeatmap", () => {
  it("returns 7 rows of 8 zeros for empty input", () => {
    const grid = buildMessageHeatmap([]);

    expect(grid).toHaveLength(7);
    expect(grid.every((row) => row.length === 8 && row.every((cell) => cell === 0))).toBe(true);
  });

  it("puts a Monday 00:30 Jakarta message in row 0, column 0", () => {
    const grid = buildMessageHeatmap([{ createdAt: "2026-11-15T17:30:00.000Z" }]);

    expect(grid[0][0]).toBe(1);
  });

  it("puts a Sunday 23:59 Jakarta message in row 6, column 7", () => {
    const grid = buildMessageHeatmap([{ createdAt: "2026-11-22T16:59:00.000Z" }]);

    expect(grid[6][7]).toBe(1);
  });

  it("groups hours in three-hour columns and counts repeats", () => {
    const grid = buildMessageHeatmap([
      { createdAt: "2026-11-17T02:00:00.000Z" },
      { createdAt: "2026-11-17T04:59:00.000Z" },
      { createdAt: "2026-11-17T05:00:00.000Z" },
    ]);

    expect(grid[1][3]).toBe(2);
    expect(grid[1][4]).toBe(1);
  });

  it("ignores invalid dates", () => {
    const grid = buildMessageHeatmap([{ createdAt: "nope" }]);

    expect(grid.flat().reduce((sum, cell) => sum + cell, 0)).toBe(0);
  });
});

describe("computeTrendPercent", () => {
  it("is zero without data", () => {
    expect(computeTrendPercent([])).toBe(0);
    expect(computeTrendPercent(new Array(14).fill(0))).toBe(0);
  });

  it("compares the latest week with the week before", () => {
    const counts = [...new Array(7).fill(1), ...new Array(7).fill(2)];

    expect(computeTrendPercent(counts)).toBe(100);
    expect(computeTrendPercent([...new Array(7).fill(2), ...new Array(7).fill(1)])).toBe(-50);
  });

  it("returns 100 when the earlier week was empty and the latest was not", () => {
    expect(computeTrendPercent([...new Array(7).fill(0), 1, 0, 0, 0, 0, 0, 0])).toBe(100);
  });
});
