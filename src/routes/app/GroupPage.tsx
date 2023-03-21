import { useGroup } from "$/api/hooks/useGroup";
import { Typography } from "@mui/joy";
import { useParams } from "react-router-dom";

const GroupPage = () => {
    const { groupId } = useParams();
    const { data } = useGroup({ params: { id: Number(groupId) } });

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Typography level="h2">{data.name}</Typography>

            {data.description && <Typography>{data.description}</Typography>}
        </div>
    );
};

export default GroupPage;
