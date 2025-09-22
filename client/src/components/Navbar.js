import { NavLinks } from "../data/data"
import Button from "./assets/Button"
import Hamburger from "./assets/Hamburger"
import Close from "./assets/Close"
import { use, useState } from "react"
import MobileMenu from "./MobileMenu"


export default function NavBar() {
    const [menuActive, setMenuActive] = useState(false)

    return (
        <div className="flex flex-col fixed top-0 w-full z-9999">
            <div className={`px-5 sm:px-20 xl:px-40 2xl:px-80 lg:bg-neutral-50
        ${menuActive === false ? 'bg-neutral-50' : 'bg-blue-950/97'} 
         py-5 sm:py-8 flex items-center justify-between `}>
                <div className="2xl:scale-150">
                </div>
                <div className="hidden lg:flex flex-row items-center gap-x-10 2xl:gap-x-20">
                    <div>
                        <ul className="flex gap-10 2xl:gap-20 2xl:text-xl list-none uppercase">
                            {NavLinks.map((item, index) => (
                                <li key={index}>
                                    <a href="#" className="hover:text-red-400">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <a href="/sign-in">
                            <Button btnClasses="uppercase 2xl:text-2xl" btnLabel="Login" btnColor="bg-red-400" btnBorder="border-red-400" textColorHover="hover:text-red-400" btnBorderHover="hover:border-red-400" />
                        </a>
                    </div>
                </div>
                <button
                    className="lg:hidden"
                    onClick={
                        () => {
                            setMenuActive(menuActive === false ? true : false)
                        }

                    }>
                    {menuActive === false ? <Hamburger /> : <Close />}
                </button>
            </div>
            {menuActive === true ? <MobileMenu /> : null}
        </div >
    )
}