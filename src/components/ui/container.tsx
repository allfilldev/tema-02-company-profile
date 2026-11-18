import type { ReactNode } from "react";
import { joinClassNames } from "@/lib/ui/class-names";

type ContainerProps = {
  as?: "div" | "section" | "main";
  id?: string;
  className?: string;
  children?: ReactNode;
};

export function Container({ as: Element = "div", className, ...props }: ContainerProps) {
  return <Element className={joinClassNames("mx-auto w-full max-w-site px-4 sm:px-6 lg:px-8", className)} {...props} />;
}
