import { supabase } from "$/api/supabase";
import type { Expenses } from "$/types";
import { useQuery } from "@tanstack/react-query";

type UseExpensesArgs = {
    params: {
        groupId?: number;
    };
};

export const useExpenses = (params: UseExpensesArgs["params"]) => {
    return useQuery({
        queryKey: ["expenses", params],
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
