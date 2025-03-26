"use client";

import { useState } from "react";
import FormField from "./formField";
import LoginWith from "./loginWith";
import ToggleButton from "./toggleButton";

const SignUpCard = () => {
    const [selected, setSelected] = useState(1);

    return (
        <div className="bg-white w-1/3 p-8 rounded-lg flex flex-col px-20">
            <h1 className="text-center font-normal text-2xl pb-6">
                Registro
            </h1>

            <div className="bg-bg-dark w-full flex flex-row items-center rounded-md p-1 mb-4">
                <ToggleButton id={1} selected={selected === 1} setSelected={setSelected} />
                <ToggleButton id={2} selected={selected === 2} setSelected={setSelected} />
            </div>
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col gap-2 w-full pb-10">
                    <FormField label="Name" xl />
                    <FormField label="Email" xl />
                    <FormField label="Password" xl />
                </div>

                <LoginWith />
            </div>
        </div>
    )
}

export default SignUpCard;