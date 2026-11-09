import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge needs to know about the custom type scale, otherwise it
 * treats `text-body` (font-size) and `text-foreground` (colour) as the same
 * group and drops one of them.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display", "h1", "h2", "h3", "h4", "body-lg", "body", "body-sm",
            "label", "caption", "overline", "code",
          ],
        },
      ],
      shadow: [{ shadow: ["xs", "sm", "md", "lg", "none"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
