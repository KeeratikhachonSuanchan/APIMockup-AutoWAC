import type { NextRequest } from "next/server";
import { wacBodyItems, generateId } from "@/lib/mockData";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    RawCode,
    RawName,
    DCCuttingCode,
    DCName,
    SupplierCode,
    OldWAC,
    NewWAC,
    VariableCost,
  } = body;

  if (!RawCode || !RawName) {
    return errorResponse("RawCode and RawName are required", 400);
  }

  const oldWAC: number = OldWAC ?? 0;
  const newWAC: number = NewWAC ?? 0;
  const variableCost: number = VariableCost ?? 0;

  const newItem = {
    Id: generateId(),
    RowNo: wacBodyItems.length + 1,
    RawCode,
    RawName,
    DCCuttingCode: DCCuttingCode ?? "",
    DCName: DCName ?? "",
    SupplierCode: SupplierCode ?? "",
    OldWAC: oldWAC,
    NewWAC: newWAC,
    VariableCost: variableCost,
    TempVariableCost: variableCost,
    OldCost: Math.round((oldWAC + variableCost) * 100) / 100,
    NewCost: Math.round((newWAC + variableCost) * 100) / 100,
    IsEdit: false,
  };

  wacBodyItems.push(newItem);

  return successResponse(newItem, "Item created successfully", 201);
}
