import { skeletonKindForPath, type SkeletonKind } from "./skeleton-kind";

export type LinkClick = {
  href: string | null;
  target: string | null;
  download: boolean;
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  defaultPrevented: boolean;
};

export type LinkClickOutcome = { type: "navigate"; kind: SkeletonKind } | { type: "same-page" } | null;

const PRIMARY_BUTTON = 0;
const SAME_TAB_TARGETS: readonly string[] = ["", "_self"];
const WEB_PROTOCOLS: readonly string[] = ["http:", "https:"];

function normalizePathname(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function isSamePathname(first: string, second: string): boolean {
  return normalizePathname(first) === normalizePathname(second);
}

function isPlainPrimaryClick(click: LinkClick): boolean {
  return click.button === PRIMARY_BUTTON && !click.metaKey && !click.ctrlKey && !click.shiftKey && !click.altKey;
}

function opensInSameTab(target: string | null): boolean {
  return target === null || SAME_TAB_TARGETS.includes(target.trim().toLowerCase());
}

function parseUrl(href: string, base?: string): URL | null {
  try {
    return new URL(href, base);
  } catch {
    return null;
  }
}

export function resolveLinkClick(click: LinkClick, currentHref: string): LinkClickOutcome {
  if (!click.defaultPrevented || click.download || click.href === null) {
    return null;
  }

  if (!isPlainPrimaryClick(click) || !opensInSameTab(click.target)) {
    return null;
  }

  const current = parseUrl(currentHref);
  const destination = current === null ? null : parseUrl(click.href, current.href);

  if (current === null || destination === null) {
    return null;
  }

  if (!WEB_PROTOCOLS.includes(destination.protocol) || destination.origin !== current.origin) {
    return null;
  }

  if (isSamePathname(destination.pathname, current.pathname)) {
    return { type: "same-page" };
  }

  return { type: "navigate", kind: skeletonKindForPath(destination.pathname) };
}
