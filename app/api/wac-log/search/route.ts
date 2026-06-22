import type { NextRequest } from "next/server";
import { wacBodyLogItems } from "@/lib/mockData";
import { paginate } from "@/lib/pagination";
import { successResponse } from "@/lib/response";
import type { WACLogFilter, PaginationInput } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body: { filter?: WACLogFilter; pagination?: PaginationInput } =
    await request.json();
  const { filter = {}, pagination: paginationInput = {} } = body;
  const {
    searchKeyword = "",
    dateFrom,
    dateTo,
    itemSearchKeyword = "",
  } = filter;

  const keyword = searchKeyword.toLowerCase();
  const itemKeyword = itemSearchKeyword.toLowerCase();

  let filtered = [...wacBodyLogItems];

  if (keyword) {
    filtered = filtered.filter(
      (item) =>
        item.requestNo.toLowerCase().includes(keyword) ||
        item.supplierCode.toLowerCase().includes(keyword) ||
        item.supplierName.toLowerCase().includes(keyword) ||
        item.poNo.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword)
    );
  }

  if (itemKeyword) {
    filtered = filtered.filter(
      (item) =>
        item.rawCode.toLowerCase().includes(itemKeyword) ||
        item.rawName.toLowerCase().includes(itemKeyword) ||
        item.dcCuttingCode.toLowerCase().includes(itemKeyword) ||
        item.dcName.toLowerCase().includes(itemKeyword)
    );
  }

  if (dateFrom) {
    const from = new Date(dateFrom);
    filtered = filtered.filter((item) => new Date(item.timestamp) >= from);
  }

  if (dateTo) {
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    filtered = filtered.filter((item) => new Date(item.timestamp) <= to);
  }

  const { data, pagination } = paginate(filtered, paginationInput);

  return successResponse({ items: data, pagination });
}
