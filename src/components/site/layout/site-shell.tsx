import type { ReactNode } from "react";
import type { SiteContext } from "@/server/site/site-context";
import { Footer } from "./footer";
import { Header } from "./header";
import { WhatsAppButton } from "./whatsapp-button";

type SiteShellProps = {
  context: SiteContext;
  children: ReactNode;
};

export function SiteShell({ context, children }: SiteShellProps) {
  const { settings, navigation, whatsappUrl } = context;

  return (
    <>
      <Header siteName={settings.siteName} logo={settings.logo} navigation={navigation} phone={settings.phone} />
      <main id="konten" className="flex-1 pb-24 md:pb-28">
        {children}
      </main>
      <Footer settings={settings} navigation={navigation} />
      <WhatsAppButton href={whatsappUrl} />
    </>
  );
}
