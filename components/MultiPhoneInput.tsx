"use client";
import { Plus, Trash2 } from "lucide-react";
import CountryCodePicker from "./CountryCodePicker";
import type { PhoneEntry } from "@/types/qr";
import { nanoid } from "@/lib/nanoid";

interface Props {
  entries: PhoneEntry[];
  onChange: (entries: PhoneEntry[]) => void;
  locale: string;
  label: string;
  placeholder?: string;
  addLabel: string;
  maxEntries?: number;
}

export default function MultiPhoneInput({
  entries, onChange, locale, label, placeholder, addLabel, maxEntries = 5,
}: Props) {
  const isRtl = locale === "ar";

  const update = (id: string, patch: Partial<PhoneEntry>) => {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const add = () => {
    if (entries.length >= maxEntries) return;
    onChange([...entries, { id: nanoid(), countryDial: entries[0]?.countryDial ?? "+1", number: "" }]);
  };

  const remove = (id: string) => {
    if (entries.length <= 1) return;
    onChange(entries.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        {label}
      </label>
      {entries.map((entry, i) => (
        <div key={entry.id} className="flex gap-0 rounded-xl overflow-hidden border border-[var(--border)] focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/20 transition-all">
          <CountryCodePicker
            value={entry.countryDial}
            onChange={(dial) => update(entry.id, { countryDial: dial })}
            locale={locale}
          />
          <input
            type="tel"
            value={entry.number}
            onChange={(e) => update(entry.id, { number: e.target.value })}
            placeholder={placeholder ?? (isRtl ? "رقم الهاتف" : "Phone number")}
            className="flex-1 h-[42px] px-3 bg-[var(--surface)] text-[var(--text)] text-sm outline-none placeholder:text-[var(--faint)]"
            dir="ltr"
          />
          {entries.length > 1 && (
            <button
              type="button"
              onClick={() => remove(entry.id)}
              className="px-3 text-[var(--faint)] hover:text-red-400 transition-colors bg-[var(--surface)]"
              title={isRtl ? "حذف" : "Remove"}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
      {entries.length < maxEntries && (
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-lt)] transition-colors mt-1"
        >
          <Plus size={13} />
          {addLabel}
        </button>
      )}
    </div>
  );
}
