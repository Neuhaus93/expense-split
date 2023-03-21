import { QueryClientProvider } from "$/context/QueryClient";
import { SessionProvider } from "$/context/SessionContext";
import { router } from "$/routes/router";
import { CssBaseline } from "@mui/joy";
import GlobalStyles from "@mui/joy/GlobalStyles";
import { CssVarsProvider } from "@mui/joy/styles";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    ":root": {
                        "--Collapsed-breakpoint": "769px", // form will stretch when viewport is below `769px`
                        "--Cover-width": "40vw", // must be `vw` only
                        "--Form-maxWidth": "700px",
                    },
                }}
            />
            <SessionProvider>
                <QueryClientProvider>
                    <RouterProvider router={router} />
                    <ReactQueryDevtools initialIsOpen />
                </QueryClientProvider>
            </SessionProvider>
        </CssVarsProvider>
    </React.StrictMode>
);
