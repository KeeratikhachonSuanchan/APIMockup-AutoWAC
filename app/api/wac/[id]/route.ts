import type { NextRequest } from "next/server";
import { wacBodyItems } from "@/lib/mockData";
import { successResponse, errorResponse } from "@/lib/response";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idInt = parseInt(id, 10);

  const index = wacBodyItems.findIndex((i) => i.id === idInt);

  if (index === -1) {
    return errorResponse(`Item with id ${idInt} not found`, 404);
  }

  const [deleted] = wacBodyItems.splice(index, 1);

  return successResponse(deleted, "Item deleted successfully");
}
