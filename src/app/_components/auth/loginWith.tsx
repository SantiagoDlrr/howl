import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import Button from "../button";

const LoginWith = ({ login }: { login?: boolean }) => {
    const handleSignIn = () => {
        signIn("microsoft-entra-id");
    };

    return (
        <>
            <div className="w-full flex flex-row items-center justify-center gap-2 pt-2 pb-3">
                <div className="w-full border-b "></div>
                <div className="text-nowrap text-center text-gray text-sm">
                    {login ? "O regístrate con" : "O inicia sesión con"}
                </div>
                <div className="w-full border-b "></div>
            </div>

            <div className="flex flex-row justify-center gap-3 w-full">
                <button type="button" onClick={handleSignIn} className="w-full flex flex-row items-center justify-center gap-2 p-1 border border- rounded-md ">
                    <Image src="/images/msoft.png" alt="Microsoft Logo" width={20} height={20} />
                    <div className="text-text-light text-sm">Microsoft</div>
                </button>
                <button type="button" onClick={handleSignIn} className="w-full flex flex-row items-center justify-center gap-2 p-1 border border- rounded-md ">
                    <Image src="/images/google.webp" alt="Microsoft Logo" width={20} height={20} />
                    <div className="text-text-light text-sm">Google</div>
                </button>
            </div>

            <Link href={login ? "/register" : "/login"} className="text-text-light pt-10 text-sm">
                {login ? "Nuevo a HowlX?" : "¿Ya tienes cuenta?"}
                <span className="text-primary-light underline hover:text-primary-extralight pl-2">
                    {login ? "Regístrate" : "Inicia sesión"}
                </span>
            </Link>
        </>
    )
}

export default LoginWith;