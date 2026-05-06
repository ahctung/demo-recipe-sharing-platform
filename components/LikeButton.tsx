"use client";

import { type ButtonHTMLAttributes } from "react";

type Props = {
  likeCount: number;
  liked: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed">;

function HeartIcon({ liked }: { liked: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill={liked ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.999 21s-7.25-4.35-9.75-8.58C.56 9.17 2.09 6.31 5.02 5.43c1.74-.52 3.6.05 4.78 1.46.95 1.12 1.47 2.55 2.2 2.55s1.26-1.43 2.2-2.55c1.18-1.41 3.04-1.98 4.78-1.46 2.93.88 4.46 3.74 2.77 6.99C19.249 16.65 11.999 21 11.999 21z"
      />
    </svg>
  );
}

export function LikeButton({ likeCount, liked, className = "", ...rest }: Props) {
  return (
    <button
      {...rest}
      type={rest.type ?? "button"}
      aria-pressed={liked}
      className={[
        "inline-flex items-center gap-2 rounded-md px-1 py-0.5 text-sm font-medium",
        "text-foreground hover:bg-black/5 dark:hover:bg-white/10",
        liked ? "text-rose-600 dark:text-rose-400" : "text-foreground",
        className,
      ].join(" ")}
    >
      <HeartIcon liked={liked} />
      <span className="tabular-nums">{likeCount}</span>
    </button>
  );
}

