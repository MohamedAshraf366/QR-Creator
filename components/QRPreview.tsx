"use client";
import { useRef, useState, useCallback } from "react";
import { Download, Copy, Check, FileImage, FileCode, FileText } from "lucide-react";
import dynamic from "next/dynamic";
import type { AppearanceState } from "@/types/qr";
import { downloadPNG, downloadSVG, downloadPDF, copyToClipboard } from "@/lib/download";

const QRCanvas = dynamic(() => import("./QRCanvas"), { ssr: false });

interface Props {
  content: string;
  appearance: AppearanceState;
  t: Record<string, string>;
  locale: string;
}

export default function QRPreview({ content, appearance, t, locale }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [meta, setMeta] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");

  const isRtl = locale === "ar";

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const getCanvas = (): HTMLCanvasElement | null => {
    return document.querySelector("#qr-canvas-el") as HTMLCanvasElement | null;
  };

  const handlePNG = () => {
    const c = getCanvas(); if (!c) return;
    downloadPNG(c);
    showToast(t.pngSaved ?? "PNG downloaded");
  };

  const handleSVG = () => {
    downloadSVG(content, appearance);
    showToast(t.svgSaved ?? "SVG downloaded");
  };

  const handlePDF = () => {
    const c = getCanvas(); if (!c) return;
    downloadPDF(c);
    showToast(t.pdfSaved ?? "PDF downloaded");
  };

  const handleCopy = async () => {
    const c = getCanvas(); if (!c) return;
    try {
      await copyToClipboard(c);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast(t.copied ?? "Copied!");
    } catch {
      showToast(isRtl ? "غير مدعوم في هذا المتصفح" : "Not supported in this browser");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Canvas */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="rounded-2xl p-4 shadow-xl flex items-center justify-center"
          style={{ background: "#fff" }}
        >
          <div id="qr-canvas-el-wrap">
            <QRCanvas
              content={content}
              appearance={appearance}
              onMeta={setMeta}
              onError={setError}
            />
          </div>
        </div>
        {meta && !error && (
          <p className="text-[10px] text-[var(--faint)] font-mono text-center">{meta}</p>
        )}
        {error && (
          <p className="text-[11px] text-red-400 text-center">{error}</p>
        )}
      </div>

      {/* Download buttons */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: t.png ?? "PNG", icon: FileImage, action: handlePNG, color: "text-blue-400" },
          { label: t.svg ?? "SVG", icon: FileCode, action: handleSVG, color: "text-green-400" },
          { label: t.pdf ?? "PDF", icon: FileText, action: handlePDF, color: "text-red-400" },
        ].map(({ label, icon: Icon, action, color }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] text-xs font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 active:scale-95 transition-all"
          >
            <Icon size={18} className={color} />
            {label}
          </button>
        ))}
      </div>

      {/* Copy */}
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--muted)] font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all"
      >
        {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
        {copied ? (t.copied ?? "Copied!") : (t.copy ?? "Copy to clipboard")}
      </button>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--accent)] text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-xl animate-bounce-in pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  );
}
