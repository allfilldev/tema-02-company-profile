import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getSiteQueries } from "@/server/container";
import { isDemoDataSource } from "@/server/site/site-env";

export const metadata: Metadata = {
  title: "Masuk admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (isDemoDataSource()) {
    notFound();
  }
  const settings = await getSiteQueries().getSettings();
  return <LoginForm siteName={settings.siteName} siteLogo={settings.logo} />;
}
