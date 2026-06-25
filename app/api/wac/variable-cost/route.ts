import type { NextRequest } from "next/server";
import { wacBodyItems, wacBodyLogItems, addTransactionLog } from "@/lib/mockData";
import { successResponse, errorResponse } from "@/lib/response";
import { withApiLog } from "@/lib/apiLog";
import { formatDateStr } from "@/lib/utils";

export const PATCH = withApiLog(async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, variableCost } = body;

  if (id === undefined || id === null) {
    return errorResponse("id is required", 400);
  }

  if (variableCost === undefined || variableCost === null) {
    return errorResponse("variableCost is required", 400);
  }

  const item = wacBodyItems.find((i) => i.id === id);

  if (!item) {
    return errorResponse(`Item with id ${id} not found`, 404);
  }

  item.tempVariableCost = item.variableCost;
  item.variableCost = variableCost;
  item.newUnitCost = Math.round((item.rawWAC + variableCost) * 100) / 100;

  const existingLog = wacBodyLogItems.find((l) => l.supplierCode === item.supplierCode && l.supplierName);
  const supplierName = existingLog?.supplierName ?? "";

  const dateStr = formatDateStr();
  const poSeq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, "0");
  const poNo = `PO-${dateStr.slice(2, 6)}-${poSeq}`;

  addTransactionLog(item, supplierName, poNo, "success");

  const { tempVariableCost: _, ...result } = item;
  return successResponse(result, "VariableCost updated successfully");
});
