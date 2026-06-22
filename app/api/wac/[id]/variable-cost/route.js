import { NextResponse } from "next/server";
import { wacBodyItems } from "@/lib/mockData";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const idInt = parseInt(id, 10);
  const body = await request.json();
  const { VariableCost } = body;

  if (VariableCost === undefined || VariableCost === null) {
    return NextResponse.json(
      { message: "VariableCost is required" },
      { status: 400 }
    );
  }

  const item = wacBodyItems.find((i) => i.Id === idInt);

  if (!item) {
    return NextResponse.json(
      { message: `Item with Id ${idInt} not found` },
      { status: 404 }
    );
  }

  item.TempVariableCost = item.VariableCost;
  item.VariableCost = VariableCost;
  item.OldCost = Math.round((item.OldWAC + VariableCost) * 100) / 100;
  item.NewCost = Math.round((item.NewWAC + VariableCost) * 100) / 100;
  item.IsEdit = true;

  return NextResponse.json({
    message: "VariableCost updated successfully",
    data: item,
  });
}
