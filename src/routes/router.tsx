import Layout from "$/components/Layout";
import { SessionContext } from "$/context/SessionContext";
import GroupPage from "$/routes/app/GroupPage";
import HomePage from "$/routes/app/HomePage";
import AuthLayout from "$/routes/auth/AuthLayout";
import { useContext } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

/**
 * Just authenticated users can access protected routes
 */
const ProtectedRoute = (props: { children: JSX.Element }): JSX.Element => {
    const session = useContext(SessionContext);

    if (!session) {
        return <Navigate to="/auth/login" replace />;
    }

    return props.children;
};

/**
 * Just unauthenticated users can access auth routes
 */
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
        element: <Navigate to="/app" replace />,
    },
    {
        path: "/app",
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "/app/group/:groupId",
                element: (
                    <ProtectedRoute>
                        <GroupPage />
                    </ProtectedRoute>
                ),
            },
        ],
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
