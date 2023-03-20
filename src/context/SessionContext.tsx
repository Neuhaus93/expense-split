import { supabase } from "$/api/supabase";
import { Typography } from "@mui/joy";
import { Session } from "@supabase/supabase-js";
import React, {
    createContext,
    PropsWithChildren,
    useEffect,
    useState,
} from "react";

export const SessionContext = createContext<Session | null>(null);

export const SessionProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loadingSession, setLoadingSession] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoadingSession(false);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    if (loadingSession) {
        return <Typography level="h1">Loading...</Typography>;
    }

    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    );
};
