import { NextResponse } from "next/server";
import { wacBodyItems } from "@/lib/mockData";

export async function DELETE(request, { params }) {
  const { id } = await params;
  const idInt = parseInt(id, 10);

  const index = wacBodyItems.findIndex((i) => i.Id === idInt);

  if (index === -1) {
    return NextResponse.json(
      { message: `Item with Id ${idInt} not found` },
      { status: 404 }
    );
  }

  const [deleted] = wacBodyItems.splice(index, 1);

  return NextResponse.json({
    message: "Item deleted successfully",
    data: deleted,
  });
}
