import { NextResponse } from "next/server";
import type { ApiResponse } from "./types";

export function successResponse<T>(data: T, message = "Success", status = 200) {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
    error: null,
  };
  return NextResponse.json(body, { status });
}

export function errorResponse(message: string, status = 400) {
  const body: ApiResponse = {
    success: false,
    message,
    data: null,
    error: message,
  };
  return NextResponse.json(body, { status });
}
