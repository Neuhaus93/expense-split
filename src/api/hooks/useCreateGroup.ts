import { supabase } from "$/api/supabase";
import type { GroupsTable, GroupsRow } from "$/types";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "$/context/QueryClient";

export const useCreateGroup = () => {
    return useMutation({
        mutationFn: async (values: GroupsTable["Insert"]) => {
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
            queryClient.setQueryData<GroupsRow[]>(["groups"], (old) => {
                if (!old) {
                    return [data];
                }

                return [data, ...old];
            });
        },
    });
};
