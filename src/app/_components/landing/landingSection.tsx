import Button from "../button";
import Wave from "./wave";

const LandingSection = () => {

    return (
        <div className="flex flex-row justify-between w-full px-20">
            <div className="flex w-1/2 min-h-screen flex-col items-start justify-center">
                <h1 className="text-5xl font-bold">
                    Análisis de <span className="text-primary">llamadas</span>
                </h1>
                <p className="text-lg py-3">
                    Empoderando empresas mediante el servicio al cliente.
                </p>

                <div className="flex flex-row gap-6 pt-7">
                    <Button label="Login" href="/auth?mode=login" />
                    <Button label="Registro" secondary href="/auth?mode=signup" />
                </div>
            </div>
            <Wave />
        </div>
    )
}

export default LandingSection;