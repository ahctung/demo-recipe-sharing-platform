import { signupAction } from "@/app/auth/actions";
import { AuthForm } from "@/components/AuthForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;

  const banner = error ? { tone: "error" as const, message: error } : null;

  return (
    <AuthForm
      title="Create account"
      description="Email-only auth for MVP. You can add social login later."
      action={signupAction}
      submitLabel="Sign up"
      banner={banner}
      footer={{
        text: "Already have an account?",
        linkText: "Log in",
        href: "/auth/login",
      }}
      passwordAutoComplete="new-password"
      passwordMinLength={6}
    />
  );
}

