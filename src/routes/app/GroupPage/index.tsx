import { useExpenses } from "$/api/hooks/useExpenses";
import { useGroup } from "$/api/hooks/useGroup";
import type { Group, Expenses } from "$/types";
import { formatCents } from "$/utils/currency";
import { formatDate } from "$/utils/date";
import { Box, Button, Sheet, Typography } from "@mui/joy";
import { useState } from "react";
import { useParams } from "react-router-dom";
import CreateExpenseDialog from "./components/CreateExpenseDialog";

const GroupPage = () => {
    const { groupId } = useParams();

    const [expenseDialog, setExpenseDialog] = useState({
        open: false,
        expense: null as Expenses[number] | null,
    });
    const { data: group, status } = useGroup({
        params: { id: Number(groupId) },
    });
    const { data: expenses } = useExpenses({
        groupId: Number(groupId),
    });

    if (status === "loading") {
        return <Typography level="h6">Loading...</Typography>;
    }

    if (status === "error") {
        return <Typography level="h6">Something went wrong</Typography>;
    }

    return (
        <div>
            <Typography level="h2">{group.name}</Typography>

            {group.description && <Typography>{group.description}</Typography>}

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    onClick={() =>
                        setExpenseDialog({ open: true, expense: null })
                    }
                >
                    Create Expense
                </Button>
            </Box>

            <ExpensesList
                expenses={expenses}
                members={group.members}
                onExpenseClick={(expense) =>
                    setExpenseDialog({ open: true, expense })
                }
            />

            <CreateExpenseDialog
                key={String(expenseDialog.open)}
                expense={expenseDialog.expense}
                open={expenseDialog.open}
                onClose={() => setExpenseDialog({ open: false, expense: null })}
                group={group}
            />
        </div>
    );
};

const ExpensesList: React.FC<{
    expenses: Expenses | undefined;
    members: NonNullable<Group>["members"];
    onExpenseClick: (expense: Expenses[number]) => void;
}> = ({ expenses, members, onExpenseClick }) => {
    /**
     * Get the member alias given the member id
     */
    const getMemberAlias = (id: number) => {
        if (!Array.isArray(members)) {
            return "";
        }

        return members.find((member) => member.id === id)?.alias;
    };

    if (!expenses) {
        return null;
    }

    return (
        <Box
            sx={{
                mt: 3,
                "& > div + div": {
                    mt: 1.5,
                },
            }}
        >
            {expenses.map((expense) => (
                <Sheet
                    variant="outlined"
                    key={expense.id}
                    onClick={() => onExpenseClick(expense)}
                    sx={{
                        borderRadius: 8,
                        p: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                        cursor: "pointer",
                    }}
                >
                    <div>
                        <Typography level="h6">{expense.name}</Typography>
                        <Typography sx={{ mt: 0.5 }}>
                            Paid by{" "}
                            <Typography component="span" fontWeight="bold">
                                {getMemberAlias(expense.paid_by)}
                            </Typography>
                        </Typography>
                    </div>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography>{formatCents(expense.cents)}</Typography>
                        <Typography>{formatDate(expense.date)}</Typography>
                    </Box>
                </Sheet>
            ))}
        </Box>
    );
};

export default GroupPage;
