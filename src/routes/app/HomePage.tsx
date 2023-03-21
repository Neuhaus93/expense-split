import { useCreateGroup } from "$/api/hooks/useCreateGroup";
import { useGroups } from "$/api/hooks/useGroups";
import { Box, Button, Card, Grid, Input, Link, Typography } from "@mui/joy";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const createGroupInitialValues = {
    name: "",
    description: "",
};

const HomePage: React.FC = () => {
    const navigate = useNavigate();

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
                                            "&:hover": {
                                                boxShadow: "md",
                                                borderColor:
                                                    "neutral.outlinedHoverBorder",
                                            },
                                        }}
                                    >
                                        <Link
                                            component={RouterLink}
                                            overlay
                                            to={`/app/group/${group.id}`}
                                            fontWeight="bold"
                                            level="body1"
                                            underline="none"
                                            sx={{ mb: 1 }}
                                            color="neutral"
                                        >
                                            {group.name}
                                        </Link>
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

                    try {
                        const newGroup = await mutateAsync(createGroupValues);
                        navigate(`/app/group/${newGroup.id}`);
                    } catch (err) {
                        console.log(err);
                    }
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
