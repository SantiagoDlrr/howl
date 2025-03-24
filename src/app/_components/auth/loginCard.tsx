import Button from "../button";
import FormField from "./formField";

const LoginCard = () => {
    return (
        <div className="bg-white w-1/2 p-14 rounded-lg flex flex-col">
            <h1 className="text-center font-normal text-2xl pb-8">
                Login
            </h1>
            <div className="flex flex-col items-center">
                <div className="flex flex-col gap-4">
                    <FormField label="Email" />
                    <FormField label="Password" />
                </div>
                <div className="flex flex-col pt-10">
                    <div className="flex flex-row justify-center">
                        <Button label="Login" />
                    </div>
                    <div className="text-text-light pt-4">
                        Nuevo a HowlX? <span className="text-primary-light"> Regístrate</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default LoginCard;