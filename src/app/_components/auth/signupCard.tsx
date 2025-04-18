"use client";

import { useState } from "react";
import FormField from "./formField";
import LoginWith from "./loginWith";
import { api } from "howl/trpc/react";
import Button from "../button";
import { emailSchema, passwordSchema } from "howl/app/utils/schemas";
import ErrorMessage from "./errorMessage";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SignUpCard = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    
    const registerMutation = api.register.register.useMutation({
        onSuccess: () => {
            toast.success("Registro exitoso");
            router.push("/main");
        },
        onError: (error) => {
            setError(error.message);
            toast.error("Error al registrar");
        },
    });

    const resetValues = () => {
        setName("");
        setEmail("");
        setPassword("");
        setError("");
    }

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (validName() && validEmail() && validPassword()) {
            registerMutation.mutate({ name, email, password });
            resetValues();
        }
    };

    const validEmail = () => {
        if (email === "") {
            setError("Email vacío")
            return false
        }
        const result = emailSchema.safeParse(email);

        if (result.success) {
            return true;
        } else {
            const errorMessage = result.error.errors
                .map((error) => error.message)
                .join(". ");

            setError(errorMessage)
        }
    }

    const validPassword = () => {
        const result = passwordSchema.safeParse(password);

        if (result.success) {
            return true
        } else {
            const errorMessage = result.error.errors[0]?.message ?? "An unknown error occurred";
            setError(errorMessage);
        }
    }

    const validName = () => {
        if (name === "") {
            setError("Nombre vacío")
            return false
        }
        if (name.length < 3) {
            setError("Nombre muy corto")
            return false
        }
        if (name.length > 50) {
            setError("Nombre muy largo")
            return false
        }
        return true
    }

    return (
        <div className="bg-white w-1/3 p-8 rounded-lg flex flex-col px-20">
            <h1 className="text-center font-normal text-2xl pb-6">
                Registro
            </h1>

            {/* <div className="bg-bg-dark w-full flex flex-row items-center rounded-md p-1 mb-4">
                <ToggleButton id={1} selected={selected === 1} setSelected={setSelected} />
                <ToggleButton id={2} selected={selected === 2} setSelected={setSelected} />
            </div> */}
            <form onSubmit={handleRegister} className="flex flex-col items-center w-full">
                {error && <ErrorMessage message={error} />}
                <div className="flex flex-col gap-2 w-full pb-10">
                    <FormField label="Name" xl type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    <FormField label="Email" xl type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <FormField label="Password" xl type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="flex flex-row justify-center pb-10 w-full">
                    <Button label="Registrar" xl type="submit" />
                </div>
                <LoginWith />
            </form>
        </div>
    )
}

export default SignUpCard;