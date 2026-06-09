import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Mail, CheckCircle } from "lucide-react";
import { AnimatedGridBackground } from "../effects/AnimatedGridBackground";

interface NewsletterCTAProps {
  headline: string;
  description: string;
  buttonText: string;
  effect?: "grid" | "none";
}

export function NewsletterCTA({
  headline,
  description,
  buttonText = "Subscribe",
  effect = "grid",
}: NewsletterCTAProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="relative py-28 bg-slate-950 overflow-hidden border-t border-slate-900">
      {effect === "grid" && <AnimatedGridBackground numSquares={20} className="opacity-40" />}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 font-display">
          {headline}
        </h2>
        <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          {description}
        </p>

        <div className="mt-10 max-w-md mx-auto">
          {submitted ? (
            <div className="flex items-center justify-center gap-2 p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Thank you! You have successfully joined.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-800 bg-slate-950/90 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-sm transition-all shadow-lg active:scale-98"
              >
                {buttonText}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
