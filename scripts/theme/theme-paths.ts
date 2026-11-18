import path from "node:path";

export interface ThemePaths {
  siteType: string;
  boilerplateDir: string;
  targetDir: string;
}

export function resolveThemePaths(boilerplateDir: string, themeName: string): ThemePaths {
  if (path.basename(path.dirname(boilerplateDir)) !== "boilerplates") {
    throw new Error("Run this command from template-builder/boilerplates/<site-type>/.");
  }

  const siteType = path.basename(boilerplateDir);

  return {
    siteType,
    boilerplateDir,
    targetDir: path.resolve(boilerplateDir, "..", "..", "themes", siteType, themeName),
  };
}
