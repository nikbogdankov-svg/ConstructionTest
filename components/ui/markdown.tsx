import * as React from "react";
import ReactMarkdown, { type Components, type Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const baseComponents: Components = {
  h1: ({ node: _node, ...p }) => <h2 className="mt-6 mb-2 font-display text-h3 first:mt-0" {...p} />,
  h2: ({ node: _node, ...p }) => <h3 className="mt-5 mb-2 font-display text-h3 first:mt-0" {...p} />,
  h3: ({ node: _node, ...p }) => <h4 className="mt-4 mb-1 text-h4 first:mt-0" {...p} />,
  p: ({ node: _node, ...p }) => <p className="my-2 first:mt-0 last:mb-0" {...p} />,
  ul: ({ node: _node, ...p }) => <ul className="my-2 list-disc space-y-1 pl-6 marker:text-primary" {...p} />,
  ol: ({ node: _node, ...p }) => <ol className="my-2 list-decimal space-y-1 pl-6 marker:font-bold marker:text-foreground-muted" {...p} />,
  li: ({ node: _node, ...p }) => <li className="pl-1" {...p} />,
  strong: ({ node: _node, ...p }) => <strong className="font-bold text-foreground" {...p} />,
  a: ({ node: _node, ...p }) => (
    <a className="font-bold text-primary underline decoration-2 underline-offset-4 hover:decoration-3 focus-visible:focus-ring" {...p} />
  ),
  code: ({ node: _node, ...p }) => <code className="rounded-xs bg-surface-sunken px-1.5 py-0.5 font-mono text-code" {...p} />,
  blockquote: ({ node: _node, ...p }) => (
    <blockquote className="my-3 border-l-4 border-primary bg-surface-sunken px-4 py-2 text-foreground-muted" {...p} />
  ),
  table: ({ node: _node, ...p }) => (
    <div className="my-3 overflow-x-auto rounded-sm border-2 border-border">
      <table className="w-full border-collapse text-body-sm" {...p} />
    </div>
  ),
  th: ({ node: _node, ...p }) => <th className="border-b-2 border-border bg-surface-sunken px-3 py-2 text-left font-bold" {...p} />,
  td: ({ node: _node, ...p }) => <td className="border-b border-border px-3 py-2" {...p} />,
  hr: () => <hr className="my-4 border-t-2 border-border" />,
};

export interface MarkdownProps {
  children: string;
  className?: string;
  /** Override or extend element renderers (e.g. to turn custom links into components). */
  components?: Components;
  remarkPlugins?: NonNullable<Options["remarkPlugins"]>;
}

/** Renders trusted markdown with brand typography. Raw HTML is not rendered. */
export function Markdown({ children, className, components, remarkPlugins = [] }: MarkdownProps) {
  return (
    <div className={cn("text-body text-foreground", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm, ...remarkPlugins]} components={{ ...baseComponents, ...components }}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
