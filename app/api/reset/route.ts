import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { wacBodyItems, wacBodyLogItems } from "@/lib/schema";
import { successResponse } from "@/lib/response";
import { withApiLog } from "@/lib/apiLog";
import { formatDateStr } from "@/lib/utils";

const TOTAL = 90;

const products = [
  { rawCode: "108009", rawName: "ปลากะพงขาวแช่แข็ง ไซส์ M กก.ละ", dcCuttingCode: "837744", dcName: "ARO ปลากะพงขาวแล่แช่แข็ง ไซส์ M กก.ละ", baseWAC: 142.5, vc: 4.1 },
  { rawCode: "25675", rawName: "ปลากะพงขาวแช่แข็ง ไซส์ L กก.ละ", dcCuttingCode: "837742", dcName: "ARO ปลากะพงขาวแล่แช่แข็ง ไซส์ L กก.ละ", baseWAC: 155.2, vc: 4.1 },
  { rawCode: "177259", rawName: "FZ ปลาหมึกยักษ์ กก.ละ", dcCuttingCode: "845124", dcName: "ARO ปลาหมึกยักษ์แช่แข็ง กก.ละ", baseWAC: 210, vc: 5.5 },
  { rawCode: "841786", rawName: "ปลากะพงแปซิฟิก SIZE-M กก.ละ", dcCuttingCode: "904666", dcName: "ARO ปลากะพงแปซิฟิกแช่แข็ง ไซส์ M กก.ละ", baseWAC: 130.5, vc: 4.1 },
  { rawCode: "174495", rawName: "ปลาสำลีน้ำเค็มแช่แข็ง กก.ละ", dcCuttingCode: "993739", dcName: "ARO ปลาสำลีชิ้นแช่แข็ง กก.ละ", baseWAC: 290, vc: 6 },
  { rawCode: "134935", rawName: "FZ ปีกหมึกยักษ์ กก.ละ", dcCuttingCode: "845125", dcName: "ARO ปีกหมึกยักษ์แช่แข็ง กก.ละ", baseWAC: 195, vc: 5.5 },
  { rawCode: "20657", rawName: "FZ ปลากะพงญี่ปุ่น SIZE-M กก.ละ", dcCuttingCode: "904664", dcName: "ARO ปลากะพงญี่ปุ่นแช่แข็ง ไซส์ M กก.ละ", baseWAC: 135, vc: 4.1 },
  { rawCode: "122990", rawName: "ปลาเก๋า A50-60 ตัว/กก แช่แข็ง กก.ละ", dcCuttingCode: "924596", dcName: "DC ปลาเก๋าเปลือกแช่แข็ง กก.ละ", baseWAC: 172, vc: 4.5 },
  { rawCode: "205811", rawName: "FZ กุ้งขาวต้ม SIZE 31-40 กก.ละ", dcCuttingCode: "851001", dcName: "ARO กุ้งขาวต้มแช่แข็ง 31-40 กก.ละ", baseWAC: 185, vc: 4.8 },
  { rawCode: "305422", rawName: "ปลาแซลมอนแล่แช่แข็ง กก.ละ", dcCuttingCode: "860012", dcName: "ARO แซลมอนแล่แช่แข็ง กก.ละ", baseWAC: 420, vc: 8.5 },
  { rawCode: "410233", rawName: "FZ ปลาทูน่าสเต็ก กก.ละ", dcCuttingCode: "870023", dcName: "ARO ปลาทูน่าสเต็กแช่แข็ง กก.ละ", baseWAC: 310, vc: 6.2 },
  { rawCode: "518744", rawName: "กุ้งมังกรแช่แข็ง กก.ละ", dcCuttingCode: "880034", dcName: "ARO กุ้งมังกรแช่แข็ง กก.ละ", baseWAC: 890, vc: 15 },
  { rawCode: "623155", rawName: "FZ หอยเชลล์ SIZE-L กก.ละ", dcCuttingCode: "890045", dcName: "ARO หอยเชลล์แช่แข็ง ไซส์ L กก.ละ", baseWAC: 540, vc: 9 },
  { rawCode: "730266", rawName: "ปลาซาบะแช่แข็ง กก.ละ", dcCuttingCode: "900056", dcName: "ARO ปลาซาบะแช่แข็ง กก.ละ", baseWAC: 88, vc: 3.5 },
  { rawCode: "835677", rawName: "FZ ปลาดอรี่แล่ กก.ละ", dcCuttingCode: "910067", dcName: "ARO ปลาดอรี่แล่แช่แข็ง กก.ละ", baseWAC: 115, vc: 3.8 },
  { rawCode: "940188", rawName: "กุ้งขาวสดแช่แข็ง SIZE 21-25 กก.ละ", dcCuttingCode: "920078", dcName: "ARO กุ้งขาวสดแช่แข็ง 21-25 กก.ละ", baseWAC: 260, vc: 5.5 },
  { rawCode: "104599", rawName: "FZ ปลากดคังแล่แช่แข็ง กก.ละ", dcCuttingCode: "930089", dcName: "ARO ปลากดคังแล่แช่แข็ง กก.ละ", baseWAC: 78, vc: 3.2 },
  { rawCode: "219400", rawName: "ปลาช่อนแล่แช่แข็ง กก.ละ", dcCuttingCode: "940090", dcName: "ARO ปลาช่อนแล่แช่แข็ง กก.ละ", baseWAC: 95, vc: 3.5 },
  { rawCode: "326811", rawName: "FZ หมึกกล้วยทั้งตัว กก.ละ", dcCuttingCode: "950101", dcName: "ARO หมึกกล้วยทั้งตัวแช่แข็ง กก.ละ", baseWAC: 165, vc: 4.5 },
  { rawCode: "431222", rawName: "ปูม้านึ่งแช่แข็ง กก.ละ", dcCuttingCode: "960112", dcName: "ARO ปูม้านึ่งแช่แข็ง กก.ละ", baseWAC: 350, vc: 7 },
  { rawCode: "537633", rawName: "FZ ปลาอินทรีแล่แช่แข็ง กก.ละ", dcCuttingCode: "970123", dcName: "ARO ปลาอินทรีแล่แช่แข็ง กก.ละ", baseWAC: 220, vc: 5.8 },
  { rawCode: "642044", rawName: "หมึกหอมทั้งตัวแช่แข็ง กก.ละ", dcCuttingCode: "980134", dcName: "ARO หมึกหอมทั้งตัวแช่แข็ง กก.ละ", baseWAC: 195, vc: 5 },
  { rawCode: "748455", rawName: "FZ กุ้งลายเสือ SIZE 16-20 กก.ละ", dcCuttingCode: "990145", dcName: "ARO กุ้งลายเสือแช่แข็ง 16-20 กก.ละ", baseWAC: 380, vc: 7.5 },
  { rawCode: "853866", rawName: "ปลาสลิดแดดเดียว กก.ละ", dcCuttingCode: "100156", dcName: "ARO ปลาสลิดแดดเดียว กก.ละ", baseWAC: 145, vc: 4.2 },
  { rawCode: "960277", rawName: "FZ ปลาแพนกาเซียสแล่ กก.ละ", dcCuttingCode: "110167", dcName: "ARO ปลาแพนกาเซียสแล่แช่แข็ง กก.ละ", baseWAC: 68, vc: 2.8 },
  { rawCode: "106688", rawName: "หอยแมลงภู่แช่แข็ง กก.ละ", dcCuttingCode: "120178", dcName: "ARO หอยแมลงภู่แช่แข็ง กก.ละ", baseWAC: 125, vc: 3.9 },
  { rawCode: "213099", rawName: "FZ ปลาช่อนทะเลแล่ กก.ละ", dcCuttingCode: "130189", dcName: "ARO ปลาช่อนทะเลแล่แช่แข็ง กก.ละ", baseWAC: 178, vc: 4.6 },
  { rawCode: "319400", rawName: "ปูขนแช่แข็ง กก.ละ", dcCuttingCode: "140190", dcName: "ARO ปูขนแช่แข็ง กก.ละ", baseWAC: 480, vc: 8.8 },
  { rawCode: "425811", rawName: "FZ กุ้งแชบ๊วย SIZE 40-50 กก.ละ", dcCuttingCode: "150201", dcName: "ARO กุ้งแชบ๊วยแช่แข็ง 40-50 กก.ละ", baseWAC: 210, vc: 5.2 },
  { rawCode: "532222", rawName: "ปลาทับทิมแล่แช่แข็ง กก.ละ", dcCuttingCode: "160212", dcName: "ARO ปลาทับทิมแล่แช่แข็ง กก.ละ", baseWAC: 82, vc: 3.1 },
];

const suppliers = [
  { code: "20047", name: "Thai Union Frozen" },
  { code: "31964", name: "Charoen Pokphand Foods" },
  { code: "22155", name: "Siam Ocean Seafood" },
  { code: "26978", name: "Pacific Marine Trading" },
  { code: "40128", name: "Nippon Suisan TH" },
  { code: "34521", name: "Andaman Frozen Co." },
  { code: "10095", name: "Marine Gold Products" },
  { code: "45670", name: "Siam Cold Storage" },
  { code: "50234", name: "Bangkok Seafood Export" },
  { code: "61789", name: "Gulf Fisheries Ltd." },
];

const statuses = ["success", "success", "success", "success", "pending", "success", "failed", "success", "success", "success"] as const;

function r2(n: number) {
  return Math.round(n * 100) / 100;
}

function formatTs(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export const POST = withApiLog(async function POST() {
  const sqlClient = neon(process.env.DATABASE_URL!);
  const resetDb = drizzle(sqlClient);

  await resetDb.delete(wacBodyLogItems);
  await resetDb.delete(wacBodyItems);
  await sqlClient`ALTER SEQUENCE wac_body_items_id_seq RESTART WITH 1`;

  const baseDate = new Date("2026-05-14T10:00:00+07:00");

  const wacRows: (typeof wacBodyItems.$inferInsert)[] = [];
  const logRows: (typeof wacBodyLogItems.$inferInsert)[] = [];

  for (let i = 0; i < TOTAL; i++) {
    const p = products[i % products.length];
    const s = suppliers[i % suppliers.length];
    const priceShift = Math.floor(i / products.length) * 2.5;
    const oldWac = r2(p.baseWAC + priceShift);
    const newWac = r2(oldWac + (i % 5 === 3 ? -2.5 : 2.5));
    const vc = r2(p.vc);
    const oldCost = r2(oldWac + vc);
    const newCost = r2(newWac + vc);

    const ts = new Date(baseDate.getTime() - i * 45 * 60 * 1000);
    const dateStr = formatTs(ts);
    const seq = String(i + 1).padStart(6, "0");

    wacRows.push({
      timestamp: ts,
      rawCode: String(Number(p.rawCode) + Math.floor(i / products.length) * 100),
      rawName: p.rawName,
      dcCuttingCode: p.dcCuttingCode,
      dcName: p.dcName,
      supplierCode: s.code,
      rawWAC: String(newWac),
      newUnitCost: String(newCost),
      variableCost: String(vc),
    });

    logRows.push({
      requestNo: `WAC_${dateStr}${seq}`,
      timestamp: ts,
      rawCode: wacRows[i].rawCode,
      rawName: p.rawName,
      dcCuttingCode: p.dcCuttingCode,
      dcName: p.dcName,
      supplierCode: s.code,
      supplierName: s.name,
      poNo: `PO-2605-${String(500 - i).padStart(5, "0")}`,
      oldWac: String(oldWac),
      newWac: String(newWac),
      variableCost: String(vc),
      oldCost: String(oldCost),
      newCost: String(newCost),
      status: statuses[i % statuses.length],
    });
  }

  await resetDb.insert(wacBodyItems).values(wacRows);
  await resetDb.insert(wacBodyLogItems).values(logRows);

  return successResponse(null, "Data reset to initial state");
});
