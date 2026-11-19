import { describe, expect, it } from "vitest";
import { INVALID_MESSAGE, invalidState } from "@/lib/admin/form-state";

describe("invalidState", () => {
  it("does not repeat the generic message as a blocking reason", () => {
    const state = invalidState({ fieldErrors: { title: "Isi judul." }, blocking: [INVALID_MESSAGE, "Meta title terlalu panjang."], warnings: [] }, {});

    expect(state.message).toBe(INVALID_MESSAGE);
    expect(state.blocking).toEqual(["Meta title terlalu panjang."]);
  });
});
