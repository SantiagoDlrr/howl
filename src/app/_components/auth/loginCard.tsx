"use client";

import { useState } from "react";
import FormField from "./formField";
import LoginWith from "./loginWith";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../button";

const LoginCard = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            alert("Invalid credentials");
        } else {
            router.push("/dashboard"); // Redirect to a protected page
        }
    };

    return (
        <div className="bg-white w-1/3 p-14 rounded-lg flex flex-col px-20">
            <h1 className="text-center font-normal text-2xl pb-8">
                Login
            </h1>
            <form onSubmit={handleLogin} className="flex flex-col items-center w-full">
                <div className="flex flex-col gap-4 w-full">
                    <FormField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <FormField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="flex flex-col pt-10">

                </div>

                <div className="flex flex-row justify-center pb-10 w-full">
                    <Button label="Login" xl type="submit" />
                </div>

                <LoginWith login />
            </form>
        </div>
    )
}

export default LoginCard;