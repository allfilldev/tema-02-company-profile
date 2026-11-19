import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm, ContactFormFields, ContactFormStatus } from "@/components/site/sections/contact-form";
import { DEMO_SUBMIT_MESSAGE, EMPTY_CONTACT_FORM_VALUES, type ContactFormErrors } from "@/lib/site/contact-form";

const WHATSAPP_URL = "https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20bertanya";
const FIELD_IDS = ["kontak-nama", "kontak-email", "kontak-telepon", "kontak-pesan"];

const FULL_ERRORS: ContactFormErrors = {
  name: "Nama wajib diisi.",
  email: "Email wajib diisi.",
  phone: "Nomor telepon hanya boleh berisi angka, spasi, dan tanda + - ( ).",
  message: "Pesan wajib diisi.",
};

function renderFields(errors: ContactFormErrors): string {
  return renderToStaticMarkup(
    <ContactFormFields values={EMPTY_CONTACT_FORM_VALUES} errors={errors} onChange={() => undefined} disabled={false} />,
  );
}

function findTag(markup: string, tagName: string, id: string): string {
  const tag = [...markup.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "g"))].map((match) => match[0]).find((candidate) => candidate.includes(`id="${id}"`));
  if (!tag) {
    throw new Error(`No <${tagName}> with id ${id}`);
  }
  return tag;
}

function hasAttribute(tag: string, name: string): boolean {
  return new RegExp(`\\s${name}(=|\\s|/|>)`, "i").test(tag);
}

function attributeValue(tag: string, name: string): string | null {
  return new RegExp(`\\s${name}="([^"]*)"`, "i").exec(tag)?.[1] ?? null;
}

function textOf(markup: string): string {
  return markup.replace(/<[^>]*>/g, "");
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ContactFormFields", () => {
  it("renders a label bound to every control", () => {
    const markup = renderFields({});

    for (const id of FIELD_IDS) {
      expect(markup).toContain(`for="${id}"`);
      expect(markup).toMatch(new RegExp(`<(input|textarea)\\b[^>]*id="${id}"`));
    }
    for (const label of ["Nama", "Email", "Telepon", "Pesan"]) {
      expect(markup).toContain(label);
    }
  });

  it("uses the right control types, names, and autocomplete hints", () => {
    const markup = renderFields({});

    expect(attributeValue(findTag(markup, "input", "kontak-nama"), "autocomplete")).toBe("name");
    expect(attributeValue(findTag(markup, "input", "kontak-email"), "type")).toBe("email");
    expect(attributeValue(findTag(markup, "input", "kontak-telepon"), "type")).toBe("tel");
    expect(attributeValue(findTag(markup, "textarea", "kontak-pesan"), "name")).toBe("message");
  });

  it("marks name, email, and message as required and the phone as optional", () => {
    const markup = renderFields({});

    expect(hasAttribute(findTag(markup, "input", "kontak-nama"), "required")).toBe(true);
    expect(hasAttribute(findTag(markup, "input", "kontak-email"), "required")).toBe(true);
    expect(hasAttribute(findTag(markup, "textarea", "kontak-pesan"), "required")).toBe(true);
    expect(hasAttribute(findTag(markup, "input", "kontak-telepon"), "required")).toBe(false);
  });

  it("has no invalid state or error text while there are no errors", () => {
    const markup = renderFields({});

    for (const tag of [...markup.matchAll(/<(?:input|textarea)\b[^>]*>/g)].map((match) => match[0])) {
      expect(hasAttribute(tag, "aria-invalid")).toBe(false);
      expect(hasAttribute(tag, "aria-describedby")).toBe(false);
    }
    expect(markup).not.toContain('role="alert"');
  });

  it("links every erroring control to its message with aria-invalid and aria-describedby", () => {
    const markup = renderFields(FULL_ERRORS);

    for (const id of FIELD_IDS) {
      const control = findTag(markup, id === "kontak-pesan" ? "textarea" : "input", id);
      expect(attributeValue(control, "aria-invalid"), id).toBe("true");
      expect(attributeValue(control, "aria-describedby"), id).toBe(`${id}-error`);
      expect(markup, id).toMatch(new RegExp(`<p id="${id}-error" role="alert"[^>]*>[^<]+</p>`));
    }
    expect(markup).toContain("Nama wajib diisi.");
    expect(markup).toContain("Pesan wajib diisi.");
  });

  it("flags only the fields that have an error", () => {
    const markup = renderFields({ email: "Email wajib diisi." });

    expect(attributeValue(findTag(markup, "input", "kontak-email"), "aria-invalid")).toBe("true");
    expect(hasAttribute(findTag(markup, "input", "kontak-nama"), "aria-invalid")).toBe(false);
    expect(hasAttribute(findTag(markup, "textarea", "kontak-pesan"), "aria-invalid")).toBe(false);
    expect(markup).not.toContain('id="kontak-nama-error"');
  });
});

describe("ContactFormStatus", () => {
  it("renders an empty polite live region while idle", () => {
    const markup = renderToStaticMarkup(<ContactFormStatus status="idle" whatsappUrl={WHATSAPP_URL} />);

    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-live="polite"');
    expect(textOf(markup)).toBe("");
  });

  it("shows the demo message with a safe link to WhatsApp", () => {
    const markup = renderToStaticMarkup(<ContactFormStatus status="demo" whatsappUrl={WHATSAPP_URL} />);

    expect(textOf(markup)).toBe(DEMO_SUBMIT_MESSAGE);
    const anchor = markup.match(/<a\b[^>]*>[^<]*<\/a>/)?.[0] ?? "";
    expect(anchor).toContain(`href="${WHATSAPP_URL}"`);
    expect(anchor).toContain('rel="noopener noreferrer"');
    expect(anchor).toContain('target="_blank"');
    expect(anchor).toContain(">WhatsApp<");
  });

  it("shows the failure message with a WhatsApp link and the success message without one", () => {
    const failed = renderToStaticMarkup(<ContactFormStatus status="failed" whatsappUrl={WHATSAPP_URL} />);
    const sent = renderToStaticMarkup(<ContactFormStatus status="sent" whatsappUrl={WHATSAPP_URL} />);

    expect(textOf(failed)).toContain("belum terkirim");
    expect(failed).toContain(`href="${WHATSAPP_URL}"`);

    const limited = renderToStaticMarkup(<ContactFormStatus status="rate-limited" whatsappUrl={WHATSAPP_URL} />);
    expect(textOf(limited)).toContain("Terlalu banyak pesan dari jaringan Anda");
    expect(limited).toContain(`href="${WHATSAPP_URL}"`);
    expect(textOf(sent)).toContain("Terima kasih");
    expect(sent).not.toContain("<a");
  });
});

describe("ContactForm", () => {
  it("renders every label and a submit button without any network action in demo mode", () => {
    const markup = renderToStaticMarkup(<ContactForm isDemo whatsappUrl={WHATSAPP_URL} />);

    expect(markup).toContain("<form");
    const form = markup.match(/<form\b[^>]*>/)?.[0] ?? "";
    expect(hasAttribute(form, "novalidate")).toBe(true);
    expect(hasAttribute(form, "action")).toBe(false);
    expect(hasAttribute(form, "method")).toBe(false);
    for (const id of FIELD_IDS) {
      expect(markup).toContain(`for="${id}"`);
    }
    const submit = markup.match(/<button\b[^>]*type="submit"[^>]*>/)?.[0] ?? "";
    expect(submit).not.toBe("");
    expect(hasAttribute(submit, "disabled")).toBe(false);
    expect(markup).not.toContain(DEMO_SUBMIT_MESSAGE);
  });

  it("disables the submit button outside demo mode when no handler is wired", () => {
    const markup = renderToStaticMarkup(<ContactForm isDemo={false} whatsappUrl={WHATSAPP_URL} />);

    const submit = markup.match(/<button\b[^>]*type="submit"[^>]*>/)?.[0] ?? "";
    expect(hasAttribute(submit, "disabled")).toBe(true);
    expect(markup).toContain(`href="${WHATSAPP_URL}"`);
  });

  it("enables the submit button outside demo mode when a handler is wired", () => {
    const markup = renderToStaticMarkup(<ContactForm isDemo={false} whatsappUrl={WHATSAPP_URL} onSubmit={async () => undefined} />);

    const submit = markup.match(/<button\b[^>]*type="submit"[^>]*>/)?.[0] ?? "";
    expect(submit).not.toBe("");
    expect(hasAttribute(submit, "disabled")).toBe(false);
  });

  it("does not call fetch while rendering", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    renderToStaticMarkup(<ContactForm isDemo whatsappUrl={WHATSAPP_URL} />);

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
