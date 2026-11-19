import { ArticleForm } from "@/components/admin/forms/article-form";
import type { ItemFormAction } from "@/components/admin/forms/item-form-shell";
import { PartnerForm } from "@/components/admin/forms/partner-form";
import { PortfolioForm } from "@/components/admin/forms/portfolio-form";
import { ServiceForm } from "@/components/admin/forms/service-form";
import { StatForm } from "@/components/admin/forms/stat-form";
import { TeamForm } from "@/components/admin/forms/team-form";
import { TestimonialForm } from "@/components/admin/forms/testimonial-form";
import { ArticleList } from "@/components/admin/lists/article-list";
import { PartnerList } from "@/components/admin/lists/partner-list";
import { PortfolioList } from "@/components/admin/lists/portfolio-list";
import { ServiceList } from "@/components/admin/lists/service-list";
import { StatList } from "@/components/admin/lists/stat-list";
import { TeamList } from "@/components/admin/lists/team-list";
import { TestimonialList } from "@/components/admin/lists/testimonial-list";
import type {
  AdminModule,
  AdminRecordByModule,
  ArticleRecord,
  PartnerRecord,
  PortfolioRecord,
  ServiceRecord,
  StatRecord,
  TeamMemberRecord,
  TestimonialRecord,
} from "@/core/domain/admin/records";
import type { ListActions } from "@/lib/admin/list-actions";
import type { FormContext } from "@/server/admin/form-context";

type AnyRecord = AdminRecordByModule[AdminModule];

type ModuleListProps = {
  module: AdminModule;
  records: AnyRecord[];
  actions: ListActions;
};

export function ModuleList({ module, records, actions }: ModuleListProps) {
  switch (module) {
    case "services":
      return <ServiceList records={records as ServiceRecord[]} actions={actions} />;
    case "portfolio":
      return <PortfolioList records={records as PortfolioRecord[]} actions={actions} />;
    case "team":
      return <TeamList records={records as TeamMemberRecord[]} actions={actions} />;
    case "stats":
      return <StatList records={records as StatRecord[]} actions={actions} />;
    case "testimonials":
      return <TestimonialList records={records as TestimonialRecord[]} actions={actions} />;
    case "partners":
      return <PartnerList records={records as PartnerRecord[]} actions={actions} />;
    case "articles":
      return <ArticleList records={records as ArticleRecord[]} actions={actions} />;
  }
}

type ModuleFormProps = {
  module: AdminModule;
  record: AnyRecord | null;
  context: FormContext;
  action: ItemFormAction;
};

export function ModuleForm({ module, record, context, action }: ModuleFormProps) {
  const { media, siteName, authors } = context;

  switch (module) {
    case "services":
      return <ServiceForm record={record as ServiceRecord | null} media={media} siteName={siteName} action={action} />;
    case "portfolio":
      return <PortfolioForm record={record as PortfolioRecord | null} media={media} siteName={siteName} action={action} />;
    case "team":
      return <TeamForm record={record as TeamMemberRecord | null} media={media} action={action} />;
    case "stats":
      return <StatForm record={record as StatRecord | null} action={action} />;
    case "testimonials":
      return <TestimonialForm record={record as TestimonialRecord | null} media={media} action={action} />;
    case "partners":
      return <PartnerForm record={record as PartnerRecord | null} media={media} action={action} />;
    case "articles":
      return <ArticleForm record={record as ArticleRecord | null} media={media} siteName={siteName} authors={authors} action={action} />;
  }
}
