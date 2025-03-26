"use client";

import { useState } from "react";
import FormField from "./formField";
import LoginWith from "./loginWith";
import ToggleButton from "./toggleButton";
import { api } from "howl/trpc/react";
import Button from "../button";

const SignUpCard = () => {
    const [selected, setSelected] = useState(1);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const registerMutation = api.register.register.useMutation({
        onSuccess: () => {
            alert("Registration successful! You can now log in.");
        },
        onError: (error) => {
            alert(error.message);
        },
    });

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        registerMutation.mutate({ name, email, password });
    };

    return (
        <div className="bg-white w-1/3 p-8 rounded-lg flex flex-col px-20">
            <h1 className="text-center font-normal text-2xl pb-6">
                Registro
            </h1>

            <div className="bg-bg-dark w-full flex flex-row items-center rounded-md p-1 mb-4">
                <ToggleButton id={1} selected={selected === 1} setSelected={setSelected} />
                <ToggleButton id={2} selected={selected === 2} setSelected={setSelected} />
            </div>
            <form onSubmit={handleRegister} className="flex flex-col items-center w-full">
                <div className="flex flex-col gap-2 w-full pb-10">
                    <FormField label="Name" xl type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    <FormField label="Email" xl type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <FormField label="Password" xl type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="flex flex-row justify-center pb-10 w-full">
                    <Button label="Login" xl type="submit" />
                </div>
                <LoginWith />
            </form>
        </div>
    )
}

export default SignUpCard;