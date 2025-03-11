import Link from "next/link";

const NavBarNotLogged = () => {
    return (
        <div className="flex items-center text-white">
            <Link href="/login" className="text-white mx-2">Login</Link>
            <Link href="/register" className="text-white mx-2">Register</Link>
        </div>
    )
}

export default NavBarNotLogged;