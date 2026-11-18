import type { ModuleKey } from "@/core/domain/shared/module-key";

export type ContentBlockItemField = "title" | "description" | "icon" | "media" | "link";

export type ContentBlockDefinition = {
  key: string;
  label: string;
  itemFields: ContentBlockItemField[];
  minItems: number;
  maxItems: number;
};

export type ThemeConfig = {
  themeName: string;
  contentPack: string;
  enabledModules: ModuleKey[];
  contentBlocks: ContentBlockDefinition[];
};
