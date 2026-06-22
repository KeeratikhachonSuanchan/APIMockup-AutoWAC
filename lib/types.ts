export interface WACBodyItem {
  id: number;
  timestamp: string;
  rawCode: string;
  rawName: string;
  dcCuttingCode: string;
  dcName: string;
  supplierCode: string;
  oldWAC: number;
  newWAC: number;
  variableCost: number;
  tempVariableCost: number;
  oldCost: number;
  newCost: number;
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
  oldWAC: number;
  newWAC: number;
  variableCost: number;
  oldCost: number;
  newCost: number;
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
