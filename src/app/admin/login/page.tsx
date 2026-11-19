import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { isDemoDataSource } from "@/server/site/site-env";

export const metadata: Metadata = {
  title: "Masuk admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  if (isDemoDataSource()) {
    notFound();
  }
  return <LoginForm />;
}
