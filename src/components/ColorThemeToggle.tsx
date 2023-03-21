import { ReactComponent as MoonOutlineIcon } from "$/assets/svg/moon-outline.svg";
import { ReactComponent as SunOutlineIcon } from "$/assets/svg/sun-outline.svg";
import { useColorScheme } from "@mui/joy";
import IconButton, { IconButtonProps } from "@mui/joy/IconButton";
import { useEffect, useState } from "react";

const ColorSchemeToggle: React.FC<IconButtonProps> = ({
    onClick,
    ...props
}) => {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <IconButton size="sm" variant="plain" color="neutral" disabled />
        );
    }
    return (
        <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            {...props}
            onClick={(event) => {
                if (mode === "light") {
                    setMode("dark");
                } else {
                    setMode("light");
                }
                onClick?.(event);
            }}
        >
            {mode === "light" ? (
                <MoonOutlineIcon width={20} />
            ) : (
                <SunOutlineIcon width={20} />
            )}
        </IconButton>
    );
};

export default ColorSchemeToggle;
