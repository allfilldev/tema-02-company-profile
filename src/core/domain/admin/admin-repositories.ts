import type { SiteSettings } from "@/core/domain/settings/site-settings";
import type { AdminInputByModule, AdminModule, AdminRecordByModule, ContactMessage, MediaRecord } from "@/core/domain/admin/records";

export type MoveDirection = "up" | "down";

export interface AdminCollectionRepository<Module extends AdminModule> {
  list(): Promise<AdminRecordByModule[Module][]>;
  findById(id: string): Promise<AdminRecordByModule[Module] | null>;
  create(input: AdminInputByModule[Module]): Promise<AdminRecordByModule[Module]>;
  update(id: string, input: AdminInputByModule[Module]): Promise<AdminRecordByModule[Module]>;
  remove(id: string): Promise<void>;
  setPublished(id: string, published: boolean): Promise<AdminRecordByModule[Module]>;
  move(id: string, direction: MoveDirection): Promise<void>;
}

export interface ArticleAuthorCounts {
  all: number;
  published: number;
}

export interface ArticleAdminRepository {
  countByAuthor(teamMemberId: string): Promise<ArticleAuthorCounts>;
}

export interface MediaAdminRepository {
  list(): Promise<MediaRecord[]>;
  findById(id: string): Promise<MediaRecord | null>;
  create(record: Omit<MediaRecord, "id" | "createdAt">): Promise<MediaRecord>;
  updateAlt(id: string, alt: string): Promise<MediaRecord>;
  remove(id: string): Promise<void>;
  findUsages(id: string): Promise<string[]>;
}

export interface MessageAdminRepository {
  list(): Promise<ContactMessage[]>;
  markRead(id: string): Promise<void>;
  remove(id: string): Promise<void>;
  countUnread(): Promise<number>;
}

export interface SettingsAdminRepository {
  get(): Promise<SiteSettings>;
  update(settings: SiteSettings): Promise<SiteSettings>;
}

export type AdminCollections = { [Module in AdminModule]: AdminCollectionRepository<Module> };
