import React from "react";

interface LinkItem {
  label: string;
  href: string;
}

interface MinimalNavbarProps {
  logoText?: string;
  links?: LinkItem[];
  tokens?: any;
}

export const MinimalNavbar: React.FC<MinimalNavbarProps> = ({
  logoText = "Minimal",
  links = [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" }
  ],
  tokens
}) => {
  return (
    <header className="w-full bg-transparent">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="text-lg font-semibold tracking-wider text-slate-100 uppercase">{logoText}</div>
        <nav className="flex gap-8">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-slate-100 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};
