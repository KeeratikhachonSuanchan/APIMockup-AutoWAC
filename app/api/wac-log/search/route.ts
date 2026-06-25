import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { wacBodyLogItems } from "@/lib/schema";
import { or, ilike, gte, lte, desc, and, type SQL } from "drizzle-orm";
import { paginate } from "@/lib/pagination";
import { successResponse } from "@/lib/response";
import type { WACLogFilter, PaginationInput } from "@/lib/types";
import { withApiLog } from "@/lib/apiLog";
import { formatTimestamp } from "@/lib/utils";

export const POST = withApiLog(async function POST(request: NextRequest) {
  const body: { filter?: WACLogFilter; pagination?: PaginationInput } =
    await request.json();
  const { filter = {}, pagination: paginationInput = {} } = body;
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
        ilike(wacBodyLogItems.rawCode, `%${keyword}%`),
        ilike(wacBodyLogItems.rawName, `%${keyword}%`),
        ilike(wacBodyLogItems.dcCuttingCode, `%${keyword}%`),
        ilike(wacBodyLogItems.dcName, `%${keyword}%`),
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

  const mapped = rows.map((item) => ({
    requestNo: item.requestNo,
    timestamp: formatTimestamp(new Date(item.timestamp)),
    rawCode: item.rawCode,
    rawName: item.rawName,
    dcCuttingCode: item.dcCuttingCode,
    dcName: item.dcName,
    supplierCode: item.supplierCode,
    supplierName: item.supplierName,
    poNo: item.poNo,
    oldWac: Number(item.oldWac),
    newWac: Number(item.newWac),
    variableCost: Number(item.variableCost),
    oldCost: Number(item.oldCost),
    newCost: Number(item.newCost),
    status: item.status,
  }));

  const { data, pagination } = paginate(mapped, paginationInput);

  const items = data.map((item, index) => ({
    ...item,
    rowNo: pagination.offset + index + 1,
  }));

  return successResponse({ items, pagination });
});
