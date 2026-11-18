import type { ComponentProps } from "react";
import { joinClassNames } from "@/lib/ui/class-names";
import { invalidControlProps } from "@/lib/ui/field-ids";
import { INPUT_CLASS_NAME } from "@/lib/ui/form-control-styles";

type InputProps = ComponentProps<"input"> & {
  invalid?: boolean;
};

export function Input({ invalid, className, id, ...props }: InputProps) {
  return <input id={id} className={joinClassNames(INPUT_CLASS_NAME, className)} {...invalidControlProps(id, invalid)} {...props} />;
}
