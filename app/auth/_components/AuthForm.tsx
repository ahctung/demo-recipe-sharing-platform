import Link from "next/link";

type Props = {
  /** Card title */
  title: string;
  /** Short description under title */
  description: string;
  /** Server action for the form */
  action: (formData: FormData) => void | Promise<void>;
  /** Submit button label */
  submitLabel: string;
  /** Optional banner shown above the form */
  banner?: { tone: "error" | "success"; message: string } | null;
  /** Footer prompt + link */
  footer: { text: string; linkText: string; href: string };
  /** Password input autocomplete value */
  passwordAutoComplete: "current-password" | "new-password";
  /** Password minimum length */
  passwordMinLength?: number;
};

export function AuthForm({
  title,
  description,
  action,
  submitLabel,
  banner,
  footer,
  passwordAutoComplete,
  passwordMinLength,
}: Props) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-14">
      <main className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            {description}
          </p>
        </div>

        {banner ? (
          <div
            className={
              banner.tone === "success"
                ? "mb-4 rounded-md border border-emerald-600/30 bg-emerald-600/[0.06] px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200"
                : "mb-4 rounded-md border border-red-600/30 bg-red-600/[0.06] px-4 py-3 text-sm text-red-700 dark:text-red-200"
            }
          >
            {banner.message}
          </div>
        ) : null}

        <form
          action={action}
          className="rounded-xl border border-black/10 bg-background p-6 shadow-sm dark:border-white/15"
        >
          <label className="block">
            <span className="text-xs font-medium text-black/70 dark:text-white/70">
              Email
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 h-11 w-full rounded-md border border-black/10 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-medium text-black/70 dark:text-white/70">
              Password
            </span>
            <input
              name="password"
              type="password"
              autoComplete={passwordAutoComplete}
              required
              minLength={passwordMinLength}
              className="mt-2 h-11 w-full rounded-md border border-black/10 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
            />
          </label>

          <button
            type="submit"
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background hover:opacity-90"
          >
            {submitLabel}
          </button>

          <p className="mt-4 text-center text-sm text-black/60 dark:text-white/60">
            {footer.text}{" "}
            <Link
              href={footer.href}
              className="font-medium text-foreground hover:opacity-80"
            >
              {footer.linkText}
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}

