const wacBodyExample = {
  id: 1,
  rowNo: 1,
  rawCode: "108009",
  rawName: "ปลากะพงขาวแช่แข็ง ไซส์ M กก.ละ",
  dcCuttingCode: "837744",
  dcName: "ARO ปลากะพงขาวแล่แช่แข็ง ไซส์ M กก.ละ",
  supplierCode: "20047",
  oldWAC: 142.5,
  newWAC: 145,
  variableCost: 4.1,
  tempVariableCost: 4.1,
  oldCost: 146.6,
  newCost: 149.1,
  isEdit: false,
};

const wacBodyLogExample = {
  requestNo: "WAC_20260514000001",
  timestamp: "2026-05-14 09:34:21",
  rawCode: "108009",
  rawName: "ปลากะพงขาวแช่แข็ง ไซส์ M กก.ละ",
  dcCuttingCode: "837744",
  dcName: "ARO ปลากะพงขาวแล่แช่แข็ง ไซส์ M กก.ละ",
  supplierCode: "20047",
  supplierName: "Thai Union Frozen",
  poNo: "PO-2605-00482",
  oldWAC: 142.5,
  newWAC: 145,
  variableCost: 4.1,
  oldCost: 146.6,
  newCost: 149.1,
  status: "success",
};

const paginationExample = {
  page: 1,
  limit: 20,
  totalItems: 8,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
};

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "WAC Mockup API",
    version: "1.0.0",
    description: "Mockup API for Weighted Average Cost (WAC)",
  },
  paths: {
    "/api/wac/search": {
      post: {
        tags: ["Auto WAC"],
        summary: "ดึงข้อมูล Auto WAC",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  filter: { $ref: "#/components/schemas/WACFilter" },
                  pagination: { $ref: "#/components/schemas/PaginationInput" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "สำเร็จ",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/WACSearchResponse" },
              },
            },
          },
        },
      },
    },
    "/api/wac": {
      post: {
        tags: ["Auto WAC"],
        summary: "เพิ่มข้อมูล WAC",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/WACCreateInput" },
            },
          },
        },
        responses: {
          201: {
            description: "สร้างสำเร็จ",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/WACItemResponse" },
              },
            },
          },
          400: { description: "ข้อมูลไม่ครบ" },
        },
      },
      delete: {
        tags: ["Auto WAC"],
        summary: "ลบข้อมูล WAC",
        parameters: [
          {
            name: "wacId",
            in: "query",
            required: true,
            schema: { type: "integer" },
            description: "id ของ item ที่ต้องการลบ",
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "ลบสำเร็จ",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/WACItemResponse" },
              },
            },
          },
          400: { description: "id is required" },
          404: { description: "ไม่พบ item" },
        },
      },
    },
    "/api/wac/variable-cost": {
      patch: {
        tags: ["Auto WAC"],
        summary: "แก้ไข VariableCost",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id", "variableCost"],
                properties: {
                  id: { type: "integer", example: 1 },
                  variableCost: { type: "number", example: 5.0 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "แก้ไขสำเร็จ",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/WACItemResponse" },
              },
            },
          },
          400: { description: "variableCost is required" },
          404: { description: "ไม่พบ item" },
        },
      },
    },
    "/api/wac-log/search": {
      post: {
        tags: ["Transaction Log"],
        summary: "ดึงข้อมูล Transaction Log",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  filter: { $ref: "#/components/schemas/WACLogFilter" },
                  pagination: { $ref: "#/components/schemas/PaginationInput" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "สำเร็จ",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/WACLogSearchResponse" },
              },
            },
          },
        },
      },
    },
    "/api/wac-log/export": {
      post: {
        tags: ["Transaction Log"],
        summary: "Export Transaction Log เป็นไฟล์ Excel",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  filter: { $ref: "#/components/schemas/WACLogFilter" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "ไฟล์ Excel (.xlsx)",
            content: {
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
                schema: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      PaginationInput: {
        type: "object",
        properties: {
          mode: {
            type: "string",
            enum: ["page", "offset"],
            default: "page",
            description: "page = ใช้ page+limit, offset = ใช้ offset+limit",
          },
          page: { type: "integer", default: 1 },
          limit: { type: "integer", default: 20 },
          offset: { type: "integer", default: 0 },
        },
      },
      PaginationOutput: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 20 },
          totalItems: { type: "integer", example: 8 },
          totalPages: { type: "integer", example: 1 },
          hasNext: { type: "boolean", example: false },
          hasPrevious: { type: "boolean", example: false },
        },
      },
      WACFilter: {
        type: "object",
        properties: {
          searchKeyword: {
            type: "string",
            description:
              "ค้นหาด้วย rawCode, rawName, dcCuttingCode, dcName, supplierCode",
          },
        },
      },
      WACLogFilter: {
        type: "object",
        properties: {
          searchKeyword: {
            type: "string",
            description:
              "ค้นหาด้วย requestNo, supplierCode, supplierName, poNo, status",
          },
          dateFrom: {
            type: "string",
            format: "date",
            description: "วันที่เริ่มต้น (YYYY-MM-DD)",
            example: "2026-05-13",
          },
          dateTo: {
            type: "string",
            format: "date",
            description: "วันที่สิ้นสุด (YYYY-MM-DD)",
            example: "2026-05-14",
          },
          itemSearchKeyword: {
            type: "string",
            description:
              "ค้นหาด้วย rawCode, rawName, dcCuttingCode, dcName",
          },
        },
      },
      WACBody: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          rowNo: { type: "integer", example: 1 },
          rawCode: { type: "string", example: "108009" },
          rawName: { type: "string", example: "ปลากะพงขาวแช่แข็ง ไซส์ M กก.ละ" },
          dcCuttingCode: { type: "string", example: "837744" },
          dcName: { type: "string", example: "ARO ปลากะพงขาวแล่แช่แข็ง ไซส์ M กก.ละ" },
          supplierCode: { type: "string", example: "20047" },
          oldWAC: { type: "number", example: 142.5 },
          newWAC: { type: "number", example: 145 },
          variableCost: { type: "number", example: 4.1 },
          tempVariableCost: { type: "number", example: 4.1 },
          oldCost: { type: "number", example: 146.6 },
          newCost: { type: "number", example: 149.1 },
          isEdit: { type: "boolean", example: false },
        },
      },
      WACCreateInput: {
        type: "object",
        required: ["rawCode", "rawName"],
        properties: {
          rawCode: { type: "string", example: "108009" },
          rawName: { type: "string", example: "ปลากะพงขาวแช่แข็ง ไซส์ M กก.ละ" },
          dcCuttingCode: { type: "string", example: "837744" },
          dcName: { type: "string", example: "ARO ปลากะพงขาวแล่แช่แข็ง ไซส์ M กก.ละ" },
          supplierCode: { type: "string", example: "20047" },
          oldWAC: { type: "number", example: 142.5 },
          newWAC: { type: "number", example: 145 },
          variableCost: { type: "number", example: 4.1 },
        },
      },
      WACBodyLog: {
        type: "object",
        properties: {
          requestNo: { type: "string", example: "WAC_20260514000001" },
          timestamp: { type: "string", example: "2026-05-14 09:34:21" },
          rawCode: { type: "string", example: "108009" },
          rawName: { type: "string", example: "ปลากะพงขาวแช่แข็ง ไซส์ M กก.ละ" },
          dcCuttingCode: { type: "string", example: "837744" },
          dcName: { type: "string", example: "ARO ปลากะพงขาวแล่แช่แข็ง ไซส์ M กก.ละ" },
          supplierCode: { type: "string", example: "20047" },
          supplierName: { type: "string", example: "Thai Union Frozen" },
          poNo: { type: "string", example: "PO-2605-00482" },
          oldWAC: { type: "number", example: 142.5 },
          newWAC: { type: "number", example: 145 },
          variableCost: { type: "number", example: 4.1 },
          oldCost: { type: "number", example: 146.6 },
          newCost: { type: "number", example: 149.1 },
          status: { type: "string", enum: ["success", "pending", "failed"], example: "success" },
        },
      },
      WACSearchResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Success" },
          data: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: { $ref: "#/components/schemas/WACBody" },
              },
              variableCost: { type: "number", example: 4.1 },
              pagination: { $ref: "#/components/schemas/PaginationOutput" },
            },
          },
          error: { type: "string", nullable: true, example: null },
        },
        example: {
          success: true,
          message: "Success",
          data: {
            items: [wacBodyExample],
            variableCost: 4.1,
            pagination: paginationExample,
          },
          error: null,
        },
      },
      WACItemResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Item created successfully" },
          data: { $ref: "#/components/schemas/WACBody" },
          error: { type: "string", nullable: true, example: null },
        },
        example: {
          success: true,
          message: "Item created successfully",
          data: wacBodyExample,
          error: null,
        },
      },
      WACLogSearchResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Success" },
          data: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: { $ref: "#/components/schemas/WACBodyLog" },
              },
              pagination: { $ref: "#/components/schemas/PaginationOutput" },
            },
          },
          error: { type: "string", nullable: true, example: null },
        },
        example: {
          success: true,
          message: "Success",
          data: {
            items: [wacBodyLogExample],
            pagination: paginationExample,
          },
          error: null,
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Item with id 999 not found" },
          data: { type: "object", nullable: true, example: null },
          error: { type: "string", example: "Item with id 999 not found" },
        },
      },
    },
  },
};
