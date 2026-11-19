import { Briefcase, Circle, FileText, FolderKanban, Handshake, Images, LayoutDashboard, Mail, MessageSquareQuote, Settings, Users, ChartColumn, type LucideIcon } from "lucide-react";
import { ADMIN_MODULE_PATHS, ADMIN_ROUTES } from "@/lib/site/routes";

const ICONS_BY_HREF: Record<string, LucideIcon> = {
  [ADMIN_ROUTES.root]: LayoutDashboard,
  [ADMIN_MODULE_PATHS.services]: Briefcase,
  [ADMIN_MODULE_PATHS.portfolio]: FolderKanban,
  [ADMIN_MODULE_PATHS.team]: Users,
  [ADMIN_MODULE_PATHS.stats]: ChartColumn,
  [ADMIN_MODULE_PATHS.testimonials]: MessageSquareQuote,
  [ADMIN_MODULE_PATHS.partners]: Handshake,
  [ADMIN_MODULE_PATHS.articles]: FileText,
  [ADMIN_ROUTES.messages]: Mail,
  [ADMIN_ROUTES.media]: Images,
  [ADMIN_ROUTES.settings]: Settings,
};

export function iconForAdminHref(href: string): LucideIcon {
  return ICONS_BY_HREF[href] ?? Circle;
}
