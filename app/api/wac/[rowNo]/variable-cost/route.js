import { NextResponse } from "next/server";
import { wacBodyItems } from "@/lib/mockData";

export async function PATCH(request, { params }) {
  const { rowNo } = await params;
  const rowNoInt = parseInt(rowNo, 10);
  const body = await request.json();
  const { VariableCost } = body;

  if (VariableCost === undefined || VariableCost === null) {
    return NextResponse.json(
      { message: "VariableCost is required" },
      { status: 400 }
    );
  }

  const item = wacBodyItems.find((i) => i.RowNo === rowNoInt);

  if (!item) {
    return NextResponse.json(
      { message: `Item with RowNo ${rowNoInt} not found` },
      { status: 404 }
    );
  }

  item.TempVariableCost = item.VariableCost;
  item.VariableCost = VariableCost;
  item.NewUnitCost = Math.round((item.RawWAC + VariableCost) * 100) / 100;
  item.IsEdit = true;

  return NextResponse.json({
    message: "VariableCost updated successfully",
    data: item,
  });
}
