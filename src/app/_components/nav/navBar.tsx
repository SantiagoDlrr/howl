"use client";

import { useState } from "react";
import NavElement from "./navElement";
import { routes } from "howl/app/utils/routes";
import LogoElement from "./logoElement";
import { useSession } from "next-auth/react";
import Image from "next/image";
import NavDropdown from "./navDropDown";

const NavBar = () => {
    const [selected, setSelected] = useState(0);
    const { data: session, status } = useSession();
    const logged = status === "authenticated";

    return (
        <nav className="fixed w-full flex justify-between items-center pl-6 pr-8 py-2 bg-bg">
            {logged ? (
                <div className="w-full flex justify-between items-center ">
                    <LogoElement />
                    <div className="flex flex-row gap-6">
                        {routes.map((route, index) => (
                            <NavElement id={route.id} key={index} href={route.href} label={route.label} isSelected={route.id === selected} setSelected={setSelected} />
                        ))}
                    </div>
                    <NavDropdown session={session} />
                </div>
            ) : (
                <LogoElement />
            )}
        </nav>
    )
}

export default NavBar;