"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { controlBase } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { useFormFieldControlProps } from "./form-field";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  /** Allow clearing by selecting the active option again. */
  clearable?: boolean;
}

/** Searchable single select (Popover + cmdk). */
export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Type to filter…",
  emptyText = "No matches.",
  disabled,
  size = "md",
  className,
  clearable = true,
  ...rest
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const fieldProps = useFormFieldControlProps({ ...rest, disabled });
  const selected = options.find((o) => o.value === value);
  const listId = React.useId();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          {...fieldProps}
          className={cn(
            controlBase,
            "flex items-center justify-between gap-2 text-left",
            size === "sm" && "h-control-sm px-3 text-body-sm",
            size === "md" && "h-control-md px-4",
            size === "lg" && "h-control-lg px-4 text-body-lg",
            !selected && "text-foreground-subtle",
            className,
          )}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronsUpDown className="size-icon-md shrink-0 text-foreground-muted" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-64 p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList id={listId}>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.label} ${option.value}`}
                  disabled={option.disabled}
                  onSelect={() => {
                    onValueChange(clearable && option.value === value ? null : option.value);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("text-primary", option.value === value ? "opacity-100" : "opacity-0")} strokeWidth={2.5} aria-hidden />
                  <span className="flex flex-col">
                    <span>{option.label}</span>
                    {option.description && <span className="text-body-sm text-foreground-muted">{option.description}</span>}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
