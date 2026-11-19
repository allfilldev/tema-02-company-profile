export type MigrationFile = {
  version: string;
  name: string;
  fileName: string;
};

const FILE_NAME_PATTERN = /^(\d{14})_([a-z_]+)\.sql$/;

export function parseMigrationFileName(fileName: string): MigrationFile | null {
  const match = FILE_NAME_PATTERN.exec(fileName);
  return match ? { version: match[1], name: match[2], fileName } : null;
}

export function pendingMigrations(fileNames: readonly string[], appliedVersions: readonly string[]): MigrationFile[] {
  const migrations = fileNames
    .map(parseMigrationFileName)
    .filter((migration): migration is MigrationFile => migration !== null)
    .sort((left, right) => left.version.localeCompare(right.version));

  const known = new Set(migrations.map((migration) => migration.version));
  const missing = appliedVersions.filter((version) => !known.has(version));
  if (missing.length > 0) {
    throw new Error(`Applied migrations are missing from supabase/migrations: ${missing.join(", ")}`);
  }

  const applied = new Set(appliedVersions);
  return migrations.filter((migration) => !applied.has(migration.version));
}
