import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CONTACT_FORM_LIMITS,
  DEMO_SUBMIT_MESSAGE,
  decideContactSubmit,
  EMPTY_CONTACT_FORM_VALUES,
  firstInvalidField,
  submitContactForm,
  validateContactForm,
  type ContactFormValues,
} from "@/lib/site/contact-form";

const VALID_VALUES: ContactFormValues = {
  name: "Rina Wulandari",
  email: "rina@perusahaan.example",
  phone: "",
  message: "Kami ingin berdiskusi tentang penyusunan SOP untuk tiga cabang.",
};

function withValues(overrides: Partial<ContactFormValues>): ContactFormValues {
  return { ...VALID_VALUES, ...overrides };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("validateContactForm", () => {
  it("accepts a complete form and treats the phone number as optional", () => {
    expect(validateContactForm(VALID_VALUES)).toEqual({});
    expect(validateContactForm(withValues({ phone: "+62 812-3456-7890" }))).toEqual({});
  });

  it("requires name, email, and message with Indonesian messages", () => {
    const errors = validateContactForm(EMPTY_CONTACT_FORM_VALUES);

    expect(errors.name).toBe("Nama wajib diisi.");
    expect(errors.email).toBe("Email wajib diisi.");
    expect(errors.message).toBe("Pesan wajib diisi.");
    expect(errors.phone).toBeUndefined();
  });

  it("treats whitespace-only values as empty", () => {
    const errors = validateContactForm({ name: "   ", email: "  ", phone: "   ", message: "\n\t " });

    expect(Object.keys(errors).sort()).toEqual(["email", "message", "name"]);
  });

  it("rejects malformed email addresses", () => {
    for (const email of ["rina", "rina@", "@perusahaan.example", "rina@perusahaan", "rina @perusahaan.example"]) {
      expect(validateContactForm(withValues({ email })).email, email).toBe(
        "Format email belum benar, contoh: nama@perusahaan.com.",
      );
    }
    expect(validateContactForm(withValues({ email: "rina@perusahaan.co.id" })).email).toBeUndefined();
  });

  it("rejects values beyond the length limits", () => {
    const tooLongName = "a".repeat(CONTACT_FORM_LIMITS.nameMax + 1);
    const tooLongMessage = "a".repeat(CONTACT_FORM_LIMITS.messageMax + 1);
    const tooLongEmail = `${"a".repeat(CONTACT_FORM_LIMITS.emailMax)}@perusahaan.example`;

    expect(validateContactForm(withValues({ name: tooLongName })).name).toBe(
      `Nama terlalu panjang, maksimal ${CONTACT_FORM_LIMITS.nameMax} karakter.`,
    );
    expect(validateContactForm(withValues({ message: tooLongMessage })).message).toBe(
      `Pesan terlalu panjang, maksimal ${CONTACT_FORM_LIMITS.messageMax} karakter.`,
    );
    expect(validateContactForm(withValues({ email: tooLongEmail })).email).toBe(
      `Email terlalu panjang, maksimal ${CONTACT_FORM_LIMITS.emailMax} karakter.`,
    );
  });

  it("accepts values exactly at the length limits", () => {
    const errors = validateContactForm(
      withValues({
        name: "a".repeat(CONTACT_FORM_LIMITS.nameMax),
        message: "a".repeat(CONTACT_FORM_LIMITS.messageMax),
      }),
    );

    expect(errors).toEqual({});
  });

  it("rejects names and messages that are too short", () => {
    expect(validateContactForm(withValues({ name: "A" })).name).toBe(
      `Nama minimal ${CONTACT_FORM_LIMITS.nameMin} karakter.`,
    );
    expect(validateContactForm(withValues({ message: "Halo" })).message).toBe(
      `Pesan terlalu singkat, tulis minimal ${CONTACT_FORM_LIMITS.messageMin} karakter.`,
    );
  });

  it("validates the optional phone number only when it is filled", () => {
    expect(validateContactForm(withValues({ phone: "abc" })).phone).toBe(
      "Nomor telepon hanya boleh berisi angka, spasi, dan tanda + - ( ).",
    );
    expect(validateContactForm(withValues({ phone: "12345" })).phone).toBe(
      `Nomor telepon harus berisi ${CONTACT_FORM_LIMITS.phoneMinDigits} sampai ${CONTACT_FORM_LIMITS.phoneMaxDigits} angka.`,
    );
    expect(validateContactForm(withValues({ phone: "1".repeat(CONTACT_FORM_LIMITS.phoneMaxDigits + 1) })).phone).toBeDefined();
    expect(validateContactForm(withValues({ phone: "(021) 5000-1234" })).phone).toBeUndefined();
  });
});

describe("firstInvalidField", () => {
  it("returns the first invalid field in form order", () => {
    expect(firstInvalidField({ message: "x", email: "y" })).toBe("email");
    expect(firstInvalidField({ name: "x", message: "y" })).toBe("name");
    expect(firstInvalidField({})).toBeNull();
  });
});

describe("decideContactSubmit", () => {
  it("reports invalid with the errors before anything else", () => {
    const outcome = decideContactSubmit(EMPTY_CONTACT_FORM_VALUES, { isDemo: false });

    expect(outcome.type).toBe("invalid");
    if (outcome.type === "invalid") {
      expect(outcome.errors.name).toBe("Nama wajib diisi.");
    }
  });

  it("reports invalid in demo mode when the form is incomplete", () => {
    expect(decideContactSubmit(EMPTY_CONTACT_FORM_VALUES, { isDemo: true }).type).toBe("invalid");
  });

  it("yields the demo outcome for a valid form in demo mode", () => {
    expect(decideContactSubmit(VALID_VALUES, { isDemo: true })).toEqual({ type: "demo" });
  });

  it("never yields send in demo mode, whatever the values are", () => {
    const samples: ContactFormValues[] = [
      VALID_VALUES,
      EMPTY_CONTACT_FORM_VALUES,
      withValues({ phone: "+62 812-3456-7890" }),
      withValues({ email: "bukan-email" }),
      withValues({ message: "a".repeat(CONTACT_FORM_LIMITS.messageMax + 1) }),
    ];

    for (const values of samples) {
      expect(decideContactSubmit(values, { isDemo: true }).type).not.toBe("send");
    }
  });

  it("yields send with trimmed values for a valid form outside demo mode", () => {
    const outcome = decideContactSubmit(
      withValues({ name: "  Rina Wulandari  ", email: " rina@perusahaan.example ", phone: " " }),
      { isDemo: false },
    );

    expect(outcome).toEqual({
      type: "send",
      values: { ...VALID_VALUES, phone: "" },
    });
  });
});

describe("submitContactForm", () => {
  it("does not call fetch or the submit handler in demo mode and reports demo", async () => {
    const fetchSpy = vi.fn();
    const handler = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await submitContactForm(VALID_VALUES, { isDemo: true, onSubmit: handler });

    expect(result).toEqual({ status: "demo" });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not call fetch for an invalid form and returns the errors", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await submitContactForm(EMPTY_CONTACT_FORM_VALUES, { isDemo: true });

    expect(result.status).toBe("invalid");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("passes trimmed values to the handler outside demo mode and reports sent", async () => {
    const handler = vi.fn().mockResolvedValue(undefined);

    const result = await submitContactForm(withValues({ name: " Rina Wulandari " }), { isDemo: false, onSubmit: handler });

    expect(result).toEqual({ status: "sent" });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(VALID_VALUES);
  });

  it("reports failed when the handler rejects", async () => {
    const handler = vi.fn().mockRejectedValue(new Error("gagal"));

    expect(await submitContactForm(VALID_VALUES, { isDemo: false, onSubmit: handler })).toEqual({ status: "failed" });
  });

  it("reports failed outside demo mode when no handler is wired", async () => {
    expect(await submitContactForm(VALID_VALUES, { isDemo: false })).toEqual({ status: "failed" });
  });
});

describe("demo message", () => {
  it("tells the visitor that nothing was sent and points to WhatsApp", () => {
    expect(DEMO_SUBMIT_MESSAGE).toBe("Ini situs demo, pesan tidak dikirim. Hubungi kami lewat WhatsApp.");
  });
});
