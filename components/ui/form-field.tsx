"use client";

import * as React from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

interface FormFieldContextValue {
  id: string;
  hintId?: string;
  errorId?: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

/**
 * Controls inside a FormField (Input, Textarea, SelectTrigger, Combobox…) call
 * this to pick up id, aria-describedby and aria-invalid automatically.
 */
export function useFormField() {
  return React.useContext(FormFieldContext);
}

/** Props a control should spread to get wired into its FormField. */
export function useFormFieldControlProps(props: {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
  disabled?: boolean;
  required?: boolean;
}) {
  const field = useFormField();
  const describedBy = [props["aria-describedby"], field?.hintId, field?.errorId].filter(Boolean).join(" ") || undefined;
  return {
    id: props.id ?? field?.id,
    "aria-describedby": describedBy,
    "aria-invalid": props["aria-invalid"] ?? (field?.invalid ? true : undefined),
    disabled: props.disabled ?? field?.disabled,
    required: props.required ?? field?.required,
  };
}

export interface FormFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label: React.ReactNode;
  /** Helper text under the control. */
  hint?: React.ReactNode;
  /** Error text. Presence marks the control invalid. */
  error?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  /** Provide to override the generated id. */
  id?: string;
  /** Visually hide the label (it stays available to screen readers). */
  hideLabel?: boolean;
  /** Extra element on the label row, e.g. a character counter. */
  labelAside?: React.ReactNode;
  children: React.ReactNode;
}

export function FormField({
  label,
  hint,
  error,
  required = false,
  optional = false,
  disabled = false,
  id: idProp,
  hideLabel = false,
  labelAside,
  className,
  children,
  ...props
}: FormFieldProps) {
  const autoId = React.useId();
  const id = idProp ?? `field-${autoId}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <FormFieldContext.Provider value={{ id, hintId, errorId, invalid: Boolean(error), disabled, required }}>
      <div className={cn("flex flex-col gap-2", className)} {...props}>
        <div className={cn("flex items-baseline justify-between gap-3", hideLabel && "sr-only")}>
          <Label htmlFor={id} required={required} optional={optional} disabled={disabled}>
            {label}
          </Label>
          {labelAside}
        </div>
        {children}
        {hint && !error && (
          <p id={hintId} className="text-body-sm text-foreground-muted">
            {hint}
          </p>
        )}
        {hint && error && (
          <p id={hintId} className="sr-only">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="flex items-start gap-1.5 text-body-sm font-bold text-danger" role="alert">
            <CircleAlert className="mt-0.5 size-icon-sm shrink-0" aria-hidden />
            <span>{error}</span>
          </p>
        )}
      </div>
    </FormFieldContext.Provider>
  );
}
