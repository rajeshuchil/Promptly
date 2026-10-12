"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email) {
      setError("Please enter an email address.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        setError("Invalid email or login failed.");
        setIsLoading(false);
      } else {
        router.refresh();
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background text-white">
      {/* Ambient glowing mesh background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, var(--color-brand-500) 0%, transparent 70%)" }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--color-brand-600) 0%, transparent 70%)" }}
        />
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 mx-3 sm:mx-4 rounded-2xl sm:rounded-3xl border border-surface-500/30 bg-surface-900/70 backdrop-blur-xl shadow-2xl animate-fade-in">
        {/* Logo and header */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-2xl animate-pulse-glow mb-4"
            style={{
              background: "linear-gradient(135deg, var(--color-brand-500), var(--color-brand-600))",
            }}
          >
            <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-brand-300 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-surface-300 mt-1.5 text-center">
            Sign in to your FastApp workspace to continue building.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/35 text-sm text-rose-400 text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-surface-300 tracking-wide uppercase px-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-surface-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-500/30 bg-surface-950/60 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-white placeholder-surface-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-surface-300 tracking-wide uppercase px-1">
              Password (Optional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-surface-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-500/30 bg-surface-950/60 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-white placeholder-surface-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 mt-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            style={{
              background: "linear-gradient(135deg, var(--color-brand-500) 0%, var(--color-brand-600) 100%)",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Continue to Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-surface-400">
          New to FastApp?{" "}
          <span className="text-brand-400 font-medium">
            Enter any email to create a workspace instantly.
          </span>
        </p>

        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-surface-500 hover:text-surface-300 transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
