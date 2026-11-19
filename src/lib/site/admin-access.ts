import { ADMIN_ROUTES } from "@/lib/site/routes";

export type AdminAccess = "not-found" | "login" | "allow";

export type AdminAccessInput = {
  pathname: string;
  isDemo: boolean;
  hasSession: boolean;
};

export function decideAdminAccess({ pathname, isDemo, hasSession }: AdminAccessInput): AdminAccess {
  if (isDemo) {
    return "not-found";
  }
  if (pathname === ADMIN_ROUTES.login) {
    return "allow";
  }
  return hasSession ? "allow" : "login";
}
