import type { AdminModule } from "@/core/domain/admin/records";

export type AffectedContent = {
  module: AdminModule;
  slugs: string[];
};

export type AdminSuccess<Value, Affected = AffectedContent> = {
  ok: true;
  value: Value;
  warnings: string[];
  affected: Affected;
};

export type AdminFailure = {
  ok: false;
  fieldErrors: Record<string, string>;
  blocking: string[];
  warnings: string[];
};

export type AdminResult<Value, Affected = AffectedContent> = AdminSuccess<Value, Affected> | AdminFailure;

export function failure(blocking: string[], fieldErrors: Record<string, string> = {}, warnings: string[] = []): AdminFailure {
  return { ok: false, fieldErrors, blocking, warnings };
}

export function success<Value, Affected = AffectedContent>(value: Value, affected: Affected, warnings: string[] = []): AdminSuccess<Value, Affected> {
  return { ok: true, value, warnings, affected };
}
