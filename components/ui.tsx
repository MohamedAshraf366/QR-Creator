import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";

const base =
  "w-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-sm rounded-xl px-3 outline-none transition-all placeholder:text-[var(--faint)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20";

interface FieldProps {
  label: string;
  required?: boolean;
}

export function Field({ label, children, required }: FieldProps & { children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        {label}{required && <span className="text-[var(--accent)] ms-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(base, "h-[42px]", className)}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(base, "py-2.5 resize-y min-h-[80px]", className)}
      {...props}
    />
  );
}

export function Select({
  className, children, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select className={clsx(base, "h-[42px] cursor-pointer", className)} {...props}>
      {children}
    </select>
  );
}

export function Row({ children, cols = 2 }: { children: React.ReactNode; cols?: 2 | 3 }) {
  return (
    <div className={clsx("grid gap-3", cols === 3 ? "grid-cols-3" : "grid-cols-2")}>
      {children}
    </div>
  );
}

export function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--accent)]/5 px-3.5 py-2.5 text-xs text-[var(--muted)] leading-relaxed">
      {children}
    </div>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-[var(--faint)] my-1">
      <div className="flex-1 h-px bg-[var(--border)]" />
      {label}
      <div className="flex-1 h-px bg-[var(--border)]" />
    </div>
  );
}
