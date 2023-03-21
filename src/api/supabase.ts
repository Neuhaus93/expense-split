import { createClient } from "@supabase/supabase-js";
import { Database } from "$/schema";

export const supabase = createClient<Database>(
    import.meta.env.VITE_APP_SUPABASE_URL,
    import.meta.env.VITE_APP_SUPABASE_KEY
);
