import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { wacBodyLogItems } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { successResponse, errorResponse } from "@/lib/response";
import { withApiLog } from "@/lib/apiLog";
import { formatTimestamp } from "@/lib/utils";

export const PATCH = withApiLog(async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { requestNo, status } = body;

  if (!requestNo) {
    return errorResponse("requestNo is required", 400);
  }

  const validStatuses = ["success", "pending", "failed"];
  if (!status || !validStatuses.includes(status)) {
    return errorResponse(`status must be one of: ${validStatuses.join(", ")}`, 400);
  }

  const [updated] = await db
    .update(wacBodyLogItems)
    .set({ status })
    .where(eq(wacBodyLogItems.requestNo, requestNo))
    .returning();

  if (!updated) {
    return errorResponse(`Log with requestNo ${requestNo} not found`, 404);
  }

  const result = {
    requestNo: updated.requestNo,
    timestamp: formatTimestamp(new Date(updated.timestamp)),
    rawCode: updated.rawCode,
    rawName: updated.rawName,
    dcCuttingCode: updated.dcCuttingCode,
    dcName: updated.dcName,
    supplierCode: updated.supplierCode,
    supplierName: updated.supplierName,
    poNo: updated.poNo,
    rawWAC: Number(updated.oldWac),
    newWAC: Number(updated.newWac),
    variableCost: Number(updated.variableCost),
    oldCost: Number(updated.oldCost),
    newUnitCost: Number(updated.newCost),
    status: updated.status,
  };

  return successResponse(result, "Status updated successfully");
});
