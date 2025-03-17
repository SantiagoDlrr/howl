"use client";
import { useState } from "react";
import NavElement from "./navElement";
import { routes } from "howl/app/utils/routes";
import LogoElement from "./logoElement";

const NavBar = () => {
    const logged = true;
    const [selected, setSelected] = useState(0);
    return (
        <nav className="fixed w-full flex justify-between items-center p-6 bg-bg">
            {logged ? (
                <div className="w-full flex justify-between items-center bg-bg">
                   <LogoElement /> 
                    <div className="flex flex-row gap-6">
                        {routes.map((route, index) => (
                            <NavElement id={route.id} key={index} href={route.href} label={route.label} isSelected={route.id === selected} setSelected={setSelected} />
                        ))}
                    </div>

                    <div className="h-8 w-8 rounded-full ">
                    </div>
                </div>
            ) : (
                <LogoElement />
            )}
        </nav>
    )
}

export default NavBar;