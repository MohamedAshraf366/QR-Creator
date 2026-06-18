"use client";
import { useState, useRef, useEffect } from "react";
import { COUNTRIES } from "@/lib/countries";
import { ChevronDown, Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (dial: string) => void;
  locale: string;
}

export default function CountryCodePicker({ value, onChange, locale }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const isRtl = locale === "ar";

  const selected = COUNTRIES.find((c) => c.dial === value) ?? COUNTRIES[0];

  const filtered = query
    ? COUNTRIES.filter((c) => {
        const q = query.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.nameAr.includes(q) ||
          c.dial.includes(q) ||
          c.code.toLowerCase().includes(q)
        );
      })
    : COUNTRIES;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 h-[42px] px-2.5 rounded-l-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm font-medium whitespace-nowrap hover:border-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 min-w-[82px]"
        style={{ borderRadius: isRtl ? "0 10px 10px 0" : "10px 0 0 10px" }}
      >
        <span className="text-base">{selected.flag}</span>
        <span className="text-xs text-[var(--muted)]">{selected.dial}</span>
        <ChevronDown size={12} className="text-[var(--faint)]" />
      </button>

      {open && (
        <div
          className="absolute z-50 top-full mt-1 w-64 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden"
          style={{ [isRtl ? "right" : "left"]: 0 }}
        >
          {/* Search */}
          <div className="p-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <Search size={13} className="text-[var(--faint)] shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder={isRtl ? "بحث عن دولة..." : "Search country..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--faint)]"
              />
            </div>
          </div>
          {/* List */}
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-sm text-[var(--faint)] text-center">
                {isRtl ? "لا توجد نتائج" : "No results"}
              </p>
            )}
            {filtered.map((c) => (
              <button
                key={c.code + c.dial}
                type="button"
                onClick={() => { onChange(c.dial); setOpen(false); setQuery(""); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-[var(--accent)]/10 transition-colors ${
                  c.dial === value ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--text)]"
                }`}
              >
                <span className="text-base shrink-0">{c.flag}</span>
                <span className="flex-1 text-start truncate">
                  {isRtl ? c.nameAr : c.name}
                </span>
                <span className="text-xs text-[var(--muted)] shrink-0">{c.dial}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
