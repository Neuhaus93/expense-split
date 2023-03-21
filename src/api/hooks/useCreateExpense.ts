import { supabase } from "$/api/supabase";
import type { ExpenseTable } from "$/types";
import { useMutation } from "@tanstack/react-query";

export const useCreateExpense = () => {
    return useMutation({
        mutationFn: async (values: ExpenseTable["Insert"]) => {
            const response = await supabase
                .from("expenses")
                .insert(values)
                .select();

            if (Array.isArray(response.data) && response.data.length > 0) {
                return response.data[0];
            }

            throw new Error("Something went wrong");
        },
        onSuccess(data) {
            console.log(data);
        },
    });
};
