import type { AdminModule } from "@/core/domain/admin/records";

export type AffectedContent = {
  module: AdminModule;
  slugs: string[];
};

export type AdminSuccess<Value> = {
  ok: true;
  value: Value;
  warnings: string[];
  affected: AffectedContent;
};

export type AdminFailure = {
  ok: false;
  fieldErrors: Record<string, string>;
  blocking: string[];
  warnings: string[];
};

export type AdminResult<Value> = AdminSuccess<Value> | AdminFailure;

export function failure(blocking: string[], fieldErrors: Record<string, string> = {}, warnings: string[] = []): AdminFailure {
  return { ok: false, fieldErrors, blocking, warnings };
}

export function success<Value>(value: Value, affected: AffectedContent, warnings: string[] = []): AdminSuccess<Value> {
  return { ok: true, value, warnings, affected };
}
