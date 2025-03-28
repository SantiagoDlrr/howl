"use client";

import { useState } from "react";
import FormField from "./formField";
import LoginWith from "./loginWith";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../button";
import { emailSchema, passwordSchema } from "howl/app/utils/schemas";
import toast from "react-hot-toast";

const LoginCard = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [error, setError] = useState("");

    const resetValues = () => {
        setEmail("");
        setPassword("");
        setError("");
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            console.log(res);
            setError("Usuario o contraseña incorrectos");

        } else {
            console.log("success", res);
            resetValues()
            toast.success("Login successful");
            // router.push("/dashboard");
        }
    };


    return (
        <div className="bg-white w-1/3 p-14 rounded-lg flex flex-col px-20">
            <h1 className="text-center font-normal text-2xl pb-8">
                Login
            </h1>
            <form onSubmit={handleLogin} className="flex flex-col items-center w-full">
                {error && <p className="w-full mb-6  rounded-sm border-red-500 bg-red-200  px-2 py-1 text-red-500">{error}</p>}
                <div className="flex flex-col gap-4 w-full">
                    <FormField type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
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