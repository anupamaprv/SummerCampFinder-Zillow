import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Eye, EyeOff, Tent, Loader2, MailCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Kodanz" },
      { name: "description", content: "Sign in or create a free Kodanz account to save camps and enrichment programs." },
      { property: "og:title", content: "Sign in — Kodanz" },
      { property: "og:description", content: "Create a free Kodanz account to save the camps you love." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<"confirm" | "reset" | null>(null);

  async function handleGoogle() {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Google sign-in failed. Please try again.");
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/favorites" });
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSent("reset");
        return;
      }

      if (mode === "signup") {
        if (password.length < 8) {
          toast.error("Password must be at least 8 characters.");
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name.trim() },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSent("confirm");
          return;
        }
        toast.success("Welcome to Kodanz!");
        navigate({ to: "/favorites" });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Signed in");
      navigate({ to: "/favorites" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(
        /invalid login/i.test(message)
          ? "That email and password don't match."
          : /confirm/i.test(message)
            ? "Please confirm your email first — check your inbox."
            : message,
      );
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <Shell>
        <div className="text-center">
          <MailCheck className="mx-auto h-10 w-10 text-accent" />
          <h1 className="mt-4 text-2xl font-bold">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {sent === "confirm"
              ? `We sent a confirmation link to ${email}. Click it to activate your account.`
              : `We sent a password reset link to ${email}.`}
          </p>
          <button
            onClick={() => { setSent(null); setMode("signin"); }}
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "forgot"
            ? "We'll email you a link to set a new password."
            : "Save camps you love and come back to them anytime."}
        </p>
      </div>

      {mode !== "forgot" && (
        <>
          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl border bg-card py-3 text-sm font-semibold transition-colors hover:bg-secondary disabled:opacity-60"
          >
            <GoogleMark /> Continue with Google
          </button>
          <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <Field label="Your name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              placeholder="Ann Rajaram"
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>
        )}

        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent"
          />
        </Field>

        {mode !== "forgot" && (
          <Field
            label="Password"
            action={
              mode === "signin" ? (
                <button type="button" onClick={() => setMode("forgot")} className="text-xs font-semibold text-accent">
                  Forgot password?
                </button>
              ) : null
            }
          >
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === "signup" ? 8 : undefined}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
                className="w-full rounded-xl border bg-background px-4 py-3 pr-12 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
        )}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
          style={{ background: "var(--gradient-coral)", boxShadow: "var(--shadow-glow)" }}
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "signup" ? (
          <>Already have an account?{" "}
            <button onClick={() => setMode("signin")} className="font-semibold text-accent">Sign in</button>
          </>
        ) : mode === "signin" ? (
          <>New to Kodanz?{" "}
            <button onClick={() => setMode("signup")} className="font-semibold text-accent">Create an account</button>
          </>
        ) : (
          <button onClick={() => setMode("signin")} className="font-semibold text-accent">Back to sign in</button>
        )}
      </p>
    </Shell>
  );
}

function Field({ label, action, children }: { label: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label} {action}
      </span>
      {children}
    </label>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <Link to="/" className="mb-8 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl text-accent-foreground"
              style={{ background: "var(--gradient-coral)", boxShadow: "var(--shadow-glow)" }}>
          <Tent className="h-5 w-5" />
        </span>
        <span className="text-xl font-bold tracking-tight">Koda<span className="text-accent">nz</span></span>
      </Link>
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        {children}
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.4c-.5 2.9-2.2 5.4-4.7 7l7.6 5.9c4.4-4.1 6.8-10.1 6.8-17.2z" />
      <path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 0 1 9.6 24c0-1.6.3-3.2.8-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.4 0-11.7-3.7-13.6-8.9l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}
