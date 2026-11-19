"use client";

import Link from "next/link";
import { createContext, useActionState, useContext, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { FormNotice } from "@/components/admin/shared/form-notice";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import { INITIAL_ADMIN_FORM_STATE, type AdminFormState } from "@/lib/admin/form-state";

export type ItemFormAction = (state: AdminFormState, formData: FormData) => Promise<AdminFormState>;

type ItemFormContextValue = {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  isPublished: boolean;
  media: MediaAsset[];
};

const ItemFormContext = createContext<ItemFormContextValue>({ values: {}, errors: {}, isPublished: false, media: [] });

export function useItemForm(): ItemFormContextValue {
  return useContext(ItemFormContext);
}

type ItemFormShellProps = {
  action: ItemFormAction;
  initial: Record<string, unknown>;
  media: MediaAsset[];
  isPublishable: boolean;
  isPublished: boolean;
  cancelHref: string;
  children: ReactNode;
};

export function ItemFormShell({ action, initial, media, isPublishable, isPublished, cancelHref, children }: ItemFormShellProps) {
  const [state, formAction, pending] = useActionState(action, INITIAL_ADMIN_FORM_STATE);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (state !== INITIAL_ADMIN_FORM_STATE) {
      setVersion((current) => current + 1);
    }
  }, [state]);

  const context: ItemFormContextValue = {
    values: { ...initial, ...state.values },
    errors: state.fieldErrors,
    isPublished,
    media,
  };

  return (
    <ItemFormContext.Provider value={context}>
      <form action={formAction} noValidate className="flex flex-col gap-6">
        <FormNotice state={state} />
        <div key={version} className="flex flex-col gap-6">
          {children}
        </div>
        <div className="flex flex-wrap gap-3">
          {isPublishable && !isPublished ? (
            <>
              <Button type="submit" name="intent" value="draft" variant="secondary" disabled={pending}>
                Simpan draf
              </Button>
              <Button type="submit" name="intent" value="publish" disabled={pending}>
                Simpan dan terbitkan
              </Button>
            </>
          ) : (
            <Button type="submit" name="intent" value="draft" disabled={pending}>
              Simpan
            </Button>
          )}
          <Link href={cancelHref} className="inline-flex min-h-11 items-center px-3 font-semibold text-primary underline underline-offset-4">
            Kembali ke daftar
          </Link>
        </div>
      </form>
    </ItemFormContext.Provider>
  );
}
