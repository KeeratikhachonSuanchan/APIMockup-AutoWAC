import { NextResponse } from "next/server";
import { wacBodyLogItems } from "@/lib/mockData";
import { paginate } from "@/lib/pagination";

export async function POST(request) {
  const body = await request.json();
  const {
    SearchKey = "",
    DateFrom,
    DateTo,
    ItemSearchKey = "",
    Page = 1,
    Limit = 10,
  } = body;

  const searchKey = SearchKey.toLowerCase();
  const itemSearchKey = ItemSearchKey.toLowerCase();

  let filtered = [...wacBodyLogItems];

  if (searchKey) {
    filtered = filtered.filter(
      (item) =>
        item.RequestNo.toLowerCase().includes(searchKey) ||
        item.SupplierCode.toLowerCase().includes(searchKey) ||
        item.SupplierName.toLowerCase().includes(searchKey) ||
        item.PONo.toLowerCase().includes(searchKey) ||
        item.Status.toLowerCase().includes(searchKey)
    );
  }

  if (itemSearchKey) {
    filtered = filtered.filter(
      (item) =>
        item.RawCode.toLowerCase().includes(itemSearchKey) ||
        item.RawName.toLowerCase().includes(itemSearchKey) ||
        item.DCCuttingCode.toLowerCase().includes(itemSearchKey) ||
        item.DCName.toLowerCase().includes(itemSearchKey)
    );
  }

  if (DateFrom) {
    const from = new Date(DateFrom);
    filtered = filtered.filter((item) => new Date(item.Timestamp) >= from);
  }

  if (DateTo) {
    const to = new Date(DateTo);
    to.setHours(23, 59, 59, 999);
    filtered = filtered.filter((item) => new Date(item.Timestamp) <= to);
  }

  const { data, pagination } = paginate(filtered, Page, Limit);

  return NextResponse.json({
    SearchKey: SearchKey || null,
    DateFrom: DateFrom || null,
    DateTo: DateTo || null,
    ItemSearchKey: ItemSearchKey || null,
    Items: data,
    Pagination: pagination,
  });
}
