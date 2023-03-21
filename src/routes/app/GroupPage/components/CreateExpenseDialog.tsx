import { useCreateExpense } from "$/api/hooks/useCreateExpense";
import { type Group } from "$/api/hooks/useGroup";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";

type FormData = {
    name: string;
    value: string;
    date: string;
};

type CreateExpenseDialogProps = {
    group: NonNullable<Group>;
} & Omit<ModalProps, "children">;

const CreateExpenseDialog: React.FC<CreateExpenseDialogProps> = (props) => {
    const { group, open, onClose } = props;
    const { mutate, isSuccess, isLoading } = useCreateExpense();

    useEffect(() => {
        if (isSuccess) {
            (onClose as any)();
        }
    }, [isSuccess, onClose]);

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
            date: formatDateForDateInput(new Date()),
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
                    Create Expense
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

                                <FormControl required>
                                    <FormLabel>Value</FormLabel>
                                    <NumericFormat
                                        decimalScale={2}
                                        startDecorator={"R$"}
                                        onValueChange={(values) => {
                                            setValue("value", values.value);
                                        }}
                                        slotProps={{
                                            input: {
                                                type: "number",
                                                step: 0.1,
                                            },
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
                                        onChange={(_, newValue: any) =>
                                            setPaidBy(newValue)
                                        }
                                    >
                                        {members.map((member) => (
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
                                        {members?.map((member) => (
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
                                    loading={isLoading}
                                >
                                    Create expense
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </ModalDialog>
        </Modal>
    );
};

export default CreateExpenseDialog;
