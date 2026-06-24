export function toBkkTime(date: Date = new Date()): Date {
  return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
}

export function formatTimestamp(date: Date = new Date()): string {
  const bkk = toBkkTime(date);
  const y = bkk.getFullYear();
  const m = String(bkk.getMonth() + 1).padStart(2, "0");
  const d = String(bkk.getDate()).padStart(2, "0");
  const h = String(bkk.getHours()).padStart(2, "0");
  const min = String(bkk.getMinutes()).padStart(2, "0");
  const s = String(bkk.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

export function formatDateStr(date: Date = new Date()): string {
  const bkk = toBkkTime(date);
  const y = bkk.getFullYear();
  const m = String(bkk.getMonth() + 1).padStart(2, "0");
  const d = String(bkk.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}
