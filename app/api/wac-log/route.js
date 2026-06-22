import { NextResponse } from "next/server";
import { wacBodyLogItems } from "@/lib/mockData";
import { paginate } from "@/lib/pagination";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const SearchKey = searchParams.get("SearchKey") || "";
  const DateFrom = searchParams.get("DateFrom");
  const DateTo = searchParams.get("DateTo");
  const ItemSearchKey = searchParams.get("ItemSearchKey") || "";
  const page = parseInt(searchParams.get("Page") || "1", 10);
  const limit = parseInt(searchParams.get("Limit") || "10", 10);

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
        item.RawItemName.toLowerCase().includes(itemSearchKey) ||
        item.DCItemNo.toLowerCase().includes(itemSearchKey) ||
        item.DCItemName.toLowerCase().includes(itemSearchKey)
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

  const { data, pagination } = paginate(filtered, page, limit);

  return NextResponse.json({
    SearchKey: SearchKey || null,
    DateFrom: DateFrom || null,
    DateTo: DateTo || null,
    ItemSearchKey: ItemSearchKey || null,
    Items: data,
    Pagination: pagination,
  });
}
