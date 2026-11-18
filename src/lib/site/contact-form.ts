export type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type ContactFormField = keyof ContactFormValues;

export type ContactFormErrors = Partial<Record<ContactFormField, string>>;

export type ContactSubmitHandler = (values: ContactFormValues) => Promise<void> | void;

export type ContactSubmitOutcome =
  | { type: "invalid"; errors: ContactFormErrors }
  | { type: "demo" }
  | { type: "send"; values: ContactFormValues };

export type ContactSubmitResult =
  | { status: "invalid"; errors: ContactFormErrors }
  | { status: "demo" }
  | { status: "sent" }
  | { status: "failed" };

export const CONTACT_FORM_LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  phoneMinDigits: 8,
  phoneMaxDigits: 15,
  messageMin: 10,
  messageMax: 2000,
} as const;

export const EMPTY_CONTACT_FORM_VALUES: ContactFormValues = { name: "", email: "", phone: "", message: "" };

export const CONTACT_FORM_FIELD_ORDER: readonly ContactFormField[] = ["name", "email", "phone", "message"];

export const DEMO_SUBMIT_MESSAGE_PARTS = {
  before: "Ini situs demo, pesan tidak dikirim. Hubungi kami lewat ",
  link: "WhatsApp",
  after: ".",
} as const;

export const DEMO_SUBMIT_MESSAGE = `${DEMO_SUBMIT_MESSAGE_PARTS.before}${DEMO_SUBMIT_MESSAGE_PARTS.link}${DEMO_SUBMIT_MESSAGE_PARTS.after}`;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARACTERS_PATTERN = /^[+\d\s\-().]+$/;
const NON_DIGIT_PATTERN = /\D/g;

function trimValues(values: ContactFormValues): ContactFormValues {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    message: values.message.trim(),
  };
}

function validateName(name: string): string | null {
  if (name.length === 0) return "Nama wajib diisi.";
  if (name.length < CONTACT_FORM_LIMITS.nameMin) return `Nama minimal ${CONTACT_FORM_LIMITS.nameMin} karakter.`;
  if (name.length > CONTACT_FORM_LIMITS.nameMax) return `Nama terlalu panjang, maksimal ${CONTACT_FORM_LIMITS.nameMax} karakter.`;
  return null;
}

function validateEmail(email: string): string | null {
  if (email.length === 0) return "Email wajib diisi.";
  if (email.length > CONTACT_FORM_LIMITS.emailMax) return `Email terlalu panjang, maksimal ${CONTACT_FORM_LIMITS.emailMax} karakter.`;
  if (!EMAIL_PATTERN.test(email)) return "Format email belum benar, contoh: nama@perusahaan.com.";
  return null;
}

function validatePhone(phone: string): string | null {
  if (phone.length === 0) return null;
  if (!PHONE_CHARACTERS_PATTERN.test(phone)) return "Nomor telepon hanya boleh berisi angka, spasi, dan tanda + - ( ).";
  const digitCount = phone.replace(NON_DIGIT_PATTERN, "").length;
  if (digitCount < CONTACT_FORM_LIMITS.phoneMinDigits || digitCount > CONTACT_FORM_LIMITS.phoneMaxDigits) {
    return `Nomor telepon harus berisi ${CONTACT_FORM_LIMITS.phoneMinDigits} sampai ${CONTACT_FORM_LIMITS.phoneMaxDigits} angka.`;
  }
  return null;
}

function validateMessage(message: string): string | null {
  if (message.length === 0) return "Pesan wajib diisi.";
  if (message.length < CONTACT_FORM_LIMITS.messageMin) {
    return `Pesan terlalu singkat, tulis minimal ${CONTACT_FORM_LIMITS.messageMin} karakter.`;
  }
  if (message.length > CONTACT_FORM_LIMITS.messageMax) {
    return `Pesan terlalu panjang, maksimal ${CONTACT_FORM_LIMITS.messageMax} karakter.`;
  }
  return null;
}

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const trimmed = trimValues(values);
  const candidates: [ContactFormField, string | null][] = [
    ["name", validateName(trimmed.name)],
    ["email", validateEmail(trimmed.email)],
    ["phone", validatePhone(trimmed.phone)],
    ["message", validateMessage(trimmed.message)],
  ];
  const errors: ContactFormErrors = {};

  for (const [field, error] of candidates) {
    if (error) {
      errors[field] = error;
    }
  }
  return errors;
}

export function firstInvalidField(errors: ContactFormErrors): ContactFormField | null {
  return CONTACT_FORM_FIELD_ORDER.find((field) => Boolean(errors[field])) ?? null;
}

export function decideContactSubmit(values: ContactFormValues, options: { isDemo: boolean }): ContactSubmitOutcome {
  const errors = validateContactForm(values);
  if (Object.keys(errors).length > 0) {
    return { type: "invalid", errors };
  }
  if (options.isDemo) {
    return { type: "demo" };
  }
  return { type: "send", values: trimValues(values) };
}

export async function submitContactForm(
  values: ContactFormValues,
  options: { isDemo: boolean; onSubmit?: ContactSubmitHandler },
): Promise<ContactSubmitResult> {
  const outcome = decideContactSubmit(values, { isDemo: options.isDemo });

  if (outcome.type === "invalid") {
    return { status: "invalid", errors: outcome.errors };
  }
  if (outcome.type === "demo") {
    return { status: "demo" };
  }
  if (!options.onSubmit) {
    return { status: "failed" };
  }

  try {
    await options.onSubmit(outcome.values);
    return { status: "sent" };
  } catch {
    return { status: "failed" };
  }
}
