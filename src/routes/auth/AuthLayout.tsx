import { supabase } from "$/api/supabase";
import ColorSchemeToggle from "$/components/ColorThemeToggle";
import { Divider } from "@mui/joy";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel, { formLabelClasses } from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import type { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import React, { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

interface FormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
    persistent: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

type AuthLayoutProps = {
    /**
     * If true, it is the sign up page
     */
    signupPage?: boolean;
};

const AuthLayout: React.FC<AuthLayoutProps> = (props) => {
    const { signupPage } = props;
    const { pathname } = useLocation();

    const formRef = useRef<HTMLFormElement | null>(null);
    const [loading, setLoading] = useState(false);
    const text = getText(props);

    // Reset the form if changing pages
    useEffect(() => {
        if (formRef.current) {
            formRef.current.reset();
        }
    }, [pathname]);

    const handleFormSubmit = async (values: SignUpWithPasswordCredentials) => {
        setLoading(true);

        if (signupPage) {
            await handleSignup(values);
        } else {
            await handleLogin(values);
        }

        setLoading(false);
    };

    const handleLogin = async (values: SignUpWithPasswordCredentials) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword(
                values
            );

            if (error) {
                console.log({ err1: error });
                throw Error;
            }

            console.log({ data });
        } catch (err) {
            console.log({ err2: err });
        }
    };

    const handleSignup = async (values: SignUpWithPasswordCredentials) => {
        try {
            const { data, error } = await supabase.auth.signUp(values);

            if (error) {
                console.log({ err1: error });
                throw Error;
            }

            console.log({ data });
        } catch (err) {
            console.log({ err2: err });
        }
    };

    return (
        <React.Fragment>
            <Box
                sx={(theme) => ({
                    width: "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)",
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                    backdropFilter: "blur(4px)",
                    backgroundColor: "rgba(255 255 255 / 0.6)",
                    [theme.getColorSchemeSelector("dark")]: {
                        backgroundColor: "rgba(19 19 24 / 0.4)",
                    },
                })}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "100dvh",
                        width: "clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)",
                        maxWidth: "100%",
                        px: 2,
                    }}
                >
                    <Box
                        component="header"
                        sx={{
                            py: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography
                            fontWeight="lg"
                            startDecorator={
                                <Box
                                    component="span"
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        background: (theme) =>
                                            `linear-gradient(45deg, ${theme.vars.palette.primary.solidBg}, ${theme.vars.palette.primary.solidBg} 30%, ${theme.vars.palette.primary.softBg})`,
                                        borderRadius: "50%",
                                        boxShadow: (theme) => theme.shadow.md,
                                        "--joy-shadowChannel": (theme) =>
                                            theme.vars.palette.primary
                                                .mainChannel,
                                    }}
                                />
                            }
                        >
                            Logo
                        </Typography>
                        <ColorSchemeToggle />
                    </Box>
                    <Box
                        component="main"
                        sx={{
                            my: "auto",
                            py: 2,
                            pb: 5,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            width: 400,
                            maxWidth: "100%",
                            mx: "auto",
                            borderRadius: "sm",
                            "& form": {
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            },
                            [`& .${formLabelClasses.asterisk}`]: {
                                visibility: "hidden",
                            },
                        }}
                    >
                        <div>
                            <Typography
                                component="h2"
                                fontSize="xl2"
                                fontWeight="lg"
                            >
                                {text.title}
                            </Typography>
                        </div>
                        <form
                            ref={formRef}
                            onSubmit={(
                                event: React.FormEvent<SignInFormElement>
                            ) => {
                                event.preventDefault();
                                const formElements =
                                    event.currentTarget.elements;
                                const values = {
                                    email: formElements.email.value,
                                    password: formElements.password.value,
                                };
                                handleFormSubmit(values);
                            }}
                        >
                            <FormControl required>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    placeholder="Enter your email"
                                    type="email"
                                    name="email"
                                />
                            </FormControl>
                            <FormControl required>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    placeholder="•••••••"
                                    type="password"
                                    name="password"
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                fullWidth
                                sx={{ mt: 1.5 }}
                                loading={loading}
                            >
                                {text.signButton}
                            </Button>
                        </form>
                        {/* <Button
                            variant="outlined"
                            color="neutral"
                            fullWidth
                            startDecorator={<GoogleIcon />}
                        >
                            {text.googleButton}
                        </Button> */}

                        <Divider sx={{ mt: 1.5, mb: 1 }} />

                        <Typography level="body2" textAlign="center">
                            {text.redirectText}
                            <Link component={RouterLink} to={text.redirectLink}>
                                {text.redirectLinkText}
                            </Link>
                        </Typography>
                    </Box>
                    <Box component="footer" sx={{ py: 3 }}>
                        <Typography level="body3" textAlign="center">
                            © Your company {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={(theme) => ({
                    height: "100%",
                    position: "fixed",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    left: "clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))",
                    backgroundColor: "background.level1",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundImage:
                        "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8)",
                    [theme.getColorSchemeSelector("dark")]: {
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831)",
                    },
                })}
            />
        </React.Fragment>
    );
};

const getText = ({ signupPage }: AuthLayoutProps) => {
    return {
        title: signupPage ? "Register" : "Welcome back",
        redirectText: signupPage
            ? "Already have an account? "
            : "Don't have an account? ",
        redirectLink: signupPage ? "/auth/login" : "/auth/signup",
        redirectLinkText: signupPage ? "Go to login" : "Sign up",
        signButton: signupPage ? "Sign up" : "Log in",
        googleButton: signupPage ? "Sign up with Google" : "Log in with Google",
    };
};

export default AuthLayout;
