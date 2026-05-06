type Props = {
  username: string;
  createdAt: string;
  comment: string;
  /** When true, current user is the recipe owner (may delete comments per your RLS). */
  showDeleteButton?: boolean;
  onDelete?: () => void | Promise<void>;
};

function formatCommentDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function CommentItem({
  username,
  createdAt,
  comment,
  showDeleteButton = false,
  onDelete,
}: Props) {
  return (
    <article className="rounded-md border border-black/10 bg-black/[0.02] px-4 py-4 dark:border-white/15 dark:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <div className="text-sm font-semibold text-foreground">{username}</div>
          <time className="text-xs text-black/55 dark:text-white/55" dateTime={createdAt}>
            {formatCommentDate(createdAt)}
          </time>
        </div>
        {showDeleteButton ? (
          <button
            type="button"
            disabled={!onDelete}
            onClick={() => {
              if (!onDelete) return;
              if (!confirm("Delete this comment?")) return;
              void onDelete();
            }}
            className="shrink-0 text-xs font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
          >
            Delete
          </button>
        ) : null}
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{comment}</p>
    </article>
  );
}

