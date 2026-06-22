import { resetData } from "@/lib/mockData";
import { successResponse } from "@/lib/response";

export async function POST() {
  resetData();
  return successResponse(null, "Data reset to initial state");
}
