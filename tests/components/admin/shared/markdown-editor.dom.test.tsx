import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MarkdownEditor } from "@/components/admin/shared/markdown-editor";

const media = [{ id: "m1", url: "/demo/a.webp", alt: "Tim rapat", width: 800, height: 600 }];

function textarea(): HTMLTextAreaElement {
  return screen.getByLabelText("Isi") as HTMLTextAreaElement;
}

describe("MarkdownEditor", () => {
  it("submits the text under its field name and keeps it when switching to the preview and back", async () => {
    render(<MarkdownEditor name="bodyMd" label="Isi" initial="## Judul" media={media} />);

    expect(textarea().name).toBe("bodyMd");
    await userEvent.click(screen.getByRole("tab", { name: "Pratinjau" }));
    expect(screen.getByRole("tabpanel", { name: "Pratinjau" }).querySelector("h2")?.textContent).toBe("Judul");
    expect(textarea().value).toBe("## Judul");
    await userEvent.click(screen.getByRole("tab", { name: "Tulis" }));
    expect(textarea().value).toBe("## Judul");
  });

  it("inserts the chosen image with its alt and caption at the cursor", async () => {
    render(<MarkdownEditor name="bodyMd" label="Isi" initial="Awal  akhir" media={media} />);

    textarea().focus();
    textarea().setSelectionRange(5, 5);
    await userEvent.type(screen.getByLabelText("Keterangan gambar (opsional)"), "Rapat tim");
    await userEvent.click(screen.getByRole("button", { name: "Sisipkan gambar" }));
    await userEvent.click(screen.getByRole("button", { name: "Tim rapat" }));

    expect(textarea().value).toBe('Awal ![Tim rapat](/demo/a.webp "Rapat tim") akhir');
  });

  it("leaves out the title when no caption was typed", async () => {
    render(<MarkdownEditor name="bodyMd" label="Isi" initial="" media={media} />);

    await userEvent.click(screen.getByRole("button", { name: "Sisipkan gambar" }));
    await userEvent.click(screen.getByRole("button", { name: "Tim rapat" }));

    expect(textarea().value).toBe("![Tim rapat](/demo/a.webp)");
  });

  it("tells the surrounding form that its content changed after an image is inserted", async () => {
    const onInput = vi.fn();
    render(
      <form onInput={onInput}>
        <MarkdownEditor name="bodyMd" label="Isi" initial="" media={media} />
      </form>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Sisipkan gambar" }));
    await userEvent.click(screen.getByRole("button", { name: "Tim rapat" }));

    expect(onInput).toHaveBeenCalled();
  });
});
