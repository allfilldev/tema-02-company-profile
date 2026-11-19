import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SlugField } from "@/components/admin/forms/item-fields";
import { ItemFormShell } from "@/components/admin/forms/item-form-shell";
import { INITIAL_ADMIN_FORM_STATE } from "@/lib/admin/form-state";

function renderForm(isPublished: boolean) {
  return render(
    <ItemFormShell
      action={async () => INITIAL_ADMIN_FORM_STATE}
      initial={{ slug: "penyusunan-sop" }}
      media={[]}
      isPublishable
      isPublished={isPublished}
      cancelHref="/admin/layanan"
    >
      <SlugField />
    </ItemFormShell>,
  );
}

describe("slug field", () => {
  it("warns that the old URL becomes a 404 when the slug of a published item changes", async () => {
    renderForm(true);

    expect(screen.queryByText("URL lama akan menjadi 404.")).toBeNull();

    await userEvent.type(screen.getByLabelText(/Slug/), "-baru");

    expect(screen.getByText("URL lama akan menjadi 404.")).toBeTruthy();
  });

  it("does not warn when the item is still a draft", async () => {
    renderForm(false);

    await userEvent.type(screen.getByLabelText(/Slug/), "-baru");

    expect(screen.queryByText("URL lama akan menjadi 404.")).toBeNull();
  });
});
