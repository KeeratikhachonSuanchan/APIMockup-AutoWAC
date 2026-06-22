import type { NextRequest } from "next/server";
import { wacBodyItems, generateId, addTransactionLog } from "@/lib/mockData";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { rawCode, rawName, dcCuttingCode, dcName, supplierCode, supplierName } = body;

  if (!rawCode || !rawName) {
    return errorResponse("rawCode and rawName are required", 400);
  }

  const oldWAC = Math.round((Math.random() * 400 + 50) * 100) / 100;

  const newItem = {
    id: generateId(),
    rawCode,
    rawName,
    dcCuttingCode: dcCuttingCode ?? "",
    dcName: dcName ?? "",
    supplierCode: supplierCode ?? "",
    oldWAC,
    newWAC: oldWAC,
    variableCost: 0,
    tempVariableCost: 0,
    oldCost: oldWAC,
    newCost: oldWAC,
    isEdit: false,
  };

  wacBodyItems.push(newItem);
  addTransactionLog(newItem, supplierName ?? "", "", "success");

  return successResponse(newItem, "Item created successfully", 201);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("wacId");

  if (!idParam) {
    return errorResponse("wacId is required", 400);
  }

  const id = parseInt(idParam, 10);
  const index = wacBodyItems.findIndex((i) => i.id === id);

  if (index === -1) {
    return errorResponse(`Item with id ${id} not found`, 404);
  }

  const [deleted] = wacBodyItems.splice(index, 1);

  return successResponse(deleted, "Item deleted successfully");
}
