import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import { getSiteQueries } from "@/server/container";
import { getSiteEnv } from "@/server/site/site-env";
import { fontClassNames } from "@/styles/fonts";
import { ogTheme } from "@/styles/tokens";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: ogTheme.primary,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteQueries().getSettings();
  const indexable = getSiteEnv().indexingEnabled;

  return {
    title: settings.siteName,
    description: settings.tagline,
    robots: { index: indexable, follow: indexable },
    icons: {
      icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.png", type: "image/png", sizes: "512x512" }],
      apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
    },
    manifest: "/manifest.webmanifest",
    ...(settings.googleSiteVerification ? { verification: { google: settings.googleSiteVerification } } : {}),
  };
}

function buildGaInitScript(measurementId: string): string {
  const id = JSON.stringify(measurementId).replace(/</g, "\\u003c");
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config",${id});`;
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteQueries().getSettings();
  const measurementId = settings.gaMeasurementId;

  return (
    <html lang="id" className={fontClassNames}>
      <body className="flex min-h-dvh flex-col">
        {children}
        {measurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {buildGaInitScript(measurementId)}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
