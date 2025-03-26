"use client";

import FormField from "./formField";
import LoginWith from "./loginWith";

const LoginCard = () => {

    return (
        <div className="bg-white w-1/3 p-14 rounded-lg flex flex-col px-20">
            <h1 className="text-center font-normal text-2xl pb-8">
                Login
            </h1>
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col gap-4 w-full">
                    <FormField label="Email" />
                    <FormField label="Password" />
                </div>
                <div className="flex flex-col pt-10">

                </div>
                <LoginWith login />
            </div>
        </div>
    )
}

export default LoginCard;