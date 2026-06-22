import type { NextRequest } from "next/server";
import { wacBodyItems } from "@/lib/mockData";
import { successResponse, errorResponse } from "@/lib/response";

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { Id, VariableCost } = body;

  if (Id === undefined || Id === null) {
    return errorResponse("Id is required", 400);
  }

  if (VariableCost === undefined || VariableCost === null) {
    return errorResponse("VariableCost is required", 400);
  }

  const item = wacBodyItems.find((i) => i.Id === Id);

  if (!item) {
    return errorResponse(`Item with Id ${Id} not found`, 404);
  }

  item.TempVariableCost = item.VariableCost;
  item.VariableCost = VariableCost;
  item.OldCost = Math.round((item.OldWAC + VariableCost) * 100) / 100;
  item.NewCost = Math.round((item.NewWAC + VariableCost) * 100) / 100;
  item.IsEdit = true;

  return successResponse(item, "VariableCost updated successfully");
}
