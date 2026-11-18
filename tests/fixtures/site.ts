import { createSiteQueries, type SiteQueries } from "@/core/application/site/site-queries";
import type { ThemeConfig } from "@/core/domain/theme/theme-config";
import { themeConfig } from "@/config/theme";
import { createFixtureRepositories } from "@/infrastructure/fixtures/fixture-repositories";
import { getSiteContext, type SiteContext } from "@/server/site/site-context";
import type { SiteEnv } from "@/server/site/site-env";
import { buildTestLinkedBlocks, buildTestPack } from "./content-pack";

type TestContextOverrides = {
  env?: Partial<SiteEnv>;
  theme?: Partial<ThemeConfig>;
};

function buildTestTheme(theme: Partial<ThemeConfig> | undefined): ThemeConfig {
  return { ...themeConfig, ...theme };
}

export function buildTestQueries(theme?: Partial<ThemeConfig>): SiteQueries {
  return createSiteQueries(createFixtureRepositories(buildTestPack()), buildTestTheme(theme));
}

export function buildLinkedBlocksQueries(theme?: Partial<ThemeConfig>): SiteQueries {
  const pack = { ...buildTestPack(), contentBlocks: buildTestLinkedBlocks() };
  return createSiteQueries(createFixtureRepositories(pack), buildTestTheme(theme));
}

export function buildTestEnv(overrides?: Partial<SiteEnv>): SiteEnv {
  return {
    siteUrl: "https://nusakarya.example",
    indexingEnabled: true,
    isDemo: true,
    ...overrides,
  };
}

export async function buildTestContext(overrides?: TestContextOverrides): Promise<SiteContext> {
  const theme = buildTestTheme(overrides?.theme);
  return getSiteContext(buildTestQueries(overrides?.theme), buildTestEnv(overrides?.env), theme);
}
