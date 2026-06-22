import type { NextRequest } from "next/server";
import { wacBodyItems, generateId } from "@/lib/mockData";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    rawCode,
    rawName,
    dcCuttingCode,
    dcName,
    supplierCode,
    oldWAC,
    newWAC,
    variableCost: vc,
  } = body;

  if (!rawCode || !rawName) {
    return errorResponse("rawCode and rawName are required", 400);
  }

  const oldWac: number = oldWAC ?? 0;
  const newWac: number = newWAC ?? 0;
  const variableCost: number = vc ?? 0;

  const newItem = {
    id: generateId(),
    rawCode,
    rawName,
    dcCuttingCode: dcCuttingCode ?? "",
    dcName: dcName ?? "",
    supplierCode: supplierCode ?? "",
    oldWAC: oldWac,
    newWAC: newWac,
    variableCost,
    tempVariableCost: variableCost,
    oldCost: Math.round((oldWac + variableCost) * 100) / 100,
    newCost: Math.round((newWac + variableCost) * 100) / 100,
    isEdit: false,
  };

  wacBodyItems.push(newItem);

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
