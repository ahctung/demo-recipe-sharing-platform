"use client";

import { useMemo, useState } from "react";

import { CommentItem } from "@/components/CommentItem";

export type CommentSectionItem = {
  id: string;
  username: string;
  createdAt: string;
  comment: string;
};

type Props = {
  comments: CommentSectionItem[];
  onPostComment?: (comment: string) => void | Promise<void>;
  isPosting?: boolean;
  /** True when the signed-in user owns the recipe (show delete on each comment). */
  showDeleteForRecipeOwner?: boolean;
  onDeleteComment?: (commentId: string) => void | Promise<void>;
};

export function CommentSection({
  comments,
  onPostComment,
  isPosting = false,
  showDeleteForRecipeOwner = false,
  onDeleteComment,
}: Props) {
  const [draft, setDraft] = useState("");
  const countLabel = useMemo(() => {
    const n = comments.length;
    return n === 1 ? "Comment (1)" : `Comments (${n})`;
  }, [comments.length]);

  const canPost = draft.trim().length > 0 && !isPosting;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">{countLabel}</h2>

      <div className="space-y-3">
        <div className="text-base font-semibold text-foreground">Comments</div>

        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Add a comment..."
          className="w-full resize-y rounded-md border border-black/10 bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
        />

        <button
          type="button"
          disabled={!canPost}
          onClick={async () => {
            const text = draft.trim();
            if (!text || !onPostComment) return;
            await onPostComment(text);
            setDraft("");
          }}
          className={[
            "inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-medium",
            canPost
              ? "bg-foreground text-background hover:opacity-90"
              : "cursor-not-allowed bg-black/10 text-black/50 dark:bg-white/10 dark:text-white/50",
          ].join(" ")}
        >
          {isPosting ? "Posting..." : "Post Comment"}
        </button>
      </div>

      <div className="space-y-3">
        {comments.map((c) => (
          <CommentItem
            key={c.id}
            username={c.username}
            createdAt={c.createdAt}
            comment={c.comment}
            showDeleteButton={showDeleteForRecipeOwner}
            onDelete={
              onDeleteComment ? () => onDeleteComment(c.id) : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}

