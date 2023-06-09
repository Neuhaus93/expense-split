import ColorSchemeToggle from "$/components/ColorThemeToggle";
import { Box, BoxProps, Button, Link, useColorScheme } from "@mui/joy";
import { useState } from "react";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { supabase } from "../api/supabase";

function Header(props: BoxProps) {
    return (
        <Box
            component="header"
            className="Header"
            {...props}
            sx={[
                {
                    p: 2,
                    px: 5,
                    gap: 2,
                    bgcolor: "background.surface",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gridColumn: "1 / -1",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    position: "sticky",
                    top: 0,
                    zIndex: 1100,
                },
                ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
            ]}
        />
    );
}

const Layout = () => {
    const [loading, setLoading] = useState(false);
    const { mode, setMode } = useColorScheme();

    /**
     * Handles session logout
     */
    const handleLogout = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setLoading(false);
    };

    return (
        <Box>
            <Header>
                <Link
                    component={RouterLink}
                    to="/app"
                    level="h5"
                    underline="none"
                    color="neutral"
                >
                    Expense Splitter
                </Link>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ColorSchemeToggle />
                    <Button
                        color="neutral"
                        size="sm"
                        variant="plain"
                        onClick={handleLogout}
                        loading={loading}
                    >
                        Log out
                    </Button>
                </Box>
            </Header>
            <Box sx={{ maxWidth: "820px", mx: "auto", mt: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
