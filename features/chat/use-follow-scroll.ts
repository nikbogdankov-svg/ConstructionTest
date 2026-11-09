"use client";

import * as React from "react";

const NEAR_BOTTOM_PX = 120;

function isNearBottom() {
  const { scrollHeight } = document.documentElement;
  return window.innerHeight + window.scrollY >= scrollHeight - NEAR_BOTTOM_PX;
}

function scrollToBottom(smooth: boolean) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: smooth && !reduceMotion ? "smooth" : "auto" });
}

/**
 * Keeps the page pinned to the bottom while `signal` changes (e.g. streaming tokens),
 * unless the user has scrolled up. Returns whether a "jump to latest" control is needed.
 */
export function useFollowScroll(signal: string) {
  const followRef = React.useRef(true);
  const [isAtBottom, setIsAtBottom] = React.useState(true);

  React.useEffect(() => {
    const onScroll = () => {
      const near = isNearBottom();
      followRef.current = near;
      setIsAtBottom(near);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  React.useLayoutEffect(() => {
    if (followRef.current) scrollToBottom(false);
  }, [signal]);

  const jumpToLatest = React.useCallback(() => {
    followRef.current = true;
    scrollToBottom(true);
  }, []);

  /** Call when the user sends a question: always follow their new message. */
  const follow = React.useCallback(() => {
    followRef.current = true;
  }, []);

  return { isAtBottom, jumpToLatest, follow };
}
