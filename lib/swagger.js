const swaggerSpec = {
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
              schema: { $ref: "#/components/schemas/WACSearchInput" },
            },
          },
        },
        responses: {
          200: {
            description: "สำเร็จ",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/WACResponse" },
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
          201: { description: "สร้างสำเร็จ" },
          400: { description: "ข้อมูลไม่ครบ" },
        },
      },
    },
    "/api/wac/{id}/variable-cost": {
      patch: {
        tags: ["Auto WAC"],
        summary: "แก้ไข VariableCost",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Id ของ item",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["VariableCost"],
                properties: {
                  VariableCost: { type: "number", example: 5.0 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "แก้ไขสำเร็จ" },
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
          200: { description: "ลบสำเร็จ" },
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
              schema: { $ref: "#/components/schemas/WACLogSearchInput" },
            },
          },
        },
        responses: {
          200: {
            description: "สำเร็จ",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/WACLogResponse" },
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
              schema: { $ref: "#/components/schemas/WACLogExportInput" },
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
      Pagination: {
        type: "object",
        properties: {
          Offset: { type: "integer" },
          Limit: { type: "integer" },
          Page: { type: "integer" },
          TotalItems: { type: "integer" },
          TotalPages: { type: "integer" },
          HasNext: { type: "boolean" },
          HasPrevious: { type: "boolean" },
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
          SearchKey: { type: "string", nullable: true },
          VariableCost: { type: "number" },
          Items: {
            type: "array",
            items: { $ref: "#/components/schemas/WACBody" },
          },
          Pagination: { $ref: "#/components/schemas/Pagination" },
        },
      },
      WACSearchInput: {
        type: "object",
        properties: {
          SearchKey: {
            type: "string",
            description: "ค้นหาด้วย RawCode, RawName, DCCuttingCode, DCName, SupplierCode",
          },
          Page: { type: "integer", default: 1 },
          Limit: { type: "integer", default: 10 },
        },
      },
      WACLogSearchInput: {
        type: "object",
        properties: {
          SearchKey: {
            type: "string",
            description: "ค้นหาด้วย RequestNo, SupplierCode, SupplierName, PONo, Status",
          },
          DateFrom: {
            type: "string",
            format: "date",
            description: "วันที่เริ่มต้น (YYYY-MM-DD)",
            example: "2026-05-13",
          },
          DateTo: {
            type: "string",
            format: "date",
            description: "วันที่สิ้นสุด (YYYY-MM-DD)",
            example: "2026-05-14",
          },
          ItemSearchKey: {
            type: "string",
            description: "ค้นหาด้วย RawCode, RawName, DCCuttingCode, DCName",
          },
          Page: { type: "integer", default: 1 },
          Limit: { type: "integer", default: 10 },
        },
      },
      WACLogExportInput: {
        type: "object",
        properties: {
          SearchKey: {
            type: "string",
            description: "ค้นหาด้วย RequestNo, SupplierCode, SupplierName, PONo, Status",
          },
          DateFrom: {
            type: "string",
            format: "date",
            description: "วันที่เริ่มต้น (YYYY-MM-DD)",
            example: "2026-05-13",
          },
          DateTo: {
            type: "string",
            format: "date",
            description: "วันที่สิ้นสุด (YYYY-MM-DD)",
            example: "2026-05-14",
          },
          ItemSearchKey: {
            type: "string",
            description: "ค้นหาด้วย RawCode, RawName, DCCuttingCode, DCName",
          },
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
          SearchKey: { type: "string", nullable: true },
          DateFrom: { type: "string", nullable: true },
          DateTo: { type: "string", nullable: true },
          ItemSearchKey: { type: "string", nullable: true },
          Items: {
            type: "array",
            items: { $ref: "#/components/schemas/WACBodyLog" },
          },
          Pagination: { $ref: "#/components/schemas/Pagination" },
        },
      },
    },
  },
};

module.exports = { swaggerSpec };
