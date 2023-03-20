import { createClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient(
    import.meta.env.VITE_APP_SUPABASE_URL,
    import.meta.env.VITE_APP_SUPABASE_KEY
);

function App() {
    const { data: countries } = useQuery({
        queryKey: ["countries"],
        queryFn: async () => {
            const res = await supabase.from("countries").select();
            return res.data;
        },
    });

    return (
        <ul>
            {countries?.map((country) => (
                <li key={country.name}>{country.name}</li>
            ))}
        </ul>
    );
}

export default App;
