import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AdminError from "../../../src/app/admin/(panel)/error";

describe("admin error boundary", () => {
  it("shows a plain Indonesian message and retries when asked", async () => {
    const reset = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(<AdminError error={new Error("boom")} reset={reset} />);

    expect(screen.getByRole("alert").textContent).toContain("Terjadi kesalahan");
    expect(screen.getByRole("alert").textContent).not.toContain("boom");

    await userEvent.click(screen.getByRole("button", { name: "Coba lagi" }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
