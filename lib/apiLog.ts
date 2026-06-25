import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { formatTimestamp } from "./utils";

export interface ApiLogEntry {
  id: number;
  timestamp: string;
  method: string;
  path: string;
  status: number;
  duration: number;
  requestHeaders: Record<string, string>;
  requestBody: string | null;
  responseBody: string | null;
}

let nextLogId = 1;
const MAX_LOGS = 200;

export const apiLogs: ApiLogEntry[] = [];

type RouteHandler = (
  req: NextRequest,
  ctx?: unknown
) => Promise<Response>;

export function withApiLog(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    const start = Date.now();
    const url = new URL(req.url);

    const headers: Record<string, string> = {};
    req.headers.forEach((v, k) => { headers[k] = v; });

    let requestBody: string | null = null;
    const cloned = req.clone();
    try {
      const text = await cloned.text();
      if (text) requestBody = text;
    } catch { /* no body */ }

    let response: Response;
    try {
      response = await handler(req, ctx);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Internal Server Error";
      response = NextResponse.json(
        { success: false, message, data: null, error: message },
        { status: 500 }
      );
    }

    const resClone = response.clone();
    let responseBody: string | null = null;
    try {
      const text = await resClone.text();
      if (text) responseBody = text;
    } catch { /* binary or empty */ }

    apiLogs.unshift({
      id: nextLogId++,
      timestamp: formatTimestamp(),
      method: req.method,
      path: url.pathname + url.search,
      status: response.status,
      duration: Date.now() - start,
      requestHeaders: headers,
      requestBody,
      responseBody,
    });

    if (apiLogs.length > MAX_LOGS) apiLogs.length = MAX_LOGS;

    return response;
  };
}

export function clearApiLogs() {
  apiLogs.length = 0;
  nextLogId = 1;
}
