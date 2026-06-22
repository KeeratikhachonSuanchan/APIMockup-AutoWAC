const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "WAC Mockup API",
    version: "1.0.0",
    description: "Mockup API for Weighted Average Cost (WAC)",
  },
  paths: {
    "/api/wac": {
      get: {
        tags: ["Auto WAC"],
        summary: "ดึงข้อมูล Auto WAC",
        parameters: [
          {
            name: "SearchKey",
            in: "query",
            schema: { type: "string" },
            description: "ค้นหาด้วย RawItemNo, RawItemName, DCItemNo, DCItemName, SupplierCode",
          },
          {
            name: "Page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "Limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
        ],
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
                  VariableCost: { type: "number", example: 18.0 },
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
    "/api/wac-log": {
      get: {
        tags: ["Transaction Log"],
        summary: "ดึงข้อมูล Transaction Log",
        parameters: [
          {
            name: "SearchKey",
            in: "query",
            schema: { type: "string" },
            description: "ค้นหาด้วย RequestNo, SupplierCode, SupplierName, PONo, Status",
          },
          {
            name: "DateFrom",
            in: "query",
            schema: { type: "string", format: "date" },
            description: "วันที่เริ่มต้น (YYYY-MM-DD)",
            example: "2026-06-01",
          },
          {
            name: "DateTo",
            in: "query",
            schema: { type: "string", format: "date" },
            description: "วันที่สิ้นสุด (YYYY-MM-DD)",
            example: "2026-06-30",
          },
          {
            name: "ItemSearchKey",
            in: "query",
            schema: { type: "string" },
            description: "ค้นหาด้วย RawItemName, DCItemNo, DCItemName",
          },
          {
            name: "Page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "Limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
        ],
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
          RawItemNo: { type: "string" },
          RawItemName: { type: "string" },
          RawWAC: { type: "number" },
          DCItemNo: { type: "string" },
          DCItemName: { type: "string" },
          SupplierCode: { type: "string" },
          VariableCost: { type: "number" },
          TempVariableCost: { type: "number" },
          NewUnitCost: { type: "number" },
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
      WACCreateInput: {
        type: "object",
        required: ["RawItemNo", "RawItemName"],
        properties: {
          RawItemNo: { type: "string", example: "RM-013" },
          RawItemName: { type: "string", example: "Lead Ingot M1" },
          RawWAC: { type: "number", example: 60.0 },
          DCItemNo: { type: "string", example: "DC-1013" },
          DCItemName: { type: "string", example: "Lead Shield Panel" },
          SupplierCode: { type: "string", example: "SUP-007" },
          SupplierName: { type: "string", example: "Heavy Metal Corp" },
          VariableCost: { type: "number", example: 7.5 },
          NewUnitCost: { type: "number", example: 67.5 },
        },
      },
      WACBodyLog: {
        type: "object",
        properties: {
          RequestNo: { type: "string" },
          Timestamp: { type: "string" },
          RawItemName: { type: "string" },
          RawWAC: { type: "number" },
          DCItemNo: { type: "string" },
          DCItemName: { type: "string" },
          SupplierCode: { type: "string" },
          SupplierName: { type: "string" },
          PONo: { type: "string" },
          VariableCost: { type: "number" },
          NewUnitCost: { type: "number" },
          Status: {
            type: "string",
            enum: ["Approved", "Pending", "Rejected"],
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
