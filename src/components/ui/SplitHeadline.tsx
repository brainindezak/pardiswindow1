"use client";

import { useRef, type CSSProperties } from "react";
import { useInViewOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Word-by-word masked reveal for display headlines. Persian text is split on
 * spaces only (never inside a word) so shaping and ZWNJ joins stay intact.
 */
export function SplitHeadline({
  text,
  as: Tag = "h2",
  className,
  stagger = 55,
  delay = 0,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const shown = useInViewOnce(ref, 0.4);
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={cn("split-headline", shown && "is-shown", className)} aria-label={text}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="split-word" aria-hidden>
          <span className="split-word-inner" style={{ "--d": `${delay + index * stagger}ms` } as CSSProperties}>
            {word}
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
