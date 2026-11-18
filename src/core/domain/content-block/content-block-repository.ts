import type { ContentBlock } from "@/core/domain/content-block/content-block";

export interface ContentBlockRepository {
  findPublishedByKey(key: string): Promise<ContentBlock | null>;
}
