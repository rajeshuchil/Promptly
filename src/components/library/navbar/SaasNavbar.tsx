import React from "react";

interface LinkItem {
  label: string;
  href: string;
}

interface SaasNavbarProps {
  logoText?: string;
  links?: LinkItem[];
  ctaLabel?: string;
  tokens?: any;
}

export const SaasNavbar: React.FC<SaasNavbarProps> = ({
  logoText = "SaaSApp",
  links = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" }
  ],
  ctaLabel = "Get Started",
  tokens
}) => {
  const primaryBgColor = tokens?.primaryColor ? `bg-${tokens.primaryColor}` : 'bg-indigo-600';
  const primaryHoverBgColor = tokens?.primaryColor ? `hover:bg-${tokens.primaryColor}/80` : 'hover:bg-indigo-600/80';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div className="text-xl font-extrabold tracking-tight text-white">{logoText}</div>
          <nav className="hidden gap-6 md:flex">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div>
          <button className={`inline-flex h-9 items-center justify-center rounded-md px-4 text-xs font-semibold text-white transition-colors ${primaryBgColor} ${primaryHoverBgColor}`}>
            {ctaLabel}
          </button>
        </div>
      </div>
    </header>
  );
};
