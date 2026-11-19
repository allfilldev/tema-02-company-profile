"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { INITIAL_LOGIN_STATE } from "@/lib/admin/login-form";
import { signIn } from "@/server/actions/admin/auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, INITIAL_LOGIN_STATE);

  return (
    <main className="flex min-h-screen items-center bg-surface-muted py-12">
      <Container className="max-w-md">
        <div className="rounded-lg border border-border bg-background p-6 shadow-sm md:p-8">
          <h1 className="font-heading text-2xl font-bold text-foreground">Masuk admin</h1>
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
            <Button type="submit" disabled={pending}>
              Masuk
            </Button>
          </form>
        </div>
      </Container>
    </main>
  );
}
