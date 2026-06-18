"use client";
import { Sun, Moon, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Props {
  locale: string;
  brand: string;
  tagline: string;
}

export default function Navbar({ locale, brand, tagline }: Props) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isRtl = locale === "ar";
  const otherLocale = locale === "ar" ? "en" : "ar";
  const langLabel = locale === "ar" ? "EN" : "عربي";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm-11 11h7v7H3v-7zm13 2h2v-2h-2v2zm2-2h2v-2h-2v2zm-2-2h2v2h-2v-2zm2 2h2v2h-2v-2zm2 2h-2v2h2v2h-2v2h2v-2h2v-2h-2v-2zm-2 4h-2v-2h2v2zm-2-4h-2v2h2v-2zm-2 4h2v-2h-2v2zm0-8h2v-2h-2v2z"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--text)] leading-none">{brand}</div>
            <div className="text-[10px] text-[var(--muted)] leading-none mt-0.5">{tagline}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <Link
            href={`/${otherLocale}`}
            className="flex items-center gap-1.5 h-8 px-3 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
          >
            <Languages size={13} />
            {langLabel}
          </Link>

          {/* Theme */}
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
