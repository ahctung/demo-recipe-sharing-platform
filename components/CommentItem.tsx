type Props = {
  username: string;
  createdAt: string;
  comment: string;
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

export function CommentItem({ username, createdAt, comment }: Props) {
  return (
    <article className="rounded-md border border-black/10 bg-black/[0.02] px-4 py-4 dark:border-white/15 dark:bg-white/[0.04]">
      <div className="space-y-0.5">
        <div className="text-sm font-semibold text-foreground">{username}</div>
        <time className="text-xs text-black/55 dark:text-white/55" dateTime={createdAt}>
          {formatCommentDate(createdAt)}
        </time>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{comment}</p>
    </article>
  );
}

