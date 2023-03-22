import { supabase } from "$/api/supabase";
import type { Expenses } from "$/types";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

type UseExpensesArgs = {
    params: {
        groupId: number;
    };
};

export const useExpenses = (params: UseExpensesArgs["params"]) => {
    return useQuery({
        ...queryKeys.expenses.all(params.groupId),
        queryFn: async () => {
            const res = await supabase
                .from("expenses")
                .select()
                .eq("group_id", params.groupId)
                .order("date", { ascending: false });

            if (!Array.isArray(res.data)) {
                throw new Error("Expenses not found");
            }

            return res.data as Expenses;
        },
        enabled: verifyId(params.groupId),
    });
};

function verifyId(id: number | undefined) {
    return typeof id === "number" && !isNaN(id);
}
