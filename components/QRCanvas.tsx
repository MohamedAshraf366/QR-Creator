"use client";
import { useEffect, useRef, useCallback } from "react";
import type { AppearanceState } from "@/types/qr";
import { makeQR } from "@/lib/qrHelper";

interface Props {
  content: string;
  appearance: AppearanceState;
  onMeta: (meta: string) => void;
  onError: (err: string) => void;
}

export default function QRCanvas({ content, appearance, onMeta, onError }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { fg, bg, size, margin, ec, logoDataUrl, logoSize } = appearance;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    try {
      const qr = makeQR(ec);
      qr.addData(content);
      qr.make();

      const modules = qr.getModuleCount();
      const off = margin * 3;
      const cell = (size - off * 2) / modules;

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = fg;

      for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
          if (qr.isDark(r, c)) {
            ctx.fillRect(
              Math.round(off + c * cell),
              Math.round(off + r * cell),
              Math.ceil(cell),
              Math.ceil(cell)
            );
          }
        }
      }

      if (logoDataUrl) {
        const img = new Image();
        img.onload = () => {
          const pct = logoSize / 100;
          const ls = size * pct;
          const lx = (size - ls) / 2;
          const ly = (size - ls) / 2;
          const pad = ls * 0.15;
          ctx.fillStyle = bg;
          ctx.fillRect(lx - pad, ly - pad, ls + pad * 2, ls + pad * 2);
          ctx.drawImage(img, lx, ly, ls, ls);
        };
        img.src = logoDataUrl;
      }

      const ver = Math.round((modules - 21) / 4) + 1;
      onMeta(`v${ver} · ${modules}×${modules} · ${content.length} chars`);
      onError("");
    } catch {
      ctx.fillStyle = bg || "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "#e24b4a";
      ctx.font = "13px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Content too long", size / 2, size / 2 - 8);
      ctx.fillText("Try L or reduce content", size / 2, size / 2 + 12);
      onMeta("");
      onError("Content too long — try L error correction");
    }
  }, [content, size, margin, fg, bg, ec, logoDataUrl, logoSize, onMeta, onError]);

  useEffect(() => {
    const tryDraw = () => {
      try {
        draw();
      } catch {
        setTimeout(tryDraw, 150);
      }
    };
    tryDraw();
  }, [draw]);

  const displaySize = Math.min(size, 320);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ width: displaySize, height: displaySize, imageRendering: "pixelated", display: "block" }}
    />
  );
}
