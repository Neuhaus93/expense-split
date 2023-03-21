import { Database as SchemaDatabase } from "$/schema";

export type Database = SchemaDatabase;
export type GroupTable = SchemaDatabase["public"]["Tables"]["groups"];
export type ExpenseTable = SchemaDatabase["public"]["Tables"]["expenses"];

export type Groups = {
    result: GroupTable["Row"][];
    count: number;
};
export type Group = GroupTable["Row"];
