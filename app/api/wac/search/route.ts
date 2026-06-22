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
        item.rawCode.toLowerCase().includes(keyword) ||
        item.rawName.toLowerCase().includes(keyword) ||
        item.dcCuttingCode.toLowerCase().includes(keyword) ||
        item.dcName.toLowerCase().includes(keyword) ||
        item.supplierCode.toLowerCase().includes(keyword)
    );
  }

  const { data, pagination } = paginate(filtered, paginationInput);
  const variableCost = data.reduce((sum, item) => sum + item.variableCost, 0);

  return successResponse({
    items: data,
    variableCost: Math.round(variableCost * 100) / 100,
    pagination,
  });
}
