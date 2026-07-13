"use client";

import { DREAMSAFER_URL } from "@/lib/dreamsafer";

/** Renders text with "DreamSafer" as a clickable product link when present */
export function DreamSaferText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const match = text.match(/DreamSafer(?:™)?/);
  if (!match || match.index === undefined) {
    return <span className={className}>{text}</span>;
  }
  const before = text.slice(0, match.index);
  const after = text.slice(match.index + match[0].length);
  return (
    <span className={className}>
      {before}
      <a
        href={DREAMSAFER_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="font-semibold text-teal-700 underline decoration-teal-500/50 underline-offset-2 hover:text-teal-600 dark:text-teal-300 dark:hover:text-teal-200"
      >
        {match[0]}
      </a>
      {after}
    </span>
  );
}
