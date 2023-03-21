import { supabase } from "$/api/supabase";
import type { GroupTable, Groups, Group } from "$/types";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "$/context/QueryClient";

export const useCreateGroup = () => {
    return useMutation({
        mutationFn: async (values: GroupTable["Insert"]) => {
            const response = await supabase
                .from("groups")
                .insert(values)
                .select();

            if (Array.isArray(response.data) && response.data.length > 0) {
                return response.data[0];
            }

            throw new Error("Something went wrong");
        },
        onSuccess(data) {
            // Cancel any outgoing refetches
            // (so they don't overwrite our optimistic update)
            queryClient.cancelQueries({ queryKey: ["groups"] });

            // Optimistically update Groups
            queryClient.setQueryData<Groups>(["groups"], (old) => {
                if (!old) {
                    return {
                        result: [data],
                        count: 1,
                    };
                }

                return {
                    result: [data, ...old.result],
                    count: old.count + 1,
                };
            });

            // Insert new group into the cache
            queryClient.setQueryData<Group>(
                ["group", { id: data.id }],
                () => data
            );
        },
    });
};
