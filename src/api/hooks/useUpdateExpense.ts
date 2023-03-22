import { supabase } from "$/api/supabase";
import { queryClient } from "$/context/QueryClient";
import type { Expenses, ExpensesTable } from "$/types";
import { useMutation } from "@tanstack/react-query";

export const useUpdateExpense = () => {
    return useMutation({
        mutationFn: async (
            values: ExpensesTable["Update"] & { id: number }
        ) => {
            const response = await supabase
                .from("expenses")
                .update(values)
                .eq("id", values.id)
                .select();

            if (Array.isArray(response.data) && response.data.length > 0) {
                return response.data[0] as Expenses[number];
            }

            throw new Error("Something went wrong");
        },
        onSuccess(data) {
            // For now, just invalidate the expenses list
            queryClient.invalidateQueries([
                "expenses",
                { groupId: data.group_id },
            ]);

            // TODO: Update expense into expenses list

            // Cancel any outgoing refetches
            // queryClient.cancelQueries({
            //     queryKey: ["expenses", { groupId: data.group_id }],
            // });

            // queryClient.setQueryData<Expenses>(
            //     ["expenses", { groupId: data.group_id }],
            //     (old) => {
            //         if (!old) {
            //             return [data];
            //         }

            //         return sortExpenses([data, ...old]);
            //     }
            // );
        },
    });
};
