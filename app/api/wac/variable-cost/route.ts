import type { NextRequest } from "next/server";
import { wacBodyItems, wacBodyLogItems, addTransactionLog } from "@/lib/mockData";
import { successResponse, errorResponse } from "@/lib/response";
import { withApiLog } from "@/lib/apiLog";

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
  item.newWAC = Math.round((item.oldWAC + variableCost) * 100) / 100;
  item.oldCost = Math.round((item.oldWAC + item.tempVariableCost) * 100) / 100;
  item.newCost = Math.round((item.oldWAC + variableCost) * 100) / 100;
  item.isEdit = true;

  const existingLog = wacBodyLogItems.find((l) => l.supplierCode === item.supplierCode && l.supplierName);
  const supplierName = existingLog?.supplierName ?? "";

  const now = new Date();
  const yymm = now.toISOString().slice(2, 4) + now.toISOString().slice(5, 7);
  const poSeq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, "0");
  const poNo = `PO-${yymm}-${poSeq}`;

  addTransactionLog(item, supplierName, poNo, "success");

  return successResponse(item, "VariableCost updated successfully");
});
