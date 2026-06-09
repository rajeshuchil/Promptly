import React from "react";

interface MinimalFooterProps {
  copyrightText?: string;
  tokens?: any;
}

export const MinimalFooter: React.FC<MinimalFooterProps> = ({
  copyrightText = "© 2026 Promptly Inc. All rights reserved.",
  tokens
}) => {
  return (
    <footer className="border-t border-white/5 bg-transparent py-12">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
        <p className="text-xs text-slate-400">
          {copyrightText}
        </p>
        <div className="flex gap-6 text-xs text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
