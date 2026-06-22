export interface WACBodyItem {
  Id: number;
  RowNo: number;
  RawCode: string;
  RawName: string;
  DCCuttingCode: string;
  DCName: string;
  SupplierCode: string;
  OldWAC: number;
  NewWAC: number;
  VariableCost: number;
  TempVariableCost: number;
  OldCost: number;
  NewCost: number;
  IsEdit: boolean;
}

export interface WACBodyLogItem {
  RequestNo: string;
  Timestamp: string;
  RawCode: string;
  RawName: string;
  DCCuttingCode: string;
  DCName: string;
  SupplierCode: string;
  SupplierName: string;
  PONo: string;
  OldWAC: number;
  NewWAC: number;
  VariableCost: number;
  OldCost: number;
  NewCost: number;
  Status: "success" | "pending" | "failed";
}

export interface PaginationInput {
  mode?: "page" | "offset";
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationOutput {
  mode: string;
  page: number;
  limit: number;
  offset: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface WACFilter {
  searchKeyword?: string;
}

export interface WACLogFilter {
  searchKeyword?: string;
  dateFrom?: string;
  dateTo?: string;
  itemSearchKeyword?: string;
}
