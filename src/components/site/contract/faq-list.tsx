import { useId } from "react";
import type { FaqItem } from "@/core/domain/shared/faq-item";

type FaqListProps = {
  items: FaqItem[];
  heading?: string;
};

export function FaqList({ items, heading = "Pertanyaan yang sering diajukan" }: FaqListProps) {
  const headingId = useId();

  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        {heading}
      </h2>
      <div className="mt-6 space-y-6">
        {items.map((item) => (
          <div key={item.question}>
            <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
            <p className="mt-2 text-base text-muted-foreground">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
