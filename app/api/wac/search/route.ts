import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { wacBodyItems } from "@/lib/schema";
import { or, ilike, desc } from "drizzle-orm";
import { paginate } from "@/lib/pagination";
import { successResponse } from "@/lib/response";
import type { WACFilter, PaginationInput } from "@/lib/types";
import { withApiLog } from "@/lib/apiLog";
import { formatTimestamp } from "@/lib/utils";

export const POST = withApiLog(async function POST(request: NextRequest) {
  const body: { filter?: WACFilter; pagination?: PaginationInput } =
    await request.json();
  const { filter = {}, pagination: paginationInput = {} } = body;
  const searchKeyword =
    !filter.searchKeyword || filter.searchKeyword === "null"
      ? ""
      : filter.searchKeyword;

  const keyword = searchKeyword.toLowerCase();

  let query = db
    .select()
    .from(wacBodyItems)
    .orderBy(desc(wacBodyItems.timestamp));

  const rows = keyword
    ? await query.where(
        or(
          ilike(wacBodyItems.rawCode, `%${keyword}%`),
          ilike(wacBodyItems.rawName, `%${keyword}%`),
          ilike(wacBodyItems.dcCuttingCode, `%${keyword}%`),
          ilike(wacBodyItems.dcName, `%${keyword}%`),
          ilike(wacBodyItems.supplierCode, `%${keyword}%`)
        )
      )
    : await query;

  const mapped = rows.map((item) => ({
    id: item.id,
    rawCode: item.rawCode,
    rawName: item.rawName,
    dcCuttingCode: item.dcCuttingCode,
    dcName: item.dcName,
    supplierCode: item.supplierCode,
    rawWAC: Number(item.rawWAC),
    newUnitCost: Number(item.newUnitCost),
    variableCost: Number(item.variableCost),
  }));

  const { data, pagination } = paginate(mapped, paginationInput);

  const items = data.map((item, index) => ({
    ...item,
    rowNo: pagination.offset + index + 1,
  }));

  return successResponse({
    items,
    pagination,
  });
});
