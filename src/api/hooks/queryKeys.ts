import { createQueryKeyStore } from "@lukemorales/query-key-factory";

export const queryKeys = createQueryKeyStore({
    groups: {
        all: null,
        byId: (groupId: number) => [groupId],
    },
    expenses: {
        all: (groupId: number) => [groupId],
    },
});
