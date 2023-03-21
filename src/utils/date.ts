import { format } from "date-fns";

export const formatDateToDateInput = (date: Date): string => {
    return format(date, "yyyy-MM-dd");
};
