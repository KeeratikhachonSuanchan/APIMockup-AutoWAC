import { resetData } from "@/lib/mockData";
import { successResponse } from "@/lib/response";
import { withApiLog } from "@/lib/apiLog";

export const POST = withApiLog(async function POST() {
  resetData();
  return successResponse(null, "Data reset to initial state");
});
