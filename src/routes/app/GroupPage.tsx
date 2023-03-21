import { useGroup, type Group } from "$/api/hooks/useGroup";
import { formatDateToDateInput } from "$/utils/date";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    Grid,
    Input,
    List,
    ListItem,
    Option,
    Select,
    Sheet,
    Typography,
} from "@mui/joy";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { useParams } from "react-router-dom";
import { useCreateExpense } from "../../api/hooks/useCreateExpense";
import { useExpenses, type Expenses } from "../../api/hooks/useExpenses";

const GroupPage = () => {
    const { groupId } = useParams();
    const { data: group, status } = useGroup({
        params: { id: Number(groupId) },
    });
    const { data: expenses } = useExpenses({
        groupId: group?.id,
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

            <ExpensesList expenses={expenses} members={group.members} />

            <Box
                sx={{
                    mt: 3,
                    "& .MuiFormControl-root + .MuiFormControl-root": {
                        mt: 2,
                    },
                }}
            >
                <GroupForm group={group} />
            </Box>
        </div>
    );
};

const ExpensesList: React.FC<{
    expenses: Expenses;
    members: NonNullable<Group>["members"];
}> = ({ expenses, members }) => {
    /**
     * Get the member alias given the member id
     */
    const getMemberAlias = (id: number) => {
        if (!Array.isArray(members)) {
            return "";
        }

        return members.find((member) => member.id === id)?.alias;
    };

    if (!expenses?.result) {
        return null;
    }

    return (
        <Box
            sx={{
                mt: 3,
                "& div + div": {
                    mt: 1.5,
                },
            }}
        >
            {expenses.result.map((expense) => (
                <Sheet
                    variant="outlined"
                    key={expense.id}
                    sx={{ borderRadius: 8, p: 1.5 }}
                >
                    <Typography level="h6">{expense.name}</Typography>
                    <Typography sx={{ mt: 0.5 }}>
                        Paid by{" "}
                        <Typography component="span" fontWeight="bold">
                            {getMemberAlias(expense.paid_by)}
                        </Typography>
                    </Typography>
                </Sheet>
            ))}
        </Box>
    );
};

type FormData = {
    name: string;
    value: string;
    date: string;
};

const GroupForm: React.FC<{ group: NonNullable<Group> }> = ({ group }) => {
    const { mutate, isLoading } = useCreateExpense();

    const members =
        Array.isArray(group.members) && group.members.length > 0
            ? group.members
            : [];

    const [paidBy, setPaidBy] = useState(members[0]?.id);
    const [splitWith, setSplitWith] = useState<Record<number, boolean>>(
        members.reduce((prev, cur) => ({ ...prev, [cur.id]: true }), {})
    );

    const { handleSubmit, register, setValue } = useForm<FormData>({
        defaultValues: {
            date: formatDateToDateInput(new Date()),
        },
    });

    const handleSplitWithToggle = (id: number, checked: boolean) => {
        setSplitWith((current) => ({
            ...current,
            [id]: checked,
        }));
    };

    const onSubmit = handleSubmit((data) => {
        const splittedWithMembers = Object.keys(splitWith).filter(
            (id) => !!splitWith[Number(id)]
        );
        const cents = Number(data.value) * 100;
        const eachMemberValue = Math.floor(cents / splittedWithMembers.length);
        const rest = cents - eachMemberValue * splittedWithMembers.length;

        mutate({
            name: data.name,
            date: data.date,
            cents: cents,
            paid_by: paidBy,
            group_id: group.id,
            paid_to: splittedWithMembers.map((memberId, index) => ({
                member_id: Number(memberId),
                cents: index === 0 ? eachMemberValue + rest : eachMemberValue,
            })),
        });
    });

    return (
        <form onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid xs={12} md={7}>
                    <FormControl required>
                        <FormLabel>Title</FormLabel>
                        <Input
                            placeholder="Enter title"
                            type="text"
                            slotProps={{ input: register("name") }}
                        />
                    </FormControl>

                    <FormControl required>
                        <FormLabel>Value</FormLabel>
                        <NumericFormat
                            decimalScale={2}
                            startDecorator={"R$"}
                            onValueChange={(values) => {
                                setValue("value", values.value);
                            }}
                            slotProps={{
                                input: { type: "number", step: 0.1 },
                            }}
                            customInput={Input}
                            allowNegative={false}
                        />
                    </FormControl>

                    <FormControl required>
                        <FormLabel>Date</FormLabel>
                        <Input
                            placeholder="Enter date"
                            type="date"
                            slotProps={{ input: register("date") }}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Paid by</FormLabel>
                        <Select
                            placeholder="Who paid the bill?"
                            value={paidBy}
                            onChange={(_, newValue: any) => setPaidBy(newValue)}
                        >
                            {members.map((member) => (
                                <Option key={member.id} value={member.id}>
                                    {member.alias}
                                </Option>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid xs={12} md={5}>
                    <FormLabel>Split between</FormLabel>
                    <Box role="group">
                        <List size="sm">
                            {members?.map((member) => (
                                <ListItem key={member.id}>
                                    <Checkbox
                                        label={member.alias}
                                        checked={!!splitWith[member.id]}
                                        onChange={(event) =>
                                            handleSplitWithToggle(
                                                member.id,
                                                event.target.checked
                                            )
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Grid>

                <Grid xs={12}>
                    <Button type="submit" sx={{ mt: 1 }} loading={isLoading}>
                        Create expense
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default GroupPage;
