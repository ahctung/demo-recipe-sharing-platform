import { loginAction } from "@/app/auth/actions";
import { AuthForm } from "@/app/auth/_components/AuthForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;
  const success = typeof sp.success === "string" ? sp.success : null;

  const banner =
    error
      ? { tone: "error" as const, message: error }
      : success === "check-email"
        ? {
            tone: "success" as const,
            message:
              "Check your email to confirm your account, then come back and log in.",
          }
        : null;

  return (
    <AuthForm
      title="Log in"
      description="Use your email and password to continue."
      action={loginAction}
      submitLabel="Log in"
      banner={banner}
      footer={{ text: "No account?", linkText: "Sign up", href: "/auth/signup" }}
      passwordAutoComplete="current-password"
    />
  );
}

