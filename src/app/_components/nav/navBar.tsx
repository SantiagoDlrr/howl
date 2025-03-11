import NavBarLogged from "./navBarLogged";
import NavBarNotLogged from "./navBarNotLogged";

const NavBar = () => {
    const logged = true;
    return (
        <nav className="fixed w-full flex justify-between items-center p-6 bg-bg">
            {logged ? (
                <NavBarLogged />
            ) : (
                <NavBarNotLogged />
            )}
        </nav>
    )
}

export default NavBar;