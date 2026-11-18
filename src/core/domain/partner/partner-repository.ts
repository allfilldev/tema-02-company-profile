import type { Partner } from "@/core/domain/partner/partner";

export interface PartnerRepository {
  listPublished(): Promise<Partner[]>;
}
