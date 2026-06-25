import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { wacBodyItems, wacBodyLogItems } from "@/lib/schema";
import { eq, and, sql } from "drizzle-orm";
import { successResponse, errorResponse } from "@/lib/response";
import { withApiLog } from "@/lib/apiLog";
import { formatTimestamp, formatDateStr } from "@/lib/utils";

export const POST = withApiLog(async function POST(request: NextRequest) {
  const body = await request.json();
  const { rawCode, rawName, dcCuttingCode, dcName, supplierCode, supplierName } = body;

  if (!rawCode || !rawName) {
    return errorResponse("rawCode and rawName are required", 400);
  }

  const duplicate = await db
    .select()
    .from(wacBodyItems)
    .where(
      and(
        eq(wacBodyItems.rawCode, rawCode),
        eq(wacBodyItems.dcCuttingCode, dcCuttingCode ?? ""),
        eq(wacBodyItems.supplierCode, supplierCode ?? "")
      )
    )
    .limit(1);

  if (duplicate.length > 0) {
    return errorResponse(
      "มีการผูก Raw material + DC Cutting + Supplier code นี้อยู่แล้ว ไม่สามารถเพิ่มซ้ำได้",
      409
    );
  }

  const rawWAC = Math.round((Math.random() * 400 + 50) * 100) / 100;
  const now = new Date();

  const [newItem] = await db
    .insert(wacBodyItems)
    .values({
      timestamp: now,
      rawCode,
      rawName,
      dcCuttingCode: dcCuttingCode ?? "",
      dcName: dcName ?? "",
      supplierCode: supplierCode ?? "",
      rawWAC: String(rawWAC),
      newUnitCost: String(rawWAC),
      variableCost: "0",
    })
    .returning();

  const dateStr = formatDateStr();
  const poSeq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, "0");
  const poNo = `PO-${dateStr.slice(2, 6)}-${poSeq}`;

  let resolvedName = supplierName ?? "";
  if (!resolvedName && supplierCode) {
    const existing = await db
      .select({ supplierName: wacBodyLogItems.supplierName })
      .from(wacBodyLogItems)
      .where(eq(wacBodyLogItems.supplierCode, supplierCode))
      .limit(1);
    resolvedName = existing[0]?.supplierName ?? "";
  }

  const countResult = await db.select({ count: sql<number>`count(*)` }).from(wacBodyLogItems);
  const seq = String(Number(countResult[0].count) + 1).padStart(6, "0");
  const requestNo = `WAC_${formatDateStr()}${seq}`;

  await db.insert(wacBodyLogItems).values({
    requestNo,
    timestamp: now,
    rawCode: newItem.rawCode,
    rawName: newItem.rawName,
    dcCuttingCode: newItem.dcCuttingCode,
    dcName: newItem.dcName,
    supplierCode: newItem.supplierCode,
    supplierName: resolvedName,
    poNo,
    rawWAC: newItem.rawWAC,
    newUnitCost: newItem.newUnitCost,
    variableCost: newItem.variableCost,
    status: "pending",
  });

  const result = {
    id: newItem.id,
    timestamp: formatTimestamp(new Date(newItem.timestamp)),
    rawCode: newItem.rawCode,
    rawName: newItem.rawName,
    dcCuttingCode: newItem.dcCuttingCode,
    dcName: newItem.dcName,
    supplierCode: newItem.supplierCode,
    rawWAC: Number(newItem.rawWAC),
    newUnitCost: Number(newItem.newUnitCost),
    variableCost: Number(newItem.variableCost),
  };

  return successResponse(result, "Item created successfully", 201);
});

export const DELETE = withApiLog(async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("wacId");

  if (!idParam) {
    return errorResponse("wacId is required", 400);
  }

  const id = parseInt(idParam, 10);

  const deleted = await db
    .delete(wacBodyItems)
    .where(eq(wacBodyItems.id, id))
    .returning();

  if (deleted.length === 0) {
    return errorResponse(`Item with id ${id} not found`, 404);
  }

  const item = deleted[0];
  const result = {
    id: item.id,
    timestamp: formatTimestamp(new Date(item.timestamp)),
    rawCode: item.rawCode,
    rawName: item.rawName,
    dcCuttingCode: item.dcCuttingCode,
    dcName: item.dcName,
    supplierCode: item.supplierCode,
    rawWAC: Number(item.rawWAC),
    newUnitCost: Number(item.newUnitCost),
    variableCost: Number(item.variableCost),
  };

  return successResponse(result, "Item deleted successfully");
});
