import type { NextRequest } from "next/server";
import { wacBodyItems, wacBodyLogItems, generateId, addTransactionLog } from "@/lib/mockData";
import { successResponse, errorResponse } from "@/lib/response";
import { withApiLog } from "@/lib/apiLog";

export const POST = withApiLog(async function POST(request: NextRequest) {
  const body = await request.json();
  const { rawCode, rawName, dcCuttingCode, dcName, supplierCode, supplierName } = body;

  if (!rawCode || !rawName) {
    return errorResponse("rawCode and rawName are required", 400);
  }

  const duplicate = wacBodyItems.find(
    (i) =>
      i.rawCode === rawCode &&
      i.dcCuttingCode === (dcCuttingCode ?? "") &&
      i.supplierCode === (supplierCode ?? "")
  );

  if (duplicate) {
    return errorResponse(
      "มีการผูก Raw material + DC Cutting + Supplier code นี้อยู่แล้ว ไม่สามารถเพิ่มซ้ำได้",
      409
    );
  }

  const oldWAC = Math.round((Math.random() * 400 + 50) * 100) / 100;

  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace("T", " ");

  const newItem = {
    id: generateId(),
    timestamp,
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

  const yymm = now.toISOString().slice(2, 4) + now.toISOString().slice(5, 7);
  const poSeq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, "0");
  const poNo = `PO-${yymm}-${poSeq}`;

  let resolvedName = supplierName ?? "";
  if (!resolvedName && supplierCode) {
    const existing = wacBodyLogItems.find((l) => l.supplierCode === supplierCode && l.supplierName);
    resolvedName = existing?.supplierName ?? "";
  }

  addTransactionLog(newItem, resolvedName, poNo, "pending");

  return successResponse(newItem, "Item created successfully", 201);
});

export const DELETE = withApiLog(async function DELETE(request: NextRequest) {
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
});
