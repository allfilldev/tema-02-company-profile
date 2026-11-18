import { Children, isValidElement, type ComponentProps } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { joinClassNames } from "@/lib/ui/class-names";

const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 800;
const EXTERNAL_LINK_PATTERN = /^(?:https?:)?\/\//i;

type MarkdownContentProps = {
  source: string;
  className?: string;
};

function MarkdownImage({ src, alt }: ComponentProps<"img">) {
  if (!src) {
    return null;
  }
  return (
    <img
      src={src}
      alt={alt ?? ""}
      width={IMAGE_WIDTH}
      height={IMAGE_HEIGHT}
      loading="lazy"
      decoding="async"
      style={{ height: "auto" }}
      className="max-w-full rounded-md"
    />
  );
}

function MarkdownParagraph({ children }: ComponentProps<"p">) {
  const parts = Children.toArray(children).filter((part) => !(typeof part === "string" && part.trim() === ""));
  const [only] = parts;

  if (parts.length === 1 && isValidElement<ComponentProps<"img">>(only) && only.type === MarkdownImage) {
    const { src, alt, title } = only.props;
    if (!src) {
      return null;
    }
    return (
      <figure className="my-6">
        <MarkdownImage src={src} alt={alt} />
        {title ? <figcaption className="mt-2 text-sm text-muted-foreground">{title}</figcaption> : null}
      </figure>
    );
  }

  return <p className="my-4">{children}</p>;
}

function MarkdownLink({ href, children }: ComponentProps<"a">) {
  const className = "font-medium text-primary underline underline-offset-4 hover:text-primary-hover";

  if (!href) {
    return <>{children}</>;
  }
  if (EXTERNAL_LINK_PATTERN.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

function MarkdownSectionHeading({ children }: ComponentProps<"h2">) {
  return <h2 className="mb-4 mt-10 text-2xl font-bold tracking-tight text-foreground md:text-3xl">{children}</h2>;
}

function MarkdownBoldHeading({ children }: ComponentProps<"h4">) {
  return (
    <p className="my-4">
      <strong>{children}</strong>
    </p>
  );
}

const COMPONENTS: Components = {
  h1: MarkdownSectionHeading,
  h2: MarkdownSectionHeading,
  h3: ({ children }) => <h3 className="mb-3 mt-8 text-xl font-semibold text-foreground">{children}</h3>,
  h4: MarkdownBoldHeading,
  h5: MarkdownBoldHeading,
  h6: MarkdownBoldHeading,
  p: MarkdownParagraph,
  a: MarkdownLink,
  img: MarkdownImage,
  ul: ({ children, className }) => (
    <ul className={joinClassNames("my-4 list-disc space-y-2 pl-6", className)}>{children}</ul>
  ),
  ol: ({ children, className }) => (
    <ol className={joinClassNames("my-4 list-decimal space-y-2 pl-6", className)}>{children}</ol>
  ),
  li: ({ children, className }) => <li className={className}>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-border-strong pl-4 text-muted-foreground">{children}</blockquote>
  ),
  hr: () => <hr className="my-8 border-border" />,
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-md bg-surface-muted p-4 text-sm">{children}</pre>
  ),
  code: ({ children, className }) => (
    <code className={joinClassNames("rounded-sm bg-surface-muted px-1 py-0.5 text-sm", className)}>{children}</code>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-base">{children}</table>
    </div>
  ),
  th: ({ children, style }) => (
    <th style={style} className="border border-border bg-surface-muted px-3 py-2 font-semibold">
      {children}
    </th>
  ),
  td: ({ children, style }) => (
    <td style={style} className="border border-border px-3 py-2">
      {children}
    </td>
  ),
};

export function MarkdownContent({ source, className }: MarkdownContentProps) {
  return (
    <div className={joinClassNames("text-base leading-7 text-foreground", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
