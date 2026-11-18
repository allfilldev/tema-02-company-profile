import type { ComponentProps } from "react";
import { joinClassNames } from "@/lib/ui/class-names";
import { invalidControlProps } from "@/lib/ui/field-ids";
import { TEXTAREA_CLASS_NAME } from "@/lib/ui/form-control-styles";

type TextareaProps = ComponentProps<"textarea"> & {
  invalid?: boolean;
};

export function Textarea({ invalid, className, id, ...props }: TextareaProps) {
  return <textarea id={id} className={joinClassNames(TEXTAREA_CLASS_NAME, className)} {...invalidControlProps(id, invalid)} {...props} />;
}
