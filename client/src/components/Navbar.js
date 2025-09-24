import { NavLinks } from "../data/data"
import { Link } from "react-router-dom/cjs/react-router-dom.min"

export default function NavBar() {


    return (

        <div className="flex justify-between items-center px-60 py-6 bg-neutral-50">
            <div>
                <p className="text-neutral-600 text-xl font-bold">Open<span className="text-blue-500">Circle</span></p>
            </div>
            <div>
                <ul className="list-none flex gap-8">
                    {Object.entries(NavLinks).map(([key, value], index) => (
                        <li key={index} className="text-neutral-600">
                            <Link to={value}>
                                <button className="hover:text-blue-500">
                                    {key}
                                </button>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <Link to="/signup">
                    <button className="bg-blue-400 text-neutral-50 px-8 py-2 rounded-full">Sign Up</button>
                </Link>
            </div>
        </div>

    )
}