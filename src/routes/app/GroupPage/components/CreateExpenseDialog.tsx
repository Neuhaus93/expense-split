import { useCreateExpense } from "$/api/hooks/useCreateExpense";
import { useUpdateExpense } from "$/api/hooks/useUpdateExpense";
import type { Expenses, Group } from "$/types";
import { formatDateForDateInput } from "$/utils/date";
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
    Modal,
    ModalClose,
    ModalDialog,
    Option,
    Select,
    Typography,
    type ModalProps,
} from "@mui/joy";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
    name: string;
    value: string;
    date: string;
};

type CreateExpenseDialogProps = {
    group: Group;
    expense: Expenses[number] | null;
} & Omit<ModalProps, "children">;

const CreateExpenseDialog: React.FC<CreateExpenseDialogProps> = (props) => {
    const { group, expense, open, onClose } = props;
    const isCreate = expense === null;
    const { isLoading: isLoadingCreate, mutateAsync: mutateAsyncCreate } =
        useCreateExpense();
    const { isLoading: isLoadingUpdate, mutateAsync: mutateAsyncUpdate } =
        useUpdateExpense();

    const defaultValues = useMemo(() => {
        return getDefaultValues({ expense, group });
    }, [expense, group]);

    const text = getText({ isCreate });

    const [paidBy, setPaidBy] = useState(defaultValues.paid_by);
    const [splitWith, setSplitWith] = useState<Record<number, boolean>>(
        defaultValues.split_with
    );

    const { handleSubmit, register } = useForm<FormData>({
        defaultValues: {
            name: defaultValues.name,
            value: defaultValues.value,
            date: defaultValues.date,
        },
    });

    const handleSplitWithToggle = (id: number, checked: boolean) => {
        setSplitWith((current) => ({
            ...current,
            [id]: checked,
        }));
    };

    const onSubmit = handleSubmit(async (data) => {
        const splittedWithMembers = Object.keys(splitWith).filter(
            (id) => !!splitWith[Number(id)]
        );
        const cents = Math.abs(Math.floor(Number(data.value) * 100));
        const eachMemberValue = Math.floor(cents / splittedWithMembers.length);
        const rest = cents - eachMemberValue * splittedWithMembers.length;
        const payload = {
            name: data.name,
            date: data.date,
            cents: cents,
            paid_by: paidBy,
            group_id: group.id,
            paid_to: splittedWithMembers.map((memberId, index) => ({
                member_id: Number(memberId),
                cents: index === 0 ? eachMemberValue + rest : eachMemberValue,
            })),
        };

        if (isCreate) {
            await mutateAsyncCreate(payload);
        } else {
            await mutateAsyncUpdate({ ...payload, id: expense.id });
        }
        (onClose as any)();
    });

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                sx={{
                    "& .MuiFormControl-root + .MuiFormControl-root": {
                        mt: 2,
                    },
                }}
            >
                <ModalClose
                    variant="outlined"
                    sx={{
                        top: "calc(-1/4 * var(--IconButton-size))",
                        right: "calc(-1/4 * var(--IconButton-size))",
                        boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
                        borderRadius: "50%",
                        bgcolor: "background.body",
                    }}
                />
                <Typography level="h5" fontWeight="bold" sx={{ mb: 3 }}>
                    {text.title}
                </Typography>
                <Box>
                    <form onSubmit={onSubmit}>
                        <Grid container spacing={3}>
                            <Grid xs={12} md={6}>
                                <FormControl required>
                                    <FormLabel>Title</FormLabel>
                                    <Input
                                        placeholder="Enter title"
                                        type="text"
                                        slotProps={{ input: register("name") }}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Value</FormLabel>
                                    <Input
                                        type="number"
                                        startDecorator={"R$"}
                                        slotProps={{
                                            input: {
                                                ...register("value"),
                                                step: 0.01,
                                            },
                                        }}
                                    />
                                    {/* <NumericFormat
                                        decimalScale={2}
                                        startDecorator={"R$"}
                                        onValueChange={(values) =>
                                            setValue("value", values.value)
                                        }
                                        slotProps={{
                                            input: {
                                                type: "number",
                                                step: 0.1,
                                            },
                                        }}
                                        customInput={Input}
                                        allowNegative={false}
                                    /> */}
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
                                        onChange={(_, newValue: any) =>
                                            setPaidBy(newValue)
                                        }
                                    >
                                        {group.members.map((member) => (
                                            <Option
                                                key={member.id}
                                                value={member.id}
                                            >
                                                {member.alias}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid xs={12} md={6}>
                                <FormLabel>Split between</FormLabel>
                                <Box role="group">
                                    <List size="sm">
                                        {group.members?.map((member) => (
                                            <ListItem key={member.id}>
                                                <Checkbox
                                                    label={member.alias}
                                                    checked={
                                                        !!splitWith[member.id]
                                                    }
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
                                <Button
                                    type="submit"
                                    sx={{ mt: 1 }}
                                    loading={isLoadingCreate || isLoadingUpdate}
                                >
                                    {text.button}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </ModalDialog>
        </Modal>
    );
};

function getText({ isCreate }: { isCreate: boolean }) {
    return {
        title: isCreate ? "Create Expense" : "Update Expense",
        button: isCreate ? "Create expense" : "Update expense",
    };
}

function getDefaultValues({
    expense,
    group,
}: Pick<CreateExpenseDialogProps, "expense" | "group">) {
    return {
        paid_by: expense?.paid_by ?? group.members[0]?.id,
        split_with: expense?.paid_to
            ? expense?.paid_to.reduce(
                  (prev, cur) => ({ ...prev, [cur.member_id]: true }),
                  {}
              )
            : group.members.reduce(
                  (prev, cur) => ({ ...prev, [cur.id]: true }),
                  {}
              ),
        name: expense?.name ?? "",
        value: expense?.cents ? String(expense.cents / 100) : "",
        date: expense?.date ?? formatDateForDateInput(new Date()),
    };
}

export default CreateExpenseDialog;
