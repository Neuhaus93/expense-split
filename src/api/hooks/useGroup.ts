import { supabase } from "$/api/supabase";
import { useQuery } from "@tanstack/react-query";

type UseGroup = {
    params: {
        id?: number;
    };
};

export const groupQuery = (params: UseGroup["params"]) => ({
    queryKey: ["group", params],
    queryFn: async () => {
        const res = await supabase
            .from("groups")
            .select("*, members(*)")
            .eq("id", Number(params?.id));

        if (!Array.isArray(res.data) || res.data?.length === 0) {
            throw new Error("Group not found");
        }

        return res.data[0];
    },
    enabled: verifyId(params?.id),
});

export const useGroup = (args = {} as UseGroup) => {
    const { params } = args;

    return useQuery(groupQuery(params));
};

export type Group = ReturnType<typeof useGroup>["data"];

function verifyId(id: number | undefined) {
    return typeof id === "number" && !isNaN(id);
}
