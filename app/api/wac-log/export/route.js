import { wacBodyLogItems } from "@/lib/mockData";
import ExcelJS from "exceljs";

export async function POST(request) {
  const body = await request.json();
  const {
    SearchKey = "",
    DateFrom,
    DateTo,
    ItemSearchKey = "",
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

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Transaction Log");

  sheet.columns = [
    { header: "Request No.", key: "RequestNo", width: 22 },
    { header: "Timestamp", key: "Timestamp", width: 22 },
    { header: "RAW code", key: "RawCode", width: 12 },
    { header: "RAW name", key: "RawName", width: 35 },
    { header: "DC Cutting code", key: "DCCuttingCode", width: 16 },
    { header: "DC name", key: "DCName", width: 40 },
    { header: "Supplier code", key: "SupplierCode", width: 14 },
    { header: "Supplier name", key: "SupplierName", width: 28 },
    { header: "PO No.", key: "PONo", width: 18 },
    { header: "Old WAC", key: "OldWAC", width: 12 },
    { header: "New WAC", key: "NewWAC", width: 12 },
    { header: "Variable cost", key: "VariableCost", width: 14 },
    { header: "Old cost", key: "OldCost", width: 12 },
    { header: "New cost", key: "NewCost", width: 12 },
    { header: "Status", key: "Status", width: 12 },
  ];

  sheet.getRow(1).font = { bold: true };

  filtered.forEach((item) => sheet.addRow(item));

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=transaction-log.xlsx",
    },
  });
}
