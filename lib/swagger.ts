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
                schema: { $ref: "#/components/schemas/ApiResponse" },
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
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
          400: { description: "ข้อมูลไม่ครบ" },
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
                required: ["Id", "VariableCost"],
                properties: {
                  Id: { type: "integer", example: 1 },
                  VariableCost: { type: "number", example: 5.0 },
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
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
          400: { description: "VariableCost is required" },
          404: { description: "ไม่พบ item" },
        },
      },
    },
    "/api/wac/{id}": {
      delete: {
        tags: ["Auto WAC"],
        summary: "ลบข้อมูล WAC",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Id ของ item",
          },
        ],
        responses: {
          200: {
            description: "ลบสำเร็จ",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
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
                schema: { $ref: "#/components/schemas/ApiResponse" },
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
          page: { type: "integer" },
          limit: { type: "integer" },
          totalItems: { type: "integer" },
          totalPages: { type: "integer" },
          hasNext: { type: "boolean" },
          hasPrevious: { type: "boolean" },
        },
      },
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: { type: "object" },
          error: { type: "string", nullable: true },
        },
      },
      WACFilter: {
        type: "object",
        properties: {
          searchKeyword: {
            type: "string",
            description: "ค้นหาด้วย RawCode, RawName, DCCuttingCode, DCName, SupplierCode",
          },
        },
      },
      WACLogFilter: {
        type: "object",
        properties: {
          searchKeyword: {
            type: "string",
            description: "ค้นหาด้วย RequestNo, SupplierCode, SupplierName, PONo, Status",
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
            description: "ค้นหาด้วย RawCode, RawName, DCCuttingCode, DCName",
          },
        },
      },
      WACBody: {
        type: "object",
        properties: {
          Id: { type: "integer" },
          RowNo: { type: "integer" },
          RawCode: { type: "string" },
          RawName: { type: "string" },
          DCCuttingCode: { type: "string" },
          DCName: { type: "string" },
          SupplierCode: { type: "string" },
          OldWAC: { type: "number" },
          NewWAC: { type: "number" },
          VariableCost: { type: "number" },
          TempVariableCost: { type: "number" },
          OldCost: { type: "number" },
          NewCost: { type: "number" },
          IsEdit: { type: "boolean" },
        },
      },
      WACResponse: {
        type: "object",
        properties: {
          filter: { $ref: "#/components/schemas/WACFilter" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/WACBody" },
          },
          variableCost: { type: "number" },
          pagination: { $ref: "#/components/schemas/PaginationOutput" },
        },
      },
      WACCreateInput: {
        type: "object",
        required: ["RawCode", "RawName"],
        properties: {
          RawCode: { type: "string", example: "108009" },
          RawName: { type: "string", example: "ปลากะพงขาวแช่แข็ง ไซส์ M กก.ละ" },
          DCCuttingCode: { type: "string", example: "837744" },
          DCName: { type: "string", example: "ARO ปลากะพงขาวแล่แช่แข็ง ไซส์ M กก.ละ" },
          SupplierCode: { type: "string", example: "20047" },
          OldWAC: { type: "number", example: 142.5 },
          NewWAC: { type: "number", example: 145 },
          VariableCost: { type: "number", example: 4.1 },
        },
      },
      WACBodyLog: {
        type: "object",
        properties: {
          RequestNo: { type: "string" },
          Timestamp: { type: "string" },
          RawCode: { type: "string" },
          RawName: { type: "string" },
          DCCuttingCode: { type: "string" },
          DCName: { type: "string" },
          SupplierCode: { type: "string" },
          SupplierName: { type: "string" },
          PONo: { type: "string" },
          OldWAC: { type: "number" },
          NewWAC: { type: "number" },
          VariableCost: { type: "number" },
          OldCost: { type: "number" },
          NewCost: { type: "number" },
          Status: {
            type: "string",
            enum: ["success", "pending", "failed"],
          },
        },
      },
      WACLogResponse: {
        type: "object",
        properties: {
          filter: { $ref: "#/components/schemas/WACLogFilter" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/WACBodyLog" },
          },
          pagination: { $ref: "#/components/schemas/PaginationOutput" },
        },
      },
    },
  },
};
