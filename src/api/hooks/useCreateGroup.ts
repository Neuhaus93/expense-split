import { supabase } from "$/api/supabase";
import type { GroupTable, Groups } from "$/types";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "$/context/QueryClient";

export const useCreateGroup = () => {
    return useMutation({
        mutationFn: async (values: GroupTable["Insert"]) => {
            const response = await supabase
                .from("groups")
                .insert(values)
                .select();

            if (response.status === 201 && Array.isArray(response.data)) {
                return response.data;
            }

            throw new Error("Something went wrong");
        },
        onSuccess(data) {
            // Cancel any outgoing refetches
            // (so they don't overwrite our optimistic update)
            queryClient.cancelQueries({ queryKey: ["groups"] });

            // Optimistically update to the new value
            queryClient.setQueryData<Groups>(["groups"], (old) => {
                if (!old) {
                    return {
                        result: [...data],
                        count: 1,
                    };
                }

                return {
                    result: [...old.result, ...data],
                    count: old.count + 1,
                };
            });
        },
    });
};
