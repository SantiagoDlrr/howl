"use client";

import { useState } from "react";
import NavElement from "./navElement";
import { routes } from "howl/app/utils/routes";
import LogoElement from "./logoElement";
import { useSession } from "next-auth/react";
import Image from "next/image";

const NavBar = () => {
    const [selected, setSelected] = useState(0);
    const { data: session, status } = useSession();
    const logged = status === "authenticated";

    return (
        <nav className="fixed w-full flex justify-between items-center pl-6 pr-8 pt-3 pb-1 bg-bg position-i">
            {logged ? (
                <div className="w-full flex justify-between items-center ">
                    <LogoElement />
                    <div className="flex flex-row gap-6">
                        {routes.map((route, index) => (
                            <NavElement id={route.id} key={index} href={route.href} label={route.label} isSelected={route.id === selected} setSelected={setSelected} />
                        ))}
                    </div>
                    <div className="flex flex-row items-center">
                        {session.user?.image && (
                            <div>
                                hi
                                <Image src={session.user.image} alt="User Image" width={40} height={40} className="rounded-full" />
                            </div>
                        )}
                        {session?.user?.name}
                    </div>
                </div>
            ) : (
                <LogoElement />
            )}
        </nav>
    )
}

export default NavBar;