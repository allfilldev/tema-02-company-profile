"use server";

import { headers } from "next/headers";
import { createPublicSupabaseClient } from "@/infrastructure/supabase/public-client";
import { validateContactForm, type ContactFormValues, type ContactSendResult } from "@/lib/site/contact-form";
import { clientIpFrom, hashIp } from "@/lib/site/ip-hash";
import { isDemoDataSource } from "@/server/site/site-env";
import { getSupabasePublicEnv } from "@/server/supabase/supabase-env";

export async function submitContactMessage(values: ContactFormValues): Promise<ContactSendResult> {
  if (isDemoDataSource() || Object.keys(validateContactForm(values)).length > 0) {
    return "failed";
  }

  try {
    const salt = process.env.CONTACT_IP_SALT ?? "";
    const ipHash = hashIp(clientIpFrom(await headers()), salt);
    const client = createPublicSupabaseClient(getSupabasePublicEnv());

    const { data, error } = await client.rpc("submit_contact_message", {
      p_name: values.name.trim(),
      p_email: values.email.trim(),
      p_phone: values.phone.trim() || null,
      p_message: values.message.trim(),
      p_ip_hash: ipHash,
    });

    if (error) {
      console.error(`Contact message was not stored: ${error.message}`);
      return "failed";
    }
    if (data === "rate_limited") {
      return "rate-limited";
    }
    if (data !== "sent") {
      console.error(`Contact message was not stored: unexpected result ${String(data)}`);
      return "failed";
    }
    return "sent";
  } catch (caught) {
    console.error(`Contact message was not stored: ${caught instanceof Error ? caught.message : String(caught)}`);
    return "failed";
  }
}
