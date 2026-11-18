import { Icon } from "@/components/ui/icon";

type WhatsAppButtonProps = {
  href: string;
};

export function WhatsAppButton({ href }: WhatsAppButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 left-1/2 z-40 inline-flex min-h-12 -translate-x-1/2 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-success px-6 text-lg font-semibold text-primary-foreground shadow-card transition-opacity hover:opacity-90"
    >
      <Icon name="message-circle" className="size-6 shrink-0" />
      Chat WhatsApp Sekarang
    </a>
  );
}
