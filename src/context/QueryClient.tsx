import {
    QueryClient,
    QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 2 minutes
            staleTime: 1000 * 60 * 2,
        },
    },
});

export const QueryClientProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => (
    <TanstackQueryClientProvider client={queryClient}>
        {children}
    </TanstackQueryClientProvider>
);
