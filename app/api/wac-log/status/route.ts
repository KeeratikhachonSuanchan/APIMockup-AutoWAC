import type { NextRequest } from "next/server";
import { wacBodyLogItems } from "@/lib/mockData";
import { successResponse, errorResponse } from "@/lib/response";

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { requestNo, status } = body;

  if (!requestNo) {
    return errorResponse("requestNo is required", 400);
  }

  const validStatuses = ["success", "pending", "failed"];
  if (!status || !validStatuses.includes(status)) {
    return errorResponse(`status must be one of: ${validStatuses.join(", ")}`, 400);
  }

  const log = wacBodyLogItems.find((i) => i.requestNo === requestNo);

  if (!log) {
    return errorResponse(`Log with requestNo ${requestNo} not found`, 404);
  }

  log.status = status;

  return successResponse(log, "Status updated successfully");
}
