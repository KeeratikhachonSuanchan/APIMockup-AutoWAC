import { NextResponse } from "next/server";
import { wacBodyItems } from "@/lib/mockData";
import { paginate } from "@/lib/pagination";

export async function POST(request) {
  const body = await request.json();
  const {
    SearchKey = "",
    Page = 1,
    Limit = 10,
  } = body;

  const searchKey = SearchKey.toLowerCase();

  let filtered = [...wacBodyItems];

  if (searchKey) {
    filtered = filtered.filter(
      (item) =>
        item.RawCode.toLowerCase().includes(searchKey) ||
        item.RawName.toLowerCase().includes(searchKey) ||
        item.DCCuttingCode.toLowerCase().includes(searchKey) ||
        item.DCName.toLowerCase().includes(searchKey) ||
        item.SupplierCode.toLowerCase().includes(searchKey)
    );
  }

  const { data, pagination } = paginate(filtered, Page, Limit);
  const variableCost = data.reduce((sum, item) => sum + item.VariableCost, 0);

  return NextResponse.json({
    SearchKey: SearchKey || null,
    VariableCost: Math.round(variableCost * 100) / 100,
    Items: data,
    Pagination: pagination,
  });
}
