export interface WACBodyItem {
  id: number;
  timestamp: string;
  rawCode: string;
  rawName: string;
  dcCuttingCode: string;
  dcName: string;
  supplierCode: string;
  rawWAC: number;
  newUnitCost: number;
  variableCost: number;
  tempVariableCost: number;
  isEdit: boolean;
}

export interface WACBodyLogItem {
  requestNo: string;
  timestamp: string;
  rawCode: string;
  rawName: string;
  dcCuttingCode: string;
  dcName: string;
  supplierCode: string;
  supplierName: string;
  poNo: string;
  rawWAC: number;
  newUnitCost: number;
  variableCost: number;
  status: "success" | "pending" | "failed";
}

export interface PaginationInput {
  mode?: "page" | "offset";
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationOutput {
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

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  error: string | null;
}
