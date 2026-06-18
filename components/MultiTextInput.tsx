"use client";
import { Plus, Trash2 } from "lucide-react";
import type { EmailEntry } from "@/types/qr";
import { nanoid } from "@/lib/nanoid";

interface Props {
  entries: EmailEntry[];
  onChange: (entries: EmailEntry[]) => void;
  label: string;
  placeholder?: string;
  addLabel: string;
  type?: string;
  maxEntries?: number;
  locale?: string;
}

export default function MultiTextInput({
  entries, onChange, label, placeholder, addLabel, type = "text", maxEntries = 5, locale,
}: Props) {
  const update = (id: string, value: string) =>
    onChange(entries.map((e) => (e.id === id ? { ...e, value } : e)));

  const add = () => {
    if (entries.length >= maxEntries) return;
    onChange([...entries, { id: nanoid(), value: "" }]);
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
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex gap-0 rounded-xl overflow-hidden border border-[var(--border)] focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/20 transition-all"
        >
          <input
            type={type}
            value={entry.value}
            onChange={(e) => update(entry.id, e.target.value)}
            placeholder={placeholder}
            className="flex-1 h-[42px] px-3 bg-[var(--surface)] text-[var(--text)] text-sm outline-none placeholder:text-[var(--faint)]"
          />
          {entries.length > 1 && (
            <button
              type="button"
              onClick={() => remove(entry.id)}
              className="px-3 text-[var(--faint)] hover:text-red-400 transition-colors bg-[var(--surface)]"
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
