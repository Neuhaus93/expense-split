import { supabase } from "$/api/supabase";
import { Group } from "$/types";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

type UseGroup = {
    params: {
        id: number;
    };
};

async function getGroup(params: UseGroup["params"]) {
    return await supabase
        .from("groups")
        .select("*, members(*)")
        .eq("id", Number(params?.id));
}

export const useGroup = (args = {} as UseGroup) => {
    const { params } = args;

    return useQuery({
        ...queryKeys.groups.byId(params.id),
        queryFn: async () => {
            const res = await getGroup(params);

            if (!Array.isArray(res.data)) {
                throw new Error("Group not found");
            }

            return res.data?.[0] as Group;
        },
        enabled: verifyId(params?.id),
    });
};

function verifyId(id: number | undefined) {
    return typeof id === "number" && !isNaN(id);
}
