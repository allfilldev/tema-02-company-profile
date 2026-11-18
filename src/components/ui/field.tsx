import type { ReactNode } from "react";
import { fieldErrorId } from "@/lib/ui/field-ids";
import { joinClassNames } from "@/lib/ui/class-names";

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string | null;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, error, required = false, className, children }: FieldProps) {
  return (
    <div className={joinClassNames("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-danger">
            {" *"}
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={fieldErrorId(htmlFor)} role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
