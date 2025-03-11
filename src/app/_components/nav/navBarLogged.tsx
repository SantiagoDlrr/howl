"use client";

import { useState } from "react";
import NavElement from "./navElement";
import { routes } from "howl/app/utils/routes";

const NavBarLogged = () => {

    const [selected, setSelected] = useState(0);
    

    return (
        <div className="w-full flex justify-between items-center bg-bg">
            <div className="text-white">
                Howl
            </div>

            <div className="flex flex-row gap-6">
                {routes.map((route, index) => (
                    <NavElement id={route.id} key={index} href={route.href} label={route.label} isSelected={route.id === selected} setSelected={setSelected}/>
                ))}
            </div>

            <div className="h-8 w-8 rounded-full bg-secondary-light">
                {/* Profile Picture */}
            </div>
        </div>
    )
}

export default NavBarLogged;