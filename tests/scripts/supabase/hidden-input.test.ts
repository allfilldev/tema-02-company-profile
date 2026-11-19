import { describe, expect, it } from "vitest";
import { applyKeystrokes, INITIAL_HIDDEN_INPUT } from "../../../scripts/supabase/hidden-input";

function type(...chunks: string[]) {
  return chunks.reduce((state, chunk) => applyKeystrokes(state, chunk), INITIAL_HIDDEN_INPUT);
}

describe("applyKeystrokes", () => {
  it("collects typed characters and finishes on enter", () => {
    expect(type("rahasia-panjang", "\r")).toEqual({ value: "rahasia-panjang", done: true, cancelled: false });
  });

  it("accepts characters one per chunk", () => {
    expect(type("a", "b", "c", "\n").value).toBe("abc");
  });

  it("ignores an enter that arrives before any character, such as a stale keypress", () => {
    const state = type("\r", "\n");

    expect(state.done).toBe(false);
    expect(type("\r", "kata-sandi-12345", "\r").value).toBe("kata-sandi-12345");
  });

  it("handles backspace", () => {
    expect(type("abcd", "\u007f", "\b", "x", "\r").value).toBe("abx");
  });

  it("strips escape sequences from arrow keys and bracketed paste", () => {
    expect(type("\u001b[200~kata-sandi-12345\u001b[201~", "\u001b[A", "\r").value).toBe("kata-sandi-12345");
  });

  it("stops and flags a cancel on ctrl-c", () => {
    expect(type("abc", "\u0003")).toEqual({ value: "abc", done: true, cancelled: true });
  });

  it("ignores input after it is done", () => {
    expect(type("abc", "\r", "zzz").value).toBe("abc");
  });
});
