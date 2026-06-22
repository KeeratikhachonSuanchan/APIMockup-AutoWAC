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
          id: { type: "integer" },
          rowNo: { type: "integer" },
          rawCode: { type: "string" },
          rawName: { type: "string" },
          dcCuttingCode: { type: "string" },
          dcName: { type: "string" },
          supplierCode: { type: "string" },
          oldWAC: { type: "number" },
          newWAC: { type: "number" },
          variableCost: { type: "number" },
          tempVariableCost: { type: "number" },
          oldCost: { type: "number" },
          newCost: { type: "number" },
          isEdit: { type: "boolean" },
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
          requestNo: { type: "string" },
          timestamp: { type: "string" },
          rawCode: { type: "string" },
          rawName: { type: "string" },
          dcCuttingCode: { type: "string" },
          dcName: { type: "string" },
          supplierCode: { type: "string" },
          supplierName: { type: "string" },
          poNo: { type: "string" },
          oldWAC: { type: "number" },
          newWAC: { type: "number" },
          variableCost: { type: "number" },
          oldCost: { type: "number" },
          newCost: { type: "number" },
          status: {
            type: "string",
            enum: ["success", "pending", "failed"],
          },
        },
      },
    },
  },
};
