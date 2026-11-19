import { createElement, type AnchorHTMLAttributes, type ImgHTMLAttributes, type ReactNode } from "react";
import { vi } from "vitest";

const NON_DOM_IMAGE_PROPS = ["priority", "preload", "fill", "quality", "placeholder", "blurDataURL", "unoptimized", "loader"];
const NON_DOM_LINK_PROPS = ["prefetch", "replace", "scroll"];

function pickDomProps<Attributes>(props: object, nonDomProps: string[]): Attributes {
  return Object.fromEntries(Object.entries(props).filter(([name]) => !nonDomProps.includes(name))) as Attributes;
}

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => createElement("img", pickDomProps<ImgHTMLAttributes<HTMLImageElement>>(props, NON_DOM_IMAGE_PROPS)),
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: Record<string, unknown> & { children?: ReactNode }) =>
    createElement("a", pickDomProps<AnchorHTMLAttributes<HTMLAnchorElement>>(props, NON_DOM_LINK_PROPS), children),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: () => undefined, replace: () => undefined, prefetch: () => undefined }),
}));

vi.mock("server-only", () => ({}));
