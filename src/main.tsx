import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CssVarsProvider } from "@mui/joy/styles";
import "@fontsource/public-sans";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <CssVarsProvider>
            <App />
        </CssVarsProvider>
    </React.StrictMode>
);
