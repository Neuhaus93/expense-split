import App from "$/App";
import { SessionContext } from "$/context/SessionContext";
import AuthLayout from "$/routes/auth/AuthLayout";
import { useContext } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

const ProtectedRoute = (props: { children: JSX.Element }): JSX.Element => {
    const session = useContext(SessionContext);

    if (!session) {
        return <Navigate to="/auth/login" replace />;
    }

    return props.children;
};

const AuthRoute = (props: { children: JSX.Element }): JSX.Element => {
    const session = useContext(SessionContext);

    if (session) {
        return <Navigate to="/" replace />;
    }

    return props.children;
};

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <App />
            </ProtectedRoute>
        ),
    },
    {
        path: "/auth/login",
        element: (
            <AuthRoute>
                <AuthLayout />
            </AuthRoute>
        ),
    },
    {
        path: "/auth/signup",
        element: (
            <AuthRoute>
                <AuthLayout signupPage />
            </AuthRoute>
        ),
    },
]);
