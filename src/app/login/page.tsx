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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[oklch(0.05_0.02_270)] text-white">
      {/* Ambient glowing mesh background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, oklch(0.60_0.27_270) 0%, transparent 70%)" }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, oklch(0.53_0.28_310) 0%, transparent 70%)" }}
        />
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4 rounded-3xl border border-[oklch(0.25_0.02_270)] bg-[oklch(0.10_0.02_270/0.7)] backdrop-blur-xl shadow-2xl animate-fade-in">
        {/* Logo and header */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-2xl animate-pulse-glow mb-4"
            style={{
              background: "linear-gradient(135deg, oklch(0.60_0.27_270), oklch(0.53_0.28_310))",
            }}
          >
            <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[oklch(0.92_0.01_270)] to-[oklch(0.79_0.16_270)] bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-sm text-[oklch(0.70_0.02_270)] mt-1.5 text-center">
            Sign in to your FastApp workspace to continue building.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-[oklch(0.15_0.08_20/0.5)] border border-[oklch(0.35_0.15_20)] text-sm text-[oklch(0.70_0.15_20)] text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[oklch(0.70_0.02_270)] tracking-wide uppercase px-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[oklch(0.50_0.02_270)]">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[oklch(0.25_0.02_270)] bg-[oklch(0.12_0.02_270/0.6)] focus:outline-none focus:border-[oklch(0.60_0.27_270)] focus:ring-1 focus:ring-[oklch(0.60_0.27_270)] text-white placeholder-[oklch(0.50_0.02_270)] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[oklch(0.70_0.02_270)] tracking-wide uppercase px-1">
              Password (Optional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[oklch(0.50_0.02_270)]">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[oklch(0.25_0.02_270)] bg-[oklch(0.12_0.02_270/0.6)] focus:outline-none focus:border-[oklch(0.60_0.27_270)] focus:ring-1 focus:ring-[oklch(0.60_0.27_270)] text-white placeholder-[oklch(0.50_0.02_270)] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 mt-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            style={{
              background: "linear-gradient(135deg, oklch(0.60_0.27_270) 0%, oklch(0.53_0.28_310) 100%)",
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

        <p className="mt-5 text-center text-xs text-[oklch(0.55_0.02_270)]">
          New to FastApp?{" "}
          <span className="text-[oklch(0.69_0.22_270)] font-medium">
            Enter any email to create a workspace instantly.
          </span>
        </p>

        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-[oklch(0.50_0.02_270)] hover:text-[oklch(0.70_0.02_270)] transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
