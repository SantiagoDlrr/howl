"use client";

import { useState } from "react";
import NavElement from "./navElement";

const NavBarLogged = () => {

    const [selected, setSelected] = useState(0);
    const routes = [
        {
            id: 0,
            label: "Home",
            href: "/",
            isSelected: true
        },
        {
            id: 1,
            label: "Login",
            href: "/login",
            isSelected: false
        },
        {
            id: 2,
            label: "Test",
            href: "/",
            isSelected: false
        }

    ]

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
                Profile
            </div>
        </div>
    )
}

export default NavBarLogged;