import { supabase } from "$/api/supabase";
import { queryClient } from "$/context/QueryClient";
import type { Expenses, ExpensesTable } from "$/types";
import { useMutation } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
// import dayjs from "dayjs";

export const useCreateExpense = () => {
    return useMutation({
        mutationFn: async (values: ExpensesTable["Insert"]) => {
            const response = await supabase
                .from("expenses")
                .insert(values)
                .select();

            if (Array.isArray(response.data) && response.data.length > 0) {
                return response.data[0] as Expenses[number];
            }

            throw new Error("Something went wrong");
        },
        onSuccess(data) {
            // For now, just invalidate the expenses list
            queryClient.invalidateQueries(
                queryKeys.expenses.all(data.group_id).queryKey
            );

            // TODO: Optimisticly update the list
            // // Cancel any outgoing refetches
            // queryClient.cancelQueries({
            //     queryKey: ["expenses", { groupId: data.group_id }],
            // });

            // // Insert new expense into expenses list
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

// function sortExpenses(expenses: Expenses) {
//     return (
//         expenses
//             .map((e) => ({ ...e, _sort: dayjs(e.date).unix() }))
//             .sort((a, b) => b._sort - a._sort)
//             // eslint-disable-next-line @typescript-eslint/no-unused-vars
//             .map(({ _sort, ...rest }) => rest)
//     );
// }
