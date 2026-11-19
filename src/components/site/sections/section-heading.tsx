import { joinClassNames } from "@/lib/ui/class-names";

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  tone?: "light" | "dark";
  align?: "left" | "center";
};

const TONE_CLASS_NAMES = {
  light: { title: "text-foreground", accent: "text-primary", eyebrow: "text-muted-foreground", description: "text-muted-foreground" },
  dark: {
    title: "text-surface-inverse-foreground",
    accent: "text-accent",
    eyebrow: "text-surface-inverse-foreground/80",
    description: "text-surface-inverse-foreground/80",
  },
} as const;

function splitTitle(title: string): [string, string] {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) {
    return [title, ""];
  }
  const cut = Math.ceil(words.length / 2);
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
}

export function SectionHeading({ id, eyebrow, title, description, tone = "light", align = "left" }: SectionHeadingProps) {
  if (!eyebrow && !title && !description) {
    return null;
  }

  const classes = TONE_CLASS_NAMES[tone];
  const [lead, tail] = title ? splitTitle(title) : ["", ""];

  return (
    <header className={joinClassNames("mb-10 max-w-3xl md:mb-14", align === "center" ? "mx-auto text-center" : "")}>
      {eyebrow ? (
        <p className={joinClassNames("inline-flex items-center gap-2 text-sm font-semibold tracking-wide", classes.eyebrow)}>
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-highlight" />
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h2 id={id} className={joinClassNames("mt-3 text-3xl font-extrabold tracking-tighter md:text-5xl", classes.title)}>
          {lead}
          {tail ? <span className={classes.accent}>{` ${tail}`}</span> : null}
        </h2>
      ) : null}
      {description ? <p className={joinClassNames("mt-4 text-lg", classes.description)}>{description}</p> : null}
    </header>
  );
}
