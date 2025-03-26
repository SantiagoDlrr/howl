import LoginCard from "howl/app/_components/auth/loginCard";

const LoginPage = () => {
    return (
        <div className="h-screen bg-bg-dark flex flex-row justify-center items-center gap-20">
            <LoginCard />
            {/* <div className="bg-black w-80 h-2/3"></div> */}
        </div>
    )
}

export default LoginPage;