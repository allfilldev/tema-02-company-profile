import { Breadcrumbs } from "@/components/site/contract/breadcrumbs";
import { Container } from "@/components/ui/container";
import type { BreadcrumbItem } from "@/lib/seo/json-ld";

type BreadcrumbBarProps = {
  items: BreadcrumbItem[];
};

export function BreadcrumbBar({ items }: BreadcrumbBarProps) {
  return (
    <div className="relative z-10 -mb-12 bg-surface-inverse pt-16 text-surface-inverse-foreground md:pt-20">
      <Container className="pt-4">
        <Breadcrumbs items={items} />
      </Container>
    </div>
  );
}
