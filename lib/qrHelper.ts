/* eslint-disable @typescript-eslint/no-explicit-any */
export interface QRInstance {
  addData(data: string): void;
  make(): void;
  getModuleCount(): number;
  isDark(row: number, col: number): boolean;
}

export function makeQR(ec: string): QRInstance {
  const qrGen = (globalThis as any).qrcode;
  if (!qrGen) throw new Error("qrcode-generator not loaded");
  return qrGen(0, ec) as QRInstance;
}
