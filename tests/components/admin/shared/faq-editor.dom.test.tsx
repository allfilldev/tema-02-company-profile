import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FaqEditor } from "@/components/admin/shared/faq-editor";

function fieldNames(container: HTMLElement): string[] {
  return [...container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea")].map((element) => element.name);
}

describe("FaqEditor", () => {
  const initial = [
    { question: "Apa itu SOP?", answer: "Panduan kerja." },
    { question: "Siapa menulis?", answer: "Pelaku proses." },
  ];

  it("names the inputs by position so the form reader can parse them", () => {
    const { container } = render(<FaqEditor initial={initial} />);

    expect(fieldNames(container)).toEqual(["faq[0][question]", "faq[0][answer]", "faq[1][question]", "faq[1][answer]"]);
    expect((screen.getByLabelText("Pertanyaan 1") as HTMLInputElement).value).toBe("Apa itu SOP?");
  });

  it("adds an empty entry and renumbers the names after a delete", async () => {
    const { container } = render(<FaqEditor initial={initial} />);

    await userEvent.click(screen.getByRole("button", { name: "Tambah pertanyaan" }));
    expect(fieldNames(container)).toHaveLength(6);

    await userEvent.click(screen.getAllByRole("button", { name: /^Hapus pertanyaan/ })[0]);
    expect(fieldNames(container)).toEqual(["faq[0][question]", "faq[0][answer]", "faq[1][question]", "faq[1][answer]"]);
    expect((screen.getByLabelText("Pertanyaan 1") as HTMLInputElement).value).toBe("Siapa menulis?");
  });

  it("moves an entry down", async () => {
    render(<FaqEditor initial={initial} />);

    await userEvent.click(screen.getAllByRole("button", { name: /^Turunkan pertanyaan/ })[0]);

    expect((screen.getByLabelText("Pertanyaan 1") as HTMLInputElement).value).toBe("Siapa menulis?");
    expect((screen.getByLabelText("Pertanyaan 2") as HTMLInputElement).value).toBe("Apa itu SOP?");
  });

  it("tells the surrounding form that its content changed when a question is added", async () => {
    const onInput = vi.fn();
    render(
      <form onInput={onInput}>
        <FaqEditor initial={[]} />
      </form>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Tambah pertanyaan" }));

    expect(onInput).toHaveBeenCalled();
  });
});
