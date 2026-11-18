export type ClassNamePart = string | false | null | undefined;

export function joinClassNames(...parts: ClassNamePart[]): string {
  return parts.filter((part): part is string => typeof part === "string" && part.length > 0).join(" ");
}
