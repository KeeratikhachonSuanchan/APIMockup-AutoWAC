import { NextResponse, type NextRequest } from "next/server";
import { wacBodyLogItems } from "@/lib/mockData";
import { paginate } from "@/lib/pagination";
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
        item.RequestNo.toLowerCase().includes(keyword) ||
        item.SupplierCode.toLowerCase().includes(keyword) ||
        item.SupplierName.toLowerCase().includes(keyword) ||
        item.PONo.toLowerCase().includes(keyword) ||
        item.Status.toLowerCase().includes(keyword)
    );
  }

  if (itemKeyword) {
    filtered = filtered.filter(
      (item) =>
        item.RawCode.toLowerCase().includes(itemKeyword) ||
        item.RawName.toLowerCase().includes(itemKeyword) ||
        item.DCCuttingCode.toLowerCase().includes(itemKeyword) ||
        item.DCName.toLowerCase().includes(itemKeyword)
    );
  }

  if (dateFrom) {
    const from = new Date(dateFrom);
    filtered = filtered.filter((item) => new Date(item.Timestamp) >= from);
  }

  if (dateTo) {
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    filtered = filtered.filter((item) => new Date(item.Timestamp) <= to);
  }

  const { data, pagination } = paginate(filtered, paginationInput);

  return NextResponse.json({
    filter: {
      searchKeyword: searchKeyword || null,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      itemSearchKeyword: itemSearchKeyword || null,
    },
    items: data,
    pagination,
  });
}
