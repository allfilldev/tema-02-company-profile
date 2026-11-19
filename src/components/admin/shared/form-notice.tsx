import type { AdminFormState } from "@/lib/admin/form-state";

type FormNoticeProps = {
  state: AdminFormState;
};

export function FormNotice({ state }: FormNoticeProps) {
  if (state.status === "idle") {
    return null;
  }

  const isProblem = state.status === "invalid" || state.status === "failed";

  return (
    <div
      role={isProblem ? "alert" : "status"}
      className={isProblem ? "rounded-md border border-danger p-4 text-danger" : "rounded-md border border-success p-4 text-foreground"}
    >
      {state.message ? <p className="font-semibold">{state.message}</p> : null}
      {state.blocking.length > 0 ? (
        <ul className="mt-2 list-disc pl-5">
          {state.blocking.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : null}
      {state.warnings.length > 0 ? (
        <ul className="mt-2 list-disc pl-5 text-foreground">
          {state.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
