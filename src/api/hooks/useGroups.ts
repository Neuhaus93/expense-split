import { useQuery } from "@tanstack/react-query";
import { supabase } from "$/api/supabase";

export const useGroups = () => {
    return useQuery({
        queryKey: ["groups"],
        queryFn: async () => {
            const res = await supabase.from("groups").select();

            return {
                count: res.count,
                result: res.data,
            };
        },
    });
};
