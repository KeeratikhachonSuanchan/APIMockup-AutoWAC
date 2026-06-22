import { NextResponse, type NextRequest } from "next/server";
import { wacBodyItems } from "@/lib/mockData";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
