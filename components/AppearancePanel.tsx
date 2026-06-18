"use client";
import { Upload, X } from "lucide-react";
import type { AppearanceState, ECLevel } from "@/types/qr";
import { Divider } from "./ui";
import { clsx } from "clsx";

const PALETTES = [
  { key: "classic", fg: "#000000", bg: "#ffffff" },
  { key: "purple",  fg: "#7c6dfa", bg: "#f0eeff" },
  { key: "slate",   fg: "#0f172a", bg: "#e2e8f0" },
  { key: "forest",  fg: "#065f46", bg: "#ecfdf5" },
  { key: "violet",  fg: "#7c3aed", bg: "#fdf4ff" },
  { key: "amber",   fg: "#b45309", bg: "#fffbeb" },
  { key: "rose",    fg: "#be123c", bg: "#fff1f2" },
  { key: "sky",     fg: "#0369a1", bg: "#f0f9ff" },
];

const EC_LEVELS: { level: ECLevel; label: string }[] = [
  { level: "L", label: "L — 7%" },
  { level: "M", label: "M — 15%" },
  { level: "Q", label: "Q — 25%" },
  { level: "H", label: "H — 30%" },
];

interface Props {
  state: AppearanceState;
  onChange: (patch: Partial<AppearanceState>) => void;
  t: Record<string, string>;
  locale: string;
}

export default function AppearancePanel({ state, onChange, t, locale }: Props) {
  const isRtl = locale === "ar";

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert(isRtl ? "الملف كبير جداً (2 ميغابايت كحد أقصى)" : "File too large (max 2 MB)"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({ logoDataUrl: ev.target?.result as string, ec: "H" });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      {/* Colors */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t.colours ?? "Colours"}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "fg" as const, label: t.foreground ?? "Foreground" },
            { key: "bg" as const, label: t.background ?? "Background" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2.5 h-11 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] cursor-pointer hover:border-[var(--accent)] transition-colors">
              <div
                className="w-7 h-7 rounded-lg border-2 border-white/20 overflow-hidden shadow-sm shrink-0"
                style={{ background: state[key] }}
              >
                <input
                  type="color"
                  value={state[key]}
                  onChange={(e) => onChange({ [key]: e.target.value })}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[var(--muted)] leading-none mb-0.5">{label}</div>
                <div className="text-xs font-mono text-[var(--text)]">{state[key]}</div>
              </div>
            </label>
          ))}
        </div>

        {/* Palette presets */}
        <div className="flex flex-wrap gap-2 pt-1">
          {PALETTES.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => onChange({ fg: p.fg, bg: p.bg })}
              title={p.key}
              className={clsx(
                "w-7 h-7 rounded-full border-2 transition-all hover:scale-110",
                state.fg === p.fg && state.bg === p.bg
                  ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30 scale-110"
                  : "border-transparent"
              )}
              style={{ background: `linear-gradient(135deg, ${p.fg} 50%, ${p.bg} 50%)` }}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            {t.size ?? "Size"}
          </label>
          <span className="text-xs font-mono text-[var(--text)]">{state.size}px</span>
        </div>
        <input
          type="range" min={128} max={512} step={32} value={state.size}
          onChange={(e) => onChange({ size: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Margin */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            {t.margin ?? "Margin"}
          </label>
          <span className="text-xs font-mono text-[var(--text)]">{state.margin}</span>
        </div>
        <input
          type="range" min={0} max={8} step={1} value={state.margin}
          onChange={(e) => onChange({ margin: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* EC Level */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t.errorCorrection ?? "Error Correction"}
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {EC_LEVELS.map(({ level, label }) => (
            <button
              key={level}
              type="button"
              onClick={() => onChange({ ec: level })}
              className={clsx(
                "py-2 text-xs font-semibold rounded-xl border transition-all",
                state.ec === level
                  ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Logo */}
      <Divider label={t.logoTitle ?? "Logo"} />
      {state.logoDataUrl ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <img src={state.logoDataUrl} alt="logo" className="w-10 h-10 object-contain rounded-lg border border-[var(--border)]" />
            <div className="flex-1 text-xs text-[var(--muted)]">{t.ecBumped ?? "EC bumped to H"}</div>
            <button
              type="button"
              onClick={() => onChange({ logoDataUrl: null })}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--faint)] hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              <X size={14} />
            </button>
          </div>
          {/* Logo size */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                {t.logoSize ?? "Logo size"}
              </label>
              <span className="text-xs font-mono text-[var(--text)]">{state.logoSize}%</span>
            </div>
            <input
              type="range" min={10} max={35} step={1} value={state.logoSize}
              onChange={(e) => onChange({ logoSize: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-dashed border-[var(--border)] cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all text-center">
          <Upload size={22} className="text-[var(--faint)]" />
          <span className="text-sm text-[var(--muted)]">{t.uploadLogo ?? "Click to upload logo"}</span>
          <span className="text-xs text-[var(--faint)]">{t.uploadHint ?? "PNG, JPG, SVG · max 2 MB"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
        </label>
      )}
    </div>
  );
}
