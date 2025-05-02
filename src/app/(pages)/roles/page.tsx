import RestrictedAccess from "@/app/_components/auth/restrictedAccess";
import { auth } from "@/server/auth";

const Roles = async () => {
    const session = await auth();
    if (!session?.user) {
        return (
            <RestrictedAccess />
        )
    }
    return (
        <div className="h flex flex-col justify-center items-center pt-20">
            hola

            {/* <div className="bg-black w-80 h-2/3"></div> */}
        </div>
    )
}

export default Roles;