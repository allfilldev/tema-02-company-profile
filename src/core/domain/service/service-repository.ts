import type { Service } from "@/core/domain/service/service";

export interface ServiceRepository {
  listPublished(): Promise<Service[]>;
  findPublishedBySlug(slug: string): Promise<Service | null>;
}
