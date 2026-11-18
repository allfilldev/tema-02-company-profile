import type { ReactNode } from "react";
import { RouteGuard } from "@/components/site/layout/route-guard";

export default function ServicesTemplate({ children }: { children: ReactNode }) {
  return <RouteGuard>{children}</RouteGuard>;
}
