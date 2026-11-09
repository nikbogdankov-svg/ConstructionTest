/**
 * Brand fonts, loaded with next/font (self-hosted at build time, no runtime
 * requests to Google). This file and styles/tokens.css are the only places
 * where font families are named.
 */
import {
  Atkinson_Hyperlegible_Mono,
  Atkinson_Hyperlegible_Next,
  Barlow_Condensed,
} from "next/font/google";

export const fontDisplay = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const fontSans = Atkinson_Hyperlegible_Next({
  subsets: ["latin", "latin-ext"],
  variable: "--font-atkinson-next",
  display: "swap",
  adjustFontFallback: false,
});

export const fontMono = Atkinson_Hyperlegible_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-atkinson-mono",
  display: "swap",
  adjustFontFallback: false,
});

export const fontVariables = [fontDisplay.variable, fontSans.variable, fontMono.variable].join(" ");
