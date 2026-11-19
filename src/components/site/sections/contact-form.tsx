"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTACT_FORM_LIMITS,
  DEMO_SUBMIT_MESSAGE_PARTS,
  EMPTY_CONTACT_FORM_VALUES,
  firstInvalidField,
  submitContactForm,
  type ContactFormErrors,
  type ContactFormField,
  type ContactFormValues,
  type ContactSubmitHandler,
} from "@/lib/site/contact-form";

export type ContactFormStatusKind = "idle" | "submitting" | "demo" | "sent" | "rate-limited" | "failed";

type ContactFormProps = {
  isDemo: boolean;
  whatsappUrl: string;
  onSubmit?: ContactSubmitHandler;
};

type ContactFormFieldsProps = {
  values: ContactFormValues;
  errors: ContactFormErrors;
  onChange: (field: ContactFormField, value: string) => void;
  disabled: boolean;
};

type ContactFormStatusProps = {
  status: ContactFormStatusKind;
  whatsappUrl: string;
};

const SUBMIT_LABEL = "Kirim pesan";
const SUBMITTING_LABEL = "Mengirim...";
const SENT_MESSAGE = "Terima kasih, pesan Anda sudah terkirim. Kami akan membalas pada jam kerja.";
const RATE_LIMITED_MESSAGE_LEAD = "Terlalu banyak pesan dari jaringan Anda. Coba lagi dalam satu jam, atau hubungi kami lewat ";
const FAILED_MESSAGE_LEAD = "Pesan belum terkirim. Coba lagi sebentar lagi atau hubungi kami lewat ";
const UNAVAILABLE_MESSAGE_LEAD = "Pengiriman lewat formulir belum aktif. Hubungi kami lewat ";
const WHATSAPP_LABEL = "WhatsApp";
const STATUS_LINK_CLASS_NAME = "font-semibold text-primary underline underline-offset-4 hover:text-primary-hover";

function WhatsAppStatusLink({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={STATUS_LINK_CLASS_NAME}>
      {WHATSAPP_LABEL}
    </a>
  );
}

export function ContactFormStatus({ status, whatsappUrl }: ContactFormStatusProps) {
  return (
    <div role="status" aria-live="polite" className="text-base text-foreground">
      {status === "demo" ? (
        <p>
          {DEMO_SUBMIT_MESSAGE_PARTS.before}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={STATUS_LINK_CLASS_NAME}>
            {DEMO_SUBMIT_MESSAGE_PARTS.link}
          </a>
          {DEMO_SUBMIT_MESSAGE_PARTS.after}
        </p>
      ) : null}
      {status === "sent" ? <p>{SENT_MESSAGE}</p> : null}
      {status === "rate-limited" ? (
        <p>
          {RATE_LIMITED_MESSAGE_LEAD}
          <WhatsAppStatusLink href={whatsappUrl} />.
        </p>
      ) : null}
      {status === "failed" ? (
        <p>
          {FAILED_MESSAGE_LEAD}
          <WhatsAppStatusLink href={whatsappUrl} />.
        </p>
      ) : null}
    </div>
  );
}

export function ContactFormFields({ values, errors, onChange, disabled }: ContactFormFieldsProps) {
  function handleChange(field: ContactFormField) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(field, event.target.value);
  }

  return (
    <>
      <Field label="Nama" htmlFor="kontak-nama" error={errors.name} required>
        <Input
          id="kontak-nama"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={CONTACT_FORM_LIMITS.nameMax}
          value={values.name}
          onChange={handleChange("name")}
          invalid={Boolean(errors.name)}
          disabled={disabled}
        />
      </Field>
      <Field label="Email" htmlFor="kontak-email" error={errors.email} required>
        <Input
          id="kontak-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={CONTACT_FORM_LIMITS.emailMax}
          value={values.email}
          onChange={handleChange("email")}
          invalid={Boolean(errors.email)}
          disabled={disabled}
        />
      </Field>
      <Field label="Telepon (opsional)" htmlFor="kontak-telepon" error={errors.phone}>
        <Input
          id="kontak-telepon"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={values.phone}
          onChange={handleChange("phone")}
          invalid={Boolean(errors.phone)}
          disabled={disabled}
        />
      </Field>
      <Field label="Pesan" htmlFor="kontak-pesan" error={errors.message} required>
        <Textarea
          id="kontak-pesan"
          name="message"
          required
          maxLength={CONTACT_FORM_LIMITS.messageMax}
          value={values.message}
          onChange={handleChange("message")}
          invalid={Boolean(errors.message)}
          disabled={disabled}
        />
      </Field>
    </>
  );
}

export function ContactForm({ isDemo, whatsappUrl, onSubmit }: ContactFormProps) {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_CONTACT_FORM_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<ContactFormStatusKind>("idle");
  const canSubmit = isDemo || Boolean(onSubmit);
  const isSubmitting = status === "submitting";

  function handleChange(field: ContactFormField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");

    const result = await submitContactForm(values, { isDemo, onSubmit });

    if (result.status === "invalid") {
      flushSync(() => {
        setErrors(result.errors);
        setStatus("idle");
      });
      const firstField = firstInvalidField(result.errors);
      const control = firstField ? form.elements.namedItem(firstField) : null;
      if (control instanceof HTMLElement) {
        control.focus();
      }
      return;
    }

    setErrors({});
    setStatus(result.status);
    if (result.status === "sent") {
      setValues(EMPTY_CONTACT_FORM_VALUES);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
      <ContactFormFields values={values} errors={errors} onChange={handleChange} disabled={isSubmitting} />
      <div>
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? SUBMITTING_LABEL : SUBMIT_LABEL}
        </Button>
      </div>
      {canSubmit ? null : (
        <p className="text-sm text-muted-foreground">
          {UNAVAILABLE_MESSAGE_LEAD}
          <WhatsAppStatusLink href={whatsappUrl} />.
        </p>
      )}
      <ContactFormStatus status={status} whatsappUrl={whatsappUrl} />
    </form>
  );
}
