export type AdminFormStatus = "idle" | "saved" | "invalid" | "failed";

export type AdminFormState = {
  status: AdminFormStatus;
  message: string | null;
  fieldErrors: Record<string, string>;
  blocking: string[];
  warnings: string[];
  values: Record<string, unknown>;
};

export type AdminActionOutcome = { ok: true } | { ok: false; message: string };

export const INITIAL_ADMIN_FORM_STATE: AdminFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
  blocking: [],
  warnings: [],
  values: {},
};

export const SAVED_MESSAGE = "Perubahan tersimpan.";
export const INVALID_MESSAGE = "Periksa kembali isian yang ditandai.";
export const FAILED_MESSAGE = "Gagal menyimpan. Coba lagi.";

export function savedState(warnings: string[], values: Record<string, unknown>): AdminFormState {
  return { status: "saved", message: SAVED_MESSAGE, fieldErrors: {}, blocking: [], warnings, values };
}

export function invalidState(
  failure: { fieldErrors: Record<string, string>; blocking: string[]; warnings: string[] },
  values: Record<string, unknown>,
): AdminFormState {
  return { status: "invalid", message: INVALID_MESSAGE, fieldErrors: failure.fieldErrors, blocking: failure.blocking.filter((reason) => reason !== INVALID_MESSAGE), warnings: failure.warnings, values };
}

export function failedState(values: Record<string, unknown>): AdminFormState {
  return { status: "failed", message: FAILED_MESSAGE, fieldErrors: {}, blocking: [], warnings: [], values };
}
