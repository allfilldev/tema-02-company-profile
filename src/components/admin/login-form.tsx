"use client";

import { LockKeyhole } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { INITIAL_LOGIN_STATE } from "@/lib/admin/login-form";
import { signIn } from "@/server/actions/admin/auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, INITIAL_LOGIN_STATE);

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-surface-muted py-12">
      <div aria-hidden="true" className="shape-blob absolute -left-24 -top-24 size-80 bg-sidebar opacity-90" />
      <div aria-hidden="true" className="shape-blob absolute -bottom-32 -right-24 size-96 bg-accent" />
      <div className="relative mx-auto w-full max-w-md px-4">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
          <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-sidebar text-surface-inverse-foreground">
            <LockKeyhole className="size-6" />
          </span>
          <h1 className="mt-5 font-heading text-2xl font-bold text-foreground">Masuk admin</h1>
          <p className="mt-1 text-muted-foreground">Gunakan akun admin untuk mengelola situs.</p>
          <form action={formAction} className="mt-6 flex flex-col gap-4" noValidate>
            <Field label="Email" htmlFor="login-email">
              <Input id="login-email" name="email" type="email" autoComplete="email" defaultValue={state.email} required />
            </Field>
            <Field label="Password" htmlFor="login-password">
              <Input id="login-password" name="password" type="password" autoComplete="current-password" required />
            </Field>
            {state.error ? (
              <p role="alert" className="text-sm font-medium text-danger">
                {state.error}
              </p>
            ) : null}
            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              Masuk
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
