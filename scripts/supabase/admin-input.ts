const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const ADMIN_PASSWORD_MIN_LENGTH = 8;

export function validateAdminEmail(email: string): string | null {
  return EMAIL_PATTERN.test(email) ? null : "Provide a valid email address.";
}

export function validateAdminPassword(password: string, confirmation: string): string | null {
  if (password.length < ADMIN_PASSWORD_MIN_LENGTH) {
    return `The password must be at least ${ADMIN_PASSWORD_MIN_LENGTH} characters (received ${password.length}).`;
  }
  if (password !== confirmation) {
    return "The two passwords must match.";
  }
  return null;
}
