import { Database as SchemaDatabase } from "$/schema";

export type Database = SchemaDatabase;

// Tables
export type MembersTable = Database["public"]["Tables"]["members"];
export type GroupsTable = Database["public"]["Tables"]["groups"];
export type ExpensesTable = Database["public"]["Tables"]["expenses"];

// Rows
export type MembersRow = Database["public"]["Tables"]["members"]["Row"];
export type GroupsRow = Database["public"]["Tables"]["groups"]["Row"];
export type ExpensesRow = Database["public"]["Tables"]["expenses"]["Row"];

// Request results
export type Group = GroupsRow & { members: MembersRow[] };
