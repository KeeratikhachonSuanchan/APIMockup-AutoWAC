import type { NextRequest } from "next/server";
import { wacBodyLogItems } from "@/lib/mockData";
import type { WACLogFilter } from "@/lib/types";
import ExcelJS from "exceljs";

export async function POST(request: NextRequest) {
  const body: { filter?: WACLogFilter } = await request.json();
  const { filter = {} } = body;
  const {
    searchKeyword = "",
    dateFrom,
    dateTo,
    itemSearchKeyword = "",
  } = filter;

  const keyword = searchKeyword.toLowerCase();
  const itemKeyword = itemSearchKeyword.toLowerCase();

  let filtered = [...wacBodyLogItems];

  if (keyword) {
    filtered = filtered.filter(
      (item) =>
        item.requestNo.toLowerCase().includes(keyword) ||
        item.supplierCode.toLowerCase().includes(keyword) ||
        item.supplierName.toLowerCase().includes(keyword) ||
        item.poNo.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword)
    );
  }

  if (itemKeyword) {
    filtered = filtered.filter(
      (item) =>
        item.rawCode.toLowerCase().includes(itemKeyword) ||
        item.rawName.toLowerCase().includes(itemKeyword) ||
        item.dcCuttingCode.toLowerCase().includes(itemKeyword) ||
        item.dcName.toLowerCase().includes(itemKeyword)
    );
  }

  if (dateFrom) {
    const from = new Date(dateFrom);
    filtered = filtered.filter((item) => new Date(item.timestamp) >= from);
  }

  if (dateTo) {
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    filtered = filtered.filter((item) => new Date(item.timestamp) <= to);
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Transaction Log");

  sheet.columns = [
    { header: "Request No.", key: "requestNo", width: 22 },
    { header: "Timestamp", key: "timestamp", width: 22 },
    { header: "RAW code", key: "rawCode", width: 12 },
    { header: "RAW name", key: "rawName", width: 35 },
    { header: "DC Cutting code", key: "dcCuttingCode", width: 16 },
    { header: "DC name", key: "dcName", width: 40 },
    { header: "Supplier code", key: "supplierCode", width: 14 },
    { header: "Supplier name", key: "supplierName", width: 28 },
    { header: "PO No.", key: "poNo", width: 18 },
    { header: "Old WAC", key: "oldWAC", width: 12 },
    { header: "New WAC", key: "newWAC", width: 12 },
    { header: "Variable cost", key: "variableCost", width: 14 },
    { header: "Old cost", key: "oldCost", width: 12 },
    { header: "New cost", key: "newCost", width: 12 },
    { header: "Status", key: "status", width: 12 },
  ];

  sheet.getRow(1).font = { bold: true };

  filtered.forEach((item) => sheet.addRow(item));

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=transaction-log.xlsx",
    },
  });
}
