import Link from "next/link";
import type { ComponentProps, ComponentPropsWithoutRef } from "react";
import { joinClassNames } from "@/lib/ui/class-names";

type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse" | "highlight";
type ButtonSize = "md" | "lg";

type ButtonStyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const BASE_CLASS_NAME =
  "motion-press inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60";

const VARIANT_CLASS_NAMES: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "bg-secondary text-foreground hover:bg-border",
  highlight: "bg-highlight text-highlight-foreground hover:bg-highlight-hover",
  ghost: "text-primary hover:bg-accent hover:text-accent-foreground",
  inverse: "bg-surface text-surface-inverse hover:bg-accent hover:text-accent-foreground",
};

const SIZE_CLASS_NAMES: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 text-base",
  lg: "min-h-12 px-7 text-lg",
};

function buttonClassName(variant: ButtonVariant, size: ButtonSize, className?: string): string {
  return joinClassNames(BASE_CLASS_NAME, VARIANT_CLASS_NAMES[variant], SIZE_CLASS_NAMES[size], className);
}

export type ButtonProps = ComponentProps<"button"> & ButtonStyleProps;

export function Button({ variant = "primary", size = "md", type = "button", className, ...props }: ButtonProps) {
  return <button type={type} className={buttonClassName(variant, size, className)} {...props} />;
}

export type ButtonLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> &
  ButtonStyleProps & {
    href: string;
    external?: boolean;
  };

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  external = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const resolvedClassName = buttonClassName(variant, size, className);

  if (external) {
    return (
      <a {...props} href={href} target="_blank" rel="noopener noreferrer" className={resolvedClassName}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={resolvedClassName} {...props}>
      {children}
    </Link>
  );
}
