import { pgTable, serial, text, varchar, numeric, timestamp } from "drizzle-orm/pg-core";

export const wacBodyItems = pgTable("wac_body_items", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
  rawCode: varchar("raw_code", { length: 20 }).notNull(),
  rawName: text("raw_name").notNull(),
  dcCuttingCode: varchar("dc_cutting_code", { length: 20 }).default("").notNull(),
  dcName: text("dc_name").default("").notNull(),
  supplierCode: varchar("supplier_code", { length: 20 }).default("").notNull(),
  rawWAC: numeric("raw_wac", { precision: 12, scale: 2 }).notNull(),
  newUnitCost: numeric("new_unit_cost", { precision: 12, scale: 2 }).notNull(),
  variableCost: numeric("variable_cost", { precision: 12, scale: 2 }).default("0").notNull(),
});

export const wacBodyLogItems = pgTable("wac_body_log_items", {
  requestNo: varchar("request_no", { length: 30 }).primaryKey(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
  rawCode: varchar("raw_code", { length: 20 }).notNull(),
  rawName: text("raw_name").notNull(),
  dcCuttingCode: varchar("dc_cutting_code", { length: 20 }).default("").notNull(),
  dcName: text("dc_name").default("").notNull(),
  supplierCode: varchar("supplier_code", { length: 20 }).default("").notNull(),
  supplierName: text("supplier_name").default("").notNull(),
  poNo: varchar("po_no", { length: 30 }).notNull(),
  rawWAC: numeric("raw_wac", { precision: 12, scale: 2 }).notNull(),
  newUnitCost: numeric("new_unit_cost", { precision: 12, scale: 2 }).notNull(),
  variableCost: numeric("variable_cost", { precision: 12, scale: 2 }).default("0").notNull(),
  status: varchar("status", { length: 10 }).default("pending").notNull(),
});
