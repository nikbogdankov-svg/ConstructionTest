import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Wrap tables in this so they scroll horizontally on narrow screens instead of breaking the page. */
export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-x-auto rounded-md border-2 border-border bg-surface">
      <table className={cn("w-full caption-bottom border-collapse text-body", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-surface-sunken [&_tr]:border-b-2 [&_tr]:border-border-strong", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableFooter({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tfoot className={cn("border-t-2 border-border bg-surface-sunken font-bold", className)} {...props} />;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Adds hover state for rows that open something. */
  interactive?: boolean;
  selected?: boolean;
}

export function TableRow({ className, interactive, selected, ...props }: TableRowProps) {
  return (
    <tr
      aria-selected={selected || undefined}
      className={cn(
        "border-b border-border transition-colors",
        interactive && "hover:bg-surface-hover focus-within:bg-surface-hover",
        selected && "bg-primary-subtle hover:bg-primary-subtle",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn(
        "h-control-md px-4 text-left align-middle text-overline uppercase text-foreground-muted whitespace-nowrap",
        className,
      )}
      {...props}
    />
  );
}

export type SortState = "asc" | "desc" | false;

export interface SortableTableHeadProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, "onClick"> {
  sorted: SortState;
  onSort: () => void;
}

/** Column header that toggles sorting. Sets aria-sort and is a real button. */
export function SortableTableHead({ sorted, onSort, children, className, ...props }: SortableTableHeadProps) {
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;
  return (
    <TableHead
      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none"}
      className={cn("px-2", className)}
      {...props}
    >
      <button
        type="button"
        onClick={onSort}
        className={cn(
          "-my-1 inline-flex min-h-control-sm items-center gap-1.5 rounded-sm px-2 uppercase transition-colors",
          "hover:bg-surface-active hover:text-foreground focus-visible:focus-ring",
          sorted && "text-foreground",
        )}
      >
        {children}
        <Icon className={cn("size-icon-sm", !sorted && "text-foreground-subtle")} aria-hidden />
      </button>
    </TableHead>
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3 align-middle", className)} {...props} />;
}

export function TableCaption({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={cn("px-4 py-3 text-left text-body-sm text-foreground-muted", className)} {...props} />;
}
