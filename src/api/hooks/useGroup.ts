import { supabase } from "$/api/supabase";
import { useQuery } from "@tanstack/react-query";

type UseGroup = {
    params?: {
        id?: number;
    };
};

export const useGroup = (args = {} as UseGroup) => {
    const { params = {} } = args;

    return useQuery({
        queryKey: ["group", params],
        queryFn: async () => {
            const res = await supabase
                .from("groups")
                .select()
                .eq("id", Number(params.id));

            if (Array.isArray(res.data) && res.data.length === 1) {
                return res.data[0];
            }
        },
        enabled: verifyId(params.id),
    });
};

function verifyId(id: number | undefined) {
    return typeof id === "number" && !isNaN(id);
}
