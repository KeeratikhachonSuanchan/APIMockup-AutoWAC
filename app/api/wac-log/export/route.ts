import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { wacBodyLogItems } from "@/lib/schema";
import { or, ilike, gte, lte, desc, and, type SQL } from "drizzle-orm";
import type { WACLogFilter } from "@/lib/types";
import { withApiLog } from "@/lib/apiLog";
import { formatTimestamp } from "@/lib/utils";

const CSV_HEADERS = [
  "Request No.", "Timestamp", "RAW code", "RAW name",
  "DC Cutting code", "DC name", "Supplier code", "Supplier name",
  "PO No.", "Raw WAC", "New Unit Cost", "Variable cost",
  "Status",
];

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

  const conditions: SQL[] = [];

  if (keyword) {
    conditions.push(
      or(
        ilike(wacBodyLogItems.requestNo, `%${keyword}%`),
        ilike(wacBodyLogItems.supplierCode, `%${keyword}%`),
        ilike(wacBodyLogItems.supplierName, `%${keyword}%`),
        ilike(wacBodyLogItems.poNo, `%${keyword}%`),
        ilike(wacBodyLogItems.status, `%${keyword}%`)
      )!
    );
  }

  if (itemKeyword) {
    conditions.push(
      or(
        ilike(wacBodyLogItems.rawCode, `%${itemKeyword}%`),
        ilike(wacBodyLogItems.rawName, `%${itemKeyword}%`),
        ilike(wacBodyLogItems.dcCuttingCode, `%${itemKeyword}%`),
        ilike(wacBodyLogItems.dcName, `%${itemKeyword}%`)
      )!
    );
  }

  if (dateFrom) {
    conditions.push(gte(wacBodyLogItems.timestamp, new Date(dateFrom)));
  }

  if (dateTo) {
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    conditions.push(lte(wacBodyLogItems.timestamp, to));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const rows = await db
    .select()
    .from(wacBodyLogItems)
    .where(whereClause)
    .orderBy(desc(wacBodyLogItems.timestamp));

  const csvRows = rows.map((item) => {
    const values = [
      item.requestNo,
      formatTimestamp(new Date(item.timestamp)),
      item.rawCode,
      item.rawName,
      item.dcCuttingCode,
      item.dcName,
      item.supplierCode,
      item.supplierName,
      item.poNo,
      Number(item.rawWAC),
      Number(item.newUnitCost),
      Number(item.variableCost),
      item.status,
    ];
    return values.map((v) => escapeCsv(v)).join(",");
  });

  const csv = "﻿" + [CSV_HEADERS.join(","), ...csvRows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=transaction-log.csv",
    },
  });
});
