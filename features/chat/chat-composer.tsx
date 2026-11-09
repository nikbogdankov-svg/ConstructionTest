"use client";

import * as React from "react";
import { ArrowUp, Square } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Kbd } from "@/components/ui/kbd";
import { Textarea } from "@/components/ui/textarea";

export interface ChatComposerProps {
  isBusy: boolean;
  /** Returns true when the question was accepted (the input is then cleared). */
  onSend: (question: string) => boolean;
  onStop: () => void;
}

export interface ChatComposerHandle {
  focus: () => void;
}

/** Multi-line question input. Enter sends, Shift+Enter adds a line, Stop while an answer streams. */
export const ChatComposer = React.forwardRef<ChatComposerHandle, ChatComposerProps>(function ChatComposer(
  { isBusy, onSend, onStop },
  ref,
) {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const hintId = React.useId();
  const inputId = React.useId();
  const isEmpty = value.trim().length === 0;

  React.useImperativeHandle(ref, () => ({ focus: () => textareaRef.current?.focus() }), []);

  const submit = () => {
    if (isEmpty || isBusy) return;
    if (onSend(value)) setValue("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-col gap-2"
    >
      <label htmlFor={inputId} className="sr-only">
        Ask a question about this project
      </label>
      <div className="flex items-end gap-2">
        <Textarea
          id={inputId}
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          autoResize
          maxRows={6}
          placeholder="Ask about specs, deadlines, changes…"
          aria-describedby={hintId}
          className="min-h-control-lg flex-1"
        />
        {isBusy ? (
          <IconButton variant="secondary" size="lg" label="Stop answering" onClick={onStop}>
            <Square aria-hidden />
          </IconButton>
        ) : (
          <IconButton type="submit" variant="accent" size="lg" label="Send question" disabled={isEmpty}>
            <ArrowUp aria-hidden />
          </IconButton>
        )}
      </div>
      <p id={hintId} className="hidden items-center gap-1.5 text-caption text-foreground-subtle sm:flex">
        <Kbd>Enter</Kbd> to send · <Kbd>Shift</Kbd> + <Kbd>Enter</Kbd> for a new line
      </p>
    </form>
  );
});
