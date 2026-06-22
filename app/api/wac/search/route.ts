import type { NextRequest } from "next/server";
import { wacBodyItems } from "@/lib/mockData";
import { paginate } from "@/lib/pagination";
import { successResponse } from "@/lib/response";
import type { WACFilter, PaginationInput } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body: { filter?: WACFilter; pagination?: PaginationInput } =
    await request.json();
  const { filter = {}, pagination: paginationInput = {} } = body;
  const { searchKeyword = "" } = filter;

  const keyword = searchKeyword.toLowerCase();

  let filtered = [...wacBodyItems];

  if (keyword) {
    filtered = filtered.filter(
      (item) =>
        item.RawCode.toLowerCase().includes(keyword) ||
        item.RawName.toLowerCase().includes(keyword) ||
        item.DCCuttingCode.toLowerCase().includes(keyword) ||
        item.DCName.toLowerCase().includes(keyword) ||
        item.SupplierCode.toLowerCase().includes(keyword)
    );
  }

  const { data, pagination } = paginate(filtered, paginationInput);
  const variableCost = data.reduce((sum, item) => sum + item.VariableCost, 0);

  return successResponse({
    items: data,
    variableCost: Math.round(variableCost * 100) / 100,
    pagination,
  });
}
