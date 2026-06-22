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
        item.RequestNo.toLowerCase().includes(keyword) ||
        item.SupplierCode.toLowerCase().includes(keyword) ||
        item.SupplierName.toLowerCase().includes(keyword) ||
        item.PONo.toLowerCase().includes(keyword) ||
        item.Status.toLowerCase().includes(keyword)
    );
  }

  if (itemKeyword) {
    filtered = filtered.filter(
      (item) =>
        item.RawCode.toLowerCase().includes(itemKeyword) ||
        item.RawName.toLowerCase().includes(itemKeyword) ||
        item.DCCuttingCode.toLowerCase().includes(itemKeyword) ||
        item.DCName.toLowerCase().includes(itemKeyword)
    );
  }

  if (dateFrom) {
    const from = new Date(dateFrom);
    filtered = filtered.filter((item) => new Date(item.Timestamp) >= from);
  }

  if (dateTo) {
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    filtered = filtered.filter((item) => new Date(item.Timestamp) <= to);
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Transaction Log");

  sheet.columns = [
    { header: "Request No.", key: "RequestNo", width: 22 },
    { header: "Timestamp", key: "Timestamp", width: 22 },
    { header: "RAW code", key: "RawCode", width: 12 },
    { header: "RAW name", key: "RawName", width: 35 },
    { header: "DC Cutting code", key: "DCCuttingCode", width: 16 },
    { header: "DC name", key: "DCName", width: 40 },
    { header: "Supplier code", key: "SupplierCode", width: 14 },
    { header: "Supplier name", key: "SupplierName", width: 28 },
    { header: "PO No.", key: "PONo", width: 18 },
    { header: "Old WAC", key: "OldWAC", width: 12 },
    { header: "New WAC", key: "NewWAC", width: 12 },
    { header: "Variable cost", key: "VariableCost", width: 14 },
    { header: "Old cost", key: "OldCost", width: 12 },
    { header: "New cost", key: "NewCost", width: 12 },
    { header: "Status", key: "Status", width: 12 },
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
