import type { NextRequest } from "next/server";
import { wacBodyLogItems } from "@/lib/mockData";
import type { WACLogFilter } from "@/lib/types";
import { withApiLog } from "@/lib/apiLog";

const CSV_HEADERS = [
  "Request No.", "Timestamp", "RAW code", "RAW name",
  "DC Cutting code", "DC name", "Supplier code", "Supplier name",
  "PO No.", "Raw WAC", "New Unit Cost", "Variable cost",
  "Status",
];

const CSV_KEYS = [
  "requestNo", "timestamp", "rawCode", "rawName",
  "dcCuttingCode", "dcName", "supplierCode", "supplierName",
  "poNo", "rawWAC", "newUnitCost", "variableCost",
  "status",
] as const;

function escapeCsv(value: unknown): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export const POST = withApiLog(async function POST(request: NextRequest) {
  const rawText = await request.text();
  let body: { filter?: WACLogFilter } = {};
  try {
    body = JSON.parse(rawText);
  } catch {
    // invalid or empty body — use default filter
  }
  const { filter = {} } = body;

  const clean = (v?: string) => (!v || v === "null" ? "" : v);
  const searchKeyword = clean(filter.searchKeyword);
  const dateFrom = clean(filter.dateFrom);
  const dateTo = clean(filter.dateTo);
  const itemSearchKeyword = clean(filter.itemSearchKeyword);

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

  const rows = filtered.map((item) =>
    CSV_KEYS.map((key) => escapeCsv(item[key])).join(",")
  );
  const csv = "﻿" + [CSV_HEADERS.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=transaction-log.csv",
    },
  });
});
