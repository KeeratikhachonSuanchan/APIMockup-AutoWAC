import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { wacBodyItems, wacBodyLogItems } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { successResponse, errorResponse } from "@/lib/response";
import { withApiLog } from "@/lib/apiLog";
import { formatTimestamp, formatDateStr } from "@/lib/utils";

export const PATCH = withApiLog(async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, variableCost } = body;

  if (id === undefined || id === null) {
    return errorResponse("id is required", 400);
  }

  if (variableCost === undefined || variableCost === null) {
    return errorResponse("variableCost is required", 400);
  }

  const [existing] = await db
    .select()
    .from(wacBodyItems)
    .where(eq(wacBodyItems.id, id))
    .limit(1);

  if (!existing) {
    return errorResponse(`Item with id ${id} not found`, 404);
  }

  const newUnitCost = Math.round((Number(existing.rawWAC) + variableCost) * 100) / 100;

  const [updated] = await db
    .update(wacBodyItems)
    .set({
      variableCost: String(variableCost),
      newUnitCost: String(newUnitCost),
    })
    .where(eq(wacBodyItems.id, id))
    .returning();

  const existingLog = await db
    .select({ supplierName: wacBodyLogItems.supplierName })
    .from(wacBodyLogItems)
    .where(eq(wacBodyLogItems.supplierCode, updated.supplierCode))
    .limit(1);
  const supplierName = existingLog[0]?.supplierName ?? "";

  const dateStr = formatDateStr();
  const poSeq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, "0");
  const poNo = `PO-${dateStr.slice(2, 6)}-${poSeq}`;

  const countResult = await db.select({ count: sql<number>`count(*)` }).from(wacBodyLogItems);
  const seq = String(Number(countResult[0].count) + 1).padStart(6, "0");
  const requestNo = `WAC_${formatDateStr()}${seq}`;

  await db.insert(wacBodyLogItems).values({
    requestNo,
    timestamp: new Date(),
    rawCode: updated.rawCode,
    rawName: updated.rawName,
    dcCuttingCode: updated.dcCuttingCode,
    dcName: updated.dcName,
    supplierCode: updated.supplierCode,
    supplierName,
    poNo,
    rawWAC: updated.rawWAC,
    newUnitCost: updated.newUnitCost,
    variableCost: updated.variableCost,
    status: "success",
  });

  const result = {
    id: updated.id,
    timestamp: formatTimestamp(new Date(updated.timestamp)),
    rawCode: updated.rawCode,
    rawName: updated.rawName,
    dcCuttingCode: updated.dcCuttingCode,
    dcName: updated.dcName,
    supplierCode: updated.supplierCode,
    rawWAC: Number(updated.rawWAC),
    newUnitCost: Number(updated.newUnitCost),
    variableCost: Number(updated.variableCost),
  };

  return successResponse(result, "VariableCost updated successfully");
});
