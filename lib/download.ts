import type { AppearanceState } from "@/types/qr";
import { makeQR } from "./qrHelper";

export function downloadPNG(canvas: HTMLCanvasElement, name = "qr-code") {
  const a = document.createElement("a");
  a.download = name + ".png";
  a.href = canvas.toDataURL("image/png");
  a.click();
}

export function downloadSVG(content: string, appearance: AppearanceState, name = "qr-code") {
  const { size, margin, fg, bg, ec } = appearance;
  try {
    const qr = makeQR(ec);
    qr.addData(content);
    qr.make();
    const modules = qr.getModuleCount();
    const off = margin * 3;
    const cell = (size - off * 2) / modules;
    let paths = "";
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        if (qr.isDark(r, c)) {
          const x = Math.round(off + c * cell);
          const y = Math.round(off + r * cell);
          const w = Math.ceil(cell);
          paths += `<rect x="${x}" y="${y}" width="${w}" height="${w}"/>`;
        }
      }
    }
    const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="${bg}"/><g fill="${fg}">${paths}</g></svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.download = name + ".svg";
    a.href = URL.createObjectURL(blob);
    a.click();
  } catch {
    alert("Error generating SVG");
  }
}

export function downloadPDF(canvas: HTMLCanvasElement, name = "qr-code") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jspdf = (globalThis as any).jspdf;
  if (!jspdf) { alert("PDF library loading, please try again"); return; }
  const { jsPDF } = jspdf;
  const sz = canvas.width;
  const doc = new jsPDF({ unit: "px", format: [sz + 60, sz + 90], hotfixes: ["px_scaling"] });
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("QR Code", (sz + 60) / 2, 30, { align: "center" });
  doc.addImage(canvas.toDataURL("image/png"), "PNG", 30, 48, sz, sz);
  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  doc.text("Created with QR Creator", (sz + 60) / 2, sz + 72, { align: "center" });
  doc.save(name + ".pdf");
}

export async function copyToClipboard(canvas: HTMLCanvasElement): Promise<void> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error("No blob")); return; }
      navigator.clipboard
        .write([new ClipboardItem({ "image/png": blob })])
        .then(resolve)
        .catch(reject);
    });
  });
}
