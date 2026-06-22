import type { WACBodyItem, WACBodyLogItem } from "./types";

let nextId = 21;
let nextRequestNo = 21;

export function generateId(): number {
  return nextId++;
}

function generateRequestNo(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const seq = String(nextRequestNo++).padStart(6, "0");
  return `WAC_${date}${seq}`;
}

function currentTimestamp(): string {
  const now = new Date();
  return now.toISOString().slice(0, 19).replace("T", " ");
}

export function addTransactionLog(
  item: WACBodyItem,
  supplierName = "",
  poNo = "",
  status: WACBodyLogItem["status"] = "pending"
): WACBodyLogItem {
  const log: WACBodyLogItem = {
    requestNo: generateRequestNo(),
    timestamp: currentTimestamp(),
    rawCode: item.rawCode,
    rawName: item.rawName,
    dcCuttingCode: item.dcCuttingCode,
    dcName: item.dcName,
    supplierCode: item.supplierCode,
    supplierName,
    poNo,
    oldWAC: item.oldWAC,
    newWAC: item.newWAC,
    variableCost: item.variableCost,
    oldCost: item.oldCost,
    newCost: item.newCost,
    status,
  };
  wacBodyLogItems.unshift(log);
  return log;
}

export const wacBodyItems: WACBodyItem[] = [
  { id: 1, rawCode: "108009", rawName: "ปลากะพงขาวแช่แข็ง ไซส์ M กก.ละ", dcCuttingCode: "837744", dcName: "ARO ปลากะพงขาวแล่แช่แข็ง ไซส์ M กก.ละ", supplierCode: "20047", oldWAC: 142.5, newWAC: 146.6, variableCost: 4.1, tempVariableCost: 0, oldCost: 146.6, newCost: 149.1, isEdit: false },
  { id: 2, rawCode: "25675", rawName: "ปลากะพงขาวแช่แข็ง ไซส์ L กก.ละ", dcCuttingCode: "837742", dcName: "ARO ปลากะพงขาวแล่แช่แข็ง ไซส์ L กก.ละ", supplierCode: "31964", oldWAC: 155.2, newWAC: 159.3, variableCost: 4.1, tempVariableCost: 0, oldCost: 159.3, newCost: 162.1, isEdit: false },
  { id: 3, rawCode: "177259", rawName: "FZ ปลาหมึกยักษ์ กก.ละ", dcCuttingCode: "845124", dcName: "ARO ปลาหมึกยักษ์แช่แข็ง กก.ละ", supplierCode: "22155", oldWAC: 210, newWAC: 215.5, variableCost: 5.5, tempVariableCost: 0, oldCost: 215.5, newCost: 220.5, isEdit: false },
  { id: 4, rawCode: "841786", rawName: "ปลากะพงแปซิฟิก SIZE-M กก.ละ", dcCuttingCode: "904666", dcName: "ARO ปลากะพงแปซิฟิกแช่แข็ง ไซส์ M กก.ละ", supplierCode: "26978", oldWAC: 130.5, newWAC: 134.6, variableCost: 4.1, tempVariableCost: 0, oldCost: 134.6, newCost: 132.1, isEdit: false },
  { id: 5, rawCode: "174495", rawName: "ปลาสำลีน้ำเค็มแช่แข็ง กก.ละ", dcCuttingCode: "993739", dcName: "ARO ปลาสำลีชิ้นแช่แข็ง กก.ละ", supplierCode: "40128", oldWAC: 290, newWAC: 296, variableCost: 6, tempVariableCost: 0, oldCost: 296, newCost: 301, isEdit: false },
  { id: 6, rawCode: "134935", rawName: "FZ ปีกหมึกยักษ์ กก.ละ", dcCuttingCode: "845125", dcName: "ARO ปีกหมึกยักษ์แช่แข็ง กก.ละ", supplierCode: "34521", oldWAC: 195, newWAC: 200.5, variableCost: 5.5, tempVariableCost: 0, oldCost: 200.5, newCost: 203.5, isEdit: false },
  { id: 7, rawCode: "20657", rawName: "FZ ปลากะพงญี่ปุ่น SIZE-M กก.ละ", dcCuttingCode: "904664", dcName: "ARO ปลากะพงญี่ปุ่นแช่แข็ง ไซส์ M กก.ละ", supplierCode: "10095", oldWAC: 135, newWAC: 139.1, variableCost: 4.1, tempVariableCost: 0, oldCost: 139.1, newCost: 136.6, isEdit: false },
  { id: 8, rawCode: "122990", rawName: "ปลาเก๋า A50-60 ตัว/กก แช่แข็ง กก.ละ", dcCuttingCode: "924596", dcName: "DC ปลาเก๋าเปลือกแช่แข็ง กก.ละ", supplierCode: "45670", oldWAC: 172, newWAC: 176.5, variableCost: 4.5, tempVariableCost: 0, oldCost: 176.5, newCost: 179.5, isEdit: false },
  { id: 9, rawCode: "205811", rawName: "FZ กุ้งขาวต้ม SIZE 31-40 กก.ละ", dcCuttingCode: "851001", dcName: "ARO กุ้งขาวต้มแช่แข็ง 31-40 กก.ละ", supplierCode: "20047", oldWAC: 185, newWAC: 189.8, variableCost: 4.8, tempVariableCost: 0, oldCost: 189.8, newCost: 194.8, isEdit: false },
  { id: 10, rawCode: "305422", rawName: "ปลาแซลมอนแล่แช่แข็ง กก.ละ", dcCuttingCode: "860012", dcName: "ARO แซลมอนแล่แช่แข็ง กก.ละ", supplierCode: "31964", oldWAC: 420, newWAC: 428.5, variableCost: 8.5, tempVariableCost: 0, oldCost: 428.5, newCost: 438.5, isEdit: false },
  { id: 11, rawCode: "410233", rawName: "FZ ปลาทูน่าสเต็ก กก.ละ", dcCuttingCode: "870023", dcName: "ARO ปลาทูน่าสเต็กแช่แข็ง กก.ละ", supplierCode: "22155", oldWAC: 310, newWAC: 316.2, variableCost: 6.2, tempVariableCost: 0, oldCost: 316.2, newCost: 321.2, isEdit: false },
  { id: 12, rawCode: "518744", rawName: "กุ้งมังกรแช่แข็ง กก.ละ", dcCuttingCode: "880034", dcName: "ARO กุ้งมังกรแช่แข็ง กก.ละ", supplierCode: "26978", oldWAC: 890, newWAC: 905, variableCost: 15, tempVariableCost: 0, oldCost: 905, newCost: 935, isEdit: false },
  { id: 13, rawCode: "623155", rawName: "FZ หอยเชลล์ SIZE-L กก.ละ", dcCuttingCode: "890045", dcName: "ARO หอยเชลล์แช่แข็ง ไซส์ L กก.ละ", supplierCode: "40128", oldWAC: 540, newWAC: 549, variableCost: 9, tempVariableCost: 0, oldCost: 549, newCost: 559, isEdit: false },
  { id: 14, rawCode: "730266", rawName: "ปลาซาบะแช่แข็ง กก.ละ", dcCuttingCode: "900056", dcName: "ARO ปลาซาบะแช่แข็ง กก.ละ", supplierCode: "34521", oldWAC: 88, newWAC: 91.5, variableCost: 3.5, tempVariableCost: 0, oldCost: 91.5, newCost: 95.5, isEdit: false },
  { id: 15, rawCode: "835677", rawName: "FZ ปลาดอรี่แล่ กก.ละ", dcCuttingCode: "910067", dcName: "ARO ปลาดอรี่แล่แช่แข็ง กก.ละ", supplierCode: "10095", oldWAC: 115, newWAC: 118.8, variableCost: 3.8, tempVariableCost: 0, oldCost: 118.8, newCost: 121.8, isEdit: false },
  { id: 16, rawCode: "940188", rawName: "กุ้งขาวสดแช่แข็ง SIZE 21-25 กก.ละ", dcCuttingCode: "920078", dcName: "ARO กุ้งขาวสดแช่แข็ง 21-25 กก.ละ", supplierCode: "45670", oldWAC: 260, newWAC: 265.5, variableCost: 5.5, tempVariableCost: 0, oldCost: 265.5, newCost: 273.5, isEdit: false },
  { id: 17, rawCode: "104599", rawName: "FZ ปลากดคังแล่แช่แข็ง กก.ละ", dcCuttingCode: "930089", dcName: "ARO ปลากดคังแล่แช่แข็ง กก.ละ", supplierCode: "20047", oldWAC: 78, newWAC: 81.2, variableCost: 3.2, tempVariableCost: 0, oldCost: 81.2, newCost: 85.2, isEdit: false },
  { id: 18, rawCode: "219400", rawName: "ปลาช่อนแล่แช่แข็ง กก.ละ", dcCuttingCode: "940090", dcName: "ARO ปลาช่อนแล่แช่แข็ง กก.ละ", supplierCode: "31964", oldWAC: 95, newWAC: 98.5, variableCost: 3.5, tempVariableCost: 0, oldCost: 98.5, newCost: 101.5, isEdit: false },
  { id: 19, rawCode: "326811", rawName: "FZ หมึกกล้วยทั้งตัว กก.ละ", dcCuttingCode: "950101", dcName: "ARO หมึกกล้วยทั้งตัวแช่แข็ง กก.ละ", supplierCode: "22155", oldWAC: 165, newWAC: 169.5, variableCost: 4.5, tempVariableCost: 0, oldCost: 169.5, newCost: 174.5, isEdit: false },
  { id: 20, rawCode: "431222", rawName: "ปูม้านึ่งแช่แข็ง กก.ละ", dcCuttingCode: "960112", dcName: "ARO ปูม้านึ่งแช่แข็ง กก.ละ", supplierCode: "26978", oldWAC: 350, newWAC: 357, variableCost: 7, tempVariableCost: 0, oldCost: 357, newCost: 367, isEdit: false },
];

export const wacBodyLogItems: WACBodyLogItem[] = [
  { requestNo: "WAC_20260514000001", timestamp: "2026-05-14 09:34:21", rawCode: "108009", rawName: "ปลากะพงขาวแช่แข็ง ไซส์ M กก.ละ", dcCuttingCode: "837744", dcName: "ARO ปลากะพงขาวแล่แช่แข็ง ไซส์ M กก.ละ", supplierCode: "20047", supplierName: "Thai Union Frozen", poNo: "PO-2605-00482", oldWAC: 142.5, newWAC: 146.6, variableCost: 4.1, oldCost: 146.6, newCost: 149.1, status: "success" },
  { requestNo: "WAC_20260514000002", timestamp: "2026-05-14 09:21:08", rawCode: "25675", rawName: "ปลากะพงขาวแช่แข็ง ไซส์ L กก.ละ", dcCuttingCode: "837742", dcName: "ARO ปลากะพงขาวแล่แช่แข็ง ไซส์ L กก.ละ", supplierCode: "31964", supplierName: "Charoen Pokphand Foods", poNo: "PO-2605-00481", oldWAC: 155.2, newWAC: 159.3, variableCost: 4.1, oldCost: 159.3, newCost: 162.1, status: "success" },
  { requestNo: "WAC_20260514000003", timestamp: "2026-05-14 09:05:47", rawCode: "177259", rawName: "FZ ปลาหมึกยักษ์ กก.ละ", dcCuttingCode: "845124", dcName: "ARO ปลาหมึกยักษ์แช่แข็ง กก.ละ", supplierCode: "22155", supplierName: "Siam Ocean Seafood", poNo: "PO-2605-00478", oldWAC: 210, newWAC: 215.5, variableCost: 5.5, oldCost: 215.5, newCost: 220.5, status: "success" },
  { requestNo: "WAC_20260514000004", timestamp: "2026-05-14 08:52:33", rawCode: "841786", rawName: "ปลากะพงแปซิฟิก SIZE-M กก.ละ", dcCuttingCode: "904666", dcName: "ARO ปลากะพงแปซิฟิกแช่แข็ง ไซส์ M กก.ละ", supplierCode: "26978", supplierName: "Pacific Marine Trading", poNo: "PO-2605-00475", oldWAC: 130.5, newWAC: 134.6, variableCost: 4.1, oldCost: 134.6, newCost: 132.1, status: "success" },
  { requestNo: "WAC_20260514000005", timestamp: "2026-05-14 08:41:12", rawCode: "174495", rawName: "ปลาสำลีน้ำเค็มแช่แข็ง กก.ละ", dcCuttingCode: "993739", dcName: "ARO ปลาสำลีชิ้นแช่แข็ง กก.ละ", supplierCode: "40128", supplierName: "Nippon Suisan TH", poNo: "PO-2605-00472", oldWAC: 290, newWAC: 296, variableCost: 6, oldCost: 296, newCost: 301, status: "pending" },
  { requestNo: "WAC_20260514000006", timestamp: "2026-05-14 08:20:05", rawCode: "134935", rawName: "FZ ปีกหมึกยักษ์ กก.ละ", dcCuttingCode: "845125", dcName: "ARO ปีกหมึกยักษ์แช่แข็ง กก.ละ", supplierCode: "34521", supplierName: "Andaman Frozen Co.", poNo: "PO-2605-00468", oldWAC: 195, newWAC: 200.5, variableCost: 5.5, oldCost: 200.5, newCost: 203.5, status: "success" },
  { requestNo: "WAC_20260513000007", timestamp: "2026-05-13 17:45:51", rawCode: "20657", rawName: "FZ ปลากะพงญี่ปุ่น SIZE-M กก.ละ", dcCuttingCode: "904664", dcName: "ARO ปลากะพงญี่ปุ่นแช่แข็ง ไซส์ M กก.ละ", supplierCode: "10095", supplierName: "Marine Gold Products", poNo: "PO-2605-00461", oldWAC: 135, newWAC: 139.1, variableCost: 4.1, oldCost: 139.1, newCost: 136.6, status: "failed" },
  { requestNo: "WAC_20260513000008", timestamp: "2026-05-13 16:30:18", rawCode: "122990", rawName: "ปลาเก๋า A50-60 ตัว/กก แช่แข็ง กก.ละ", dcCuttingCode: "924596", dcName: "DC ปลาเก๋าเปลือกแช่แข็ง กก.ละ", supplierCode: "45670", supplierName: "Siam Cold Storage", poNo: "PO-2605-00455", oldWAC: 172, newWAC: 176.5, variableCost: 4.5, oldCost: 176.5, newCost: 179.5, status: "success" },
  { requestNo: "WAC_20260513000009", timestamp: "2026-05-13 15:10:44", rawCode: "205811", rawName: "FZ กุ้งขาวต้ม SIZE 31-40 กก.ละ", dcCuttingCode: "851001", dcName: "ARO กุ้งขาวต้มแช่แข็ง 31-40 กก.ละ", supplierCode: "20047", supplierName: "Thai Union Frozen", poNo: "PO-2605-00450", oldWAC: 185, newWAC: 189.8, variableCost: 4.8, oldCost: 189.8, newCost: 194.8, status: "success" },
  { requestNo: "WAC_20260513000010", timestamp: "2026-05-13 14:05:32", rawCode: "305422", rawName: "ปลาแซลมอนแล่แช่แข็ง กก.ละ", dcCuttingCode: "860012", dcName: "ARO แซลมอนแล่แช่แข็ง กก.ละ", supplierCode: "31964", supplierName: "Charoen Pokphand Foods", poNo: "PO-2605-00445", oldWAC: 420, newWAC: 428.5, variableCost: 8.5, oldCost: 428.5, newCost: 438.5, status: "success" },
  { requestNo: "WAC_20260513000011", timestamp: "2026-05-13 11:22:18", rawCode: "410233", rawName: "FZ ปลาทูน่าสเต็ก กก.ละ", dcCuttingCode: "870023", dcName: "ARO ปลาทูน่าสเต็กแช่แข็ง กก.ละ", supplierCode: "22155", supplierName: "Siam Ocean Seafood", poNo: "PO-2605-00440", oldWAC: 310, newWAC: 316.2, variableCost: 6.2, oldCost: 316.2, newCost: 321.2, status: "pending" },
  { requestNo: "WAC_20260512000012", timestamp: "2026-05-12 16:48:05", rawCode: "518744", rawName: "กุ้งมังกรแช่แข็ง กก.ละ", dcCuttingCode: "880034", dcName: "ARO กุ้งมังกรแช่แข็ง กก.ละ", supplierCode: "26978", supplierName: "Pacific Marine Trading", poNo: "PO-2605-00435", oldWAC: 890, newWAC: 905, variableCost: 15, oldCost: 905, newCost: 935, status: "success" },
  { requestNo: "WAC_20260512000013", timestamp: "2026-05-12 14:30:51", rawCode: "623155", rawName: "FZ หอยเชลล์ SIZE-L กก.ละ", dcCuttingCode: "890045", dcName: "ARO หอยเชลล์แช่แข็ง ไซส์ L กก.ละ", supplierCode: "40128", supplierName: "Nippon Suisan TH", poNo: "PO-2605-00430", oldWAC: 540, newWAC: 549, variableCost: 9, oldCost: 549, newCost: 559, status: "success" },
  { requestNo: "WAC_20260512000014", timestamp: "2026-05-12 11:15:27", rawCode: "730266", rawName: "ปลาซาบะแช่แข็ง กก.ละ", dcCuttingCode: "900056", dcName: "ARO ปลาซาบะแช่แข็ง กก.ละ", supplierCode: "34521", supplierName: "Andaman Frozen Co.", poNo: "PO-2605-00425", oldWAC: 88, newWAC: 91.5, variableCost: 3.5, oldCost: 91.5, newCost: 95.5, status: "failed" },
  { requestNo: "WAC_20260512000015", timestamp: "2026-05-12 09:50:14", rawCode: "835677", rawName: "FZ ปลาดอรี่แล่ กก.ละ", dcCuttingCode: "910067", dcName: "ARO ปลาดอรี่แล่แช่แข็ง กก.ละ", supplierCode: "10095", supplierName: "Marine Gold Products", poNo: "PO-2605-00420", oldWAC: 115, newWAC: 118.8, variableCost: 3.8, oldCost: 118.8, newCost: 121.8, status: "success" },
  { requestNo: "WAC_20260511000016", timestamp: "2026-05-11 17:30:42", rawCode: "940188", rawName: "กุ้งขาวสดแช่แข็ง SIZE 21-25 กก.ละ", dcCuttingCode: "920078", dcName: "ARO กุ้งขาวสดแช่แข็ง 21-25 กก.ละ", supplierCode: "45670", supplierName: "Siam Cold Storage", poNo: "PO-2605-00415", oldWAC: 260, newWAC: 265.5, variableCost: 5.5, oldCost: 265.5, newCost: 273.5, status: "success" },
  { requestNo: "WAC_20260511000017", timestamp: "2026-05-11 15:20:33", rawCode: "104599", rawName: "FZ ปลากดคังแล่แช่แข็ง กก.ละ", dcCuttingCode: "930089", dcName: "ARO ปลากดคังแล่แช่แข็ง กก.ละ", supplierCode: "20047", supplierName: "Thai Union Frozen", poNo: "PO-2605-00410", oldWAC: 78, newWAC: 81.2, variableCost: 3.2, oldCost: 81.2, newCost: 85.2, status: "success" },
  { requestNo: "WAC_20260511000018", timestamp: "2026-05-11 13:05:19", rawCode: "219400", rawName: "ปลาช่อนแล่แช่แข็ง กก.ละ", dcCuttingCode: "940090", dcName: "ARO ปลาช่อนแล่แช่แข็ง กก.ละ", supplierCode: "31964", supplierName: "Charoen Pokphand Foods", poNo: "PO-2605-00405", oldWAC: 95, newWAC: 98.5, variableCost: 3.5, oldCost: 98.5, newCost: 101.5, status: "pending" },
  { requestNo: "WAC_20260511000019", timestamp: "2026-05-11 10:45:08", rawCode: "326811", rawName: "FZ หมึกกล้วยทั้งตัว กก.ละ", dcCuttingCode: "950101", dcName: "ARO หมึกกล้วยทั้งตัวแช่แข็ง กก.ละ", supplierCode: "22155", supplierName: "Siam Ocean Seafood", poNo: "PO-2605-00400", oldWAC: 165, newWAC: 169.5, variableCost: 4.5, oldCost: 169.5, newCost: 174.5, status: "success" },
  { requestNo: "WAC_20260510000020", timestamp: "2026-05-10 09:15:55", rawCode: "431222", rawName: "ปูม้านึ่งแช่แข็ง กก.ละ", dcCuttingCode: "960112", dcName: "ARO ปูม้านึ่งแช่แข็ง กก.ละ", supplierCode: "26978", supplierName: "Pacific Marine Trading", poNo: "PO-2605-00395", oldWAC: 350, newWAC: 357, variableCost: 7, oldCost: 357, newCost: 367, status: "success" },
];
