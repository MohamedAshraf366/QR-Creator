"use client";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { CustomField } from "@/types/qr";
import { nanoid } from "@/lib/nanoid";

const FIELD_TYPES = [
  { value: "text", labelEn: "Text", labelAr: "نص" },
  { value: "url", labelEn: "URL", labelAr: "رابط" },
  { value: "email", labelEn: "Email", labelAr: "بريد إلكتروني" },
  { value: "phone", labelEn: "Phone", labelAr: "هاتف" },
  { value: "number", labelEn: "Number", labelAr: "رقم" },
  { value: "date", labelEn: "Date", labelAr: "تاريخ" },
  { value: "textarea", labelEn: "Long Text", labelAr: "نص طويل" },
];

interface Props {
  fields: CustomField[];
  onChange: (fields: CustomField[]) => void;
  locale: string;
  addLabel: string;
  fieldLabelLabel: string;
  fieldValueLabel: string;
  fieldTypeLabel: string;
  removeLabel: string;
  title: string;
}

export default function CustomFieldsPanel({
  fields, onChange, locale,
  addLabel, fieldLabelLabel, fieldValueLabel, fieldTypeLabel, removeLabel, title,
}: Props) {
  const isRtl = locale === "ar";

  const update = (id: string, patch: Partial<CustomField>) =>
    onChange(fields.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  const add = () =>
    onChange([
      ...fields,
      { id: nanoid(), label: "", value: "", type: "text" },
    ]);

  const remove = (id: string) => onChange(fields.filter((f) => f.id !== id));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {title}
        </span>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-lt)] bg-[var(--accent)]/10 hover:bg-[var(--accent)]/15 px-2.5 py-1.5 rounded-lg transition-all"
        >
          <Plus size={12} />
          {addLabel}
        </button>
      </div>

      {fields.length === 0 && (
        <div className="border border-dashed border-[var(--border)] rounded-xl p-4 text-center text-xs text-[var(--faint)]">
          {isRtl
            ? "أضف حقلاً مخصصاً لأي بيانات لا تجدها أعلاه"
            : "Add a custom field for any data not covered above"}
        </div>
      )}

      <div className="space-y-2">
        {fields.map((field) => (
          <div
            key={field.id}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 space-y-2"
          >
            {/* Row 1: type + label */}
            <div className="flex gap-2">
              <div className="flex items-center gap-1 text-[var(--faint)] cursor-grab">
                <GripVertical size={14} />
              </div>
              <select
                value={field.type}
                onChange={(e) => update(field.id, { type: e.target.value as CustomField["type"] })}
                className="h-8 px-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text)] text-xs outline-none focus:border-[var(--accent)] transition-colors"
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {isRtl ? t.labelAr : t.labelEn}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={field.label}
                onChange={(e) => update(field.id, { label: e.target.value })}
                placeholder={fieldLabelLabel}
                className="flex-1 h-8 px-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text)] text-xs outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 transition-all placeholder:text-[var(--faint)]"
              />
              <button
                type="button"
                onClick={() => remove(field.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--faint)] hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>

            {/* Row 2: value */}
            {field.type === "textarea" ? (
              <textarea
                value={field.value}
                onChange={(e) => update(field.id, { value: e.target.value })}
                placeholder={fieldValueLabel}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text)] text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 transition-all placeholder:text-[var(--faint)] resize-y"
              />
            ) : (
              <input
                type={field.type === "phone" ? "tel" : field.type}
                value={field.value}
                onChange={(e) => update(field.id, { value: e.target.value })}
                placeholder={fieldValueLabel}
                className="w-full h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text)] text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 transition-all placeholder:text-[var(--faint)]"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
