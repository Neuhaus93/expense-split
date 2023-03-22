import { useQuery } from "@tanstack/react-query";
import { supabase } from "$/api/supabase";
import { queryKeys } from "./queryKeys";

export const useGroups = () => {
    return useQuery({
        ...queryKeys.groups.all,
        queryFn: async () => {
            const res = await supabase
                .from("groups")
                .select()
                .order("created_at", { ascending: false });

            if (!Array.isArray(res.data)) {
                throw new Error("Error finding groups");
            }

            return res.data;
        },
    });
};
