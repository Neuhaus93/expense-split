import { format } from "date-fns";

export const formatDateForDateInput = (date: Date): string => {
    return format(date, "yyyy-MM-dd");
};

export const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);

    return new Intl.DateTimeFormat("pt-BR").format(
        new Date(year, month - 1, day)
    );
};
