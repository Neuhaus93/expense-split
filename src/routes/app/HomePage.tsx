import { useCreateGroup } from "$/api/hooks/useCreateGroup";
import { useGroups } from "$/api/hooks/useGroups";
import { Box, Button, Card, Grid, Input, Typography } from "@mui/joy";
import { useState } from "react";

const createGroupInitialValues = {
    name: "",
    description: "",
};

const HomePage: React.FC = () => {
    const { data } = useGroups();
    const { mutateAsync, isLoading } = useCreateGroup();
    const [createGroupValues, setCreateGroupValues] = useState(
        createGroupInitialValues
    );

    return (
        <Box sx={{ maxWidth: "820px", mx: "auto" }}>
            <div>
                <Typography level="h3" sx={{ mt: 3, mb: 2 }}>
                    Groups
                </Typography>

                {data?.result ? (
                    <Grid container spacing={2}>
                        {data.result.map((group) => {
                            return (
                                <Grid xs={12} sm={6} key={group.id}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            height: "100px",
                                            cursor: "pointer",
                                            "&:hover": {
                                                boxShadow: "md",
                                                borderColor:
                                                    "neutral.outlinedHoverBorder",
                                            },
                                        }}
                                    >
                                        <Typography
                                            fontWeight="bold"
                                            level="body1"
                                            sx={{ mb: 1 }}
                                        >
                                            {group.name}
                                        </Typography>
                                        <Typography level="body2">
                                            {group.description}
                                        </Typography>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                ) : (
                    <Typography>No Gruops found</Typography>
                )}
            </div>

            <Box
                sx={{ mt: 4, maxWidth: "320px" }}
                component="form"
                onSubmit={async (event) => {
                    event.preventDefault();
                    await mutateAsync(createGroupValues);
                    setCreateGroupValues(createGroupInitialValues);
                }}
            >
                <Typography level="h3" sx={{ mt: 4, mb: 2 }}>
                    Create new group
                </Typography>

                <label htmlFor="name">Name</label>
                <Input
                    slotProps={{ input: { id: "name" } }}
                    placeholder="Name"
                    required
                    sx={{ mb: 1, fontSize: "var(--joy-fontSize-sm)" }}
                    value={createGroupValues.name}
                    onChange={(e) =>
                        setCreateGroupValues((values) => ({
                            ...values,
                            name: e.target.value,
                        }))
                    }
                />

                <label htmlFor="description">Description</label>
                <Input
                    slotProps={{ input: { id: "description" } }}
                    placeholder="Description"
                    value={createGroupValues.description}
                    onChange={(e) =>
                        setCreateGroupValues((values) => ({
                            ...values,
                            description: e.target.value,
                        }))
                    }
                />

                <Button sx={{ mt: 1.5 }} type="submit" loading={isLoading}>
                    Create group
                </Button>
            </Box>
        </Box>
    );
};

export default HomePage;
