import type { NextRequest } from "next/server";
import { wacBodyItems, addTransactionLog } from "@/lib/mockData";
import { successResponse, errorResponse } from "@/lib/response";

export async function PATCH(request: NextRequest) {
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
  item.oldCost = Math.round((item.oldWAC + variableCost) * 100) / 100;
  item.newCost = Math.round((item.newWAC + variableCost) * 100) / 100;
  item.isEdit = true;
  addTransactionLog(item, "", "", "success");

  return successResponse(item, "VariableCost updated successfully");
}
