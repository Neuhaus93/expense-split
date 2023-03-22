import dayjs from "dayjs";

export const formatDateForDateInput = (date: Date): string => {
    return dayjs(date).format("YYYY-MM-DD");
};

export const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);

    return new Intl.DateTimeFormat("pt-BR").format(
        new Date(year, month - 1, day)
    );
};
