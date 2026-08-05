import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Lock, UserRound } from "lucide-react";
import { signInWithEmail, signUpWithEmail, getCurrentUser } from "@/lib/supabase-auth";
import { upsertProfileForUser } from "@/lib/profile-service";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const user = await getCurrentUser();
      if (user) navigate({ to: "/profile" });
    })();
  }, [navigate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "signup") {
        const result = await signUpWithEmail(email, password, name);
        if (!result.ok) {
          setError(result.error?.message || "Unable to create your account.");
          return;
        }

        if (result.data?.user?.id) {
          await upsertProfileForUser(result.data.user.id, {
            full_name: name.trim() || undefined,
            username: email.split("@")[0] || undefined,
          });
        }

        setMessage("Account created. Check your inbox if email confirmation is enabled.");
      } else {
        const result = await signInWithEmail(email, password);
        if (!result.ok) {
          setError(result.error?.message || "Unable to sign in.");
          return;
        }

        if (result.data?.user?.id) {
          await upsertProfileForUser(result.data.user.id, {
            username: result.data.user.email?.split("@")[0] || undefined,
          });
        }

        navigate({ to: "/profile" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#140f0b] px-4 py-10 text-[#f7ebd2] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-md rounded-[1.4rem] border border-[#ff7a1a]/20 bg-[#1f1610] p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ff7a1a]">
            LocalEats
          </p>
          <h1 className="mt-2 font-display text-2xl font-extrabold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-[#c9af87]">
            {mode === "login"
              ? "Sign in to publish spots and leave reviews."
              : "Join the community and help others discover Lomé’s best bites."}
          </p>
        </div>

        <div className="mb-5 flex rounded-full border border-[#ff7a1a]/25 bg-[#241913] p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${mode === "login" ? "bg-[#ff7a1a] text-[#140f0b]" : "text-[#f7ebd2]"}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${mode === "signup" ? "bg-[#ff7a1a] text-[#140f0b]" : "text-[#f7ebd2]"}`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          {mode === "signup" && (
            <label className="block">
              <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#f7ebd2]">
                <UserRound className="h-4 w-4" /> Full name
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-[1rem] border border-[#ff7a1a]/20 bg-[#f7ebd2] px-3 py-2.5 text-sm text-[#17110d] outline-none"
                placeholder="Koffi Adodo"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#f7ebd2]">
              <Mail className="h-4 w-4" /> Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-[1rem] border border-[#ff7a1a]/20 bg-[#f7ebd2] px-3 py-2.5 text-sm text-[#17110d] outline-none"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#f7ebd2]">
              <Lock className="h-4 w-4" /> Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              className="w-full rounded-[1rem] border border-[#ff7a1a]/20 bg-[#f7ebd2] px-3 py-2.5 text-sm text-[#17110d] outline-none"
              placeholder="At least 6 characters"
            />
          </label>

          {error && (
            <p className="rounded-[1rem] border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-[1rem] border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[1rem] bg-[#ff7a1a] px-3 py-3 text-sm font-semibold text-[#140f0b] transition hover:opacity-90 disabled:opacity-70"
          >
            {loading ? "Working…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
