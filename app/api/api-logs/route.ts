import { NextResponse } from "next/server";
import { apiLogs, clearApiLogs } from "@/lib/apiLog";

export async function GET() {
  return NextResponse.json(apiLogs);
}

export async function DELETE() {
  clearApiLogs();
  return NextResponse.json({ message: "Logs cleared" });
}
