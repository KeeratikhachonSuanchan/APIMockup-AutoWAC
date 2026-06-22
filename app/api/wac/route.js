import { NextResponse } from "next/server";
import { wacBodyItems } from "@/lib/mockData";
import { paginate } from "@/lib/pagination";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const SearchKey = searchParams.get("SearchKey") || "";
  const page = parseInt(searchParams.get("Page") || "1", 10);
  const limit = parseInt(searchParams.get("Limit") || "10", 10);
  const searchKey = SearchKey.toLowerCase();

  let filtered = [...wacBodyItems];

  if (searchKey) {
    filtered = filtered.filter(
      (item) =>
        item.RawItemNo.toLowerCase().includes(searchKey) ||
        item.RawItemName.toLowerCase().includes(searchKey) ||
        item.DCItemNo.toLowerCase().includes(searchKey) ||
        item.DCItemName.toLowerCase().includes(searchKey) ||
        item.SupplierCode.toLowerCase().includes(searchKey)
    );
  }

  const { data, pagination } = paginate(filtered, page, limit);
  const variableCost = data.reduce((sum, item) => sum + item.VariableCost, 0);

  return NextResponse.json({
    SearchKey: SearchKey || null,
    VariableCost: Math.round(variableCost * 100) / 100,
    Items: data,
    Pagination: pagination,
  });
}

export async function POST(request) {
  const body = await request.json();
  const {
    RawItemNo,
    RawItemName,
    RawWAC,
    DCItemNo,
    DCItemName,
    SupplierCode,
    SupplierName,
    VariableCost,
    NewUnitCost,
  } = body;

  if (!RawItemNo || !RawItemName) {
    return NextResponse.json(
      { message: "RawItemNo and RawItemName are required" },
      { status: 400 }
    );
  }

  const newItem = {
    RowNo: wacBodyItems.length + 1,
    RawItemNo,
    RawItemName,
    RawWAC: RawWAC ?? 0,
    DCItemNo: DCItemNo ?? "",
    DCItemName: DCItemName ?? "",
    SupplierCode: SupplierCode ?? "",
    VariableCost: VariableCost ?? 0,
    TempVariableCost: VariableCost ?? 0,
    NewUnitCost: NewUnitCost ?? 0,
    IsEdit: false,
  };

  wacBodyItems.push(newItem);

  return NextResponse.json(
    { message: "Item created successfully", data: newItem },
    { status: 201 }
  );
}
