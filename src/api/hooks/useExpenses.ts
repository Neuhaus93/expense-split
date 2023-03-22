import { useQuery } from "@tanstack/react-query";
import { supabase } from "$/api/supabase";

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

            return res.data;
        },
        enabled: verifyId(params.groupId),
    });
};

export type Expenses = ReturnType<typeof useExpenses>["data"];

function verifyId(id: number | undefined) {
    return typeof id === "number" && !isNaN(id);
}
