import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("dom test project", () => {
  it("provides a document and runs user events", async () => {
    const onClick = vi.fn();
    render(<button onClick={onClick}>Simpan</button>);

    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));

    expect(typeof document).toBe("object");
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
