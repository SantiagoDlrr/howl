import SignUpCard from "@/app/_components/auth/signupCard";
import LoginCard from "howl/app/_components/auth/loginCard";

interface LoginPageProps {
    searchParams: { mode?: string };
}

const LoginPage = async ({ searchParams }: LoginPageProps) => {
    const params = await searchParams;
    const login = params.mode === "login";

    return (
        <div className="h-screen bg-bg-dark flex flex-row justify-center items-center gap-20">
            {login ? (
                <LoginCard />
            ) : (
                <SignUpCard />
            )}
        </div>
    )
}

export default LoginPage;