export type LoginFormState = {
  error: string | null;
  email: string;
};

export const INITIAL_LOGIN_STATE: LoginFormState = { error: null, email: "" };

export const NOT_ADMIN_MESSAGE = "Akun ini tidak punya akses admin.";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_CODES = ["over_request_rate_limit", "over_email_send_rate_limit"];

export type ParsedLoginForm = { email: string; password: string } | { error: string };

export function parseLoginForm(formData: FormData): ParsedLoginForm {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (email.length === 0) {
    return { error: "Email wajib diisi." };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Format email belum benar." };
  }
  if (password.length === 0) {
    return { error: "Password wajib diisi." };
  }
  return { email, password };
}

export function loginErrorMessage(code: string | undefined): string {
  if (code === "invalid_credentials") {
    return "Email atau password salah.";
  }
  if (code && RATE_LIMIT_CODES.includes(code)) {
    return "Terlalu banyak percobaan. Coba lagi beberapa menit lagi.";
  }
  return "Login gagal. Coba lagi.";
}
