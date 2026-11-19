import type { QueryResult } from "@/infrastructure/supabase/public-repositories";

export interface AdminQuery extends PromiseLike<QueryResult> {
  eq(column: string, value: unknown): AdminQuery;
  in(column: string, values: readonly unknown[]): AdminQuery;
  order(column: string, options?: { ascending?: boolean }): AdminQuery;
  range(from: number, to: number): AdminQuery;
  select(columns: string, options?: { count?: "exact" }): AdminQuery;
  single(): AdminQuery;
  maybeSingle(): AdminQuery;
}

export interface AdminClient {
  from(table: string): {
    select(columns: string, options?: { count?: "exact" }): AdminQuery;
    insert(values: object): AdminQuery;
    update(values: object): AdminQuery;
    delete(): AdminQuery;
  };
  rpc(name: string, args?: Record<string, unknown>): PromiseLike<QueryResult>;
}
