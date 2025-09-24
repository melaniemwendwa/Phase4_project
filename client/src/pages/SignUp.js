import React, { useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom/cjs/react-router-dom.min"


export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordLength = 10;

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!emailRegex.test(email)) {
            toast.error("❌ Invalid Email Format");
            return
        }

        if (!passwordLength.test(password.length())) {
            toast.error(`❌ Password must have ${passwordLength} characters`)
        }
    }

    return (
        <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
            <form className="w-full max-w-md">

                <div className="flex items-center justify-center mt-6 gap-8">
                    <Link to='/signin'>
                        <p href="/sign-in" className="w-full px-6 pb-4 font-medium text-center text-gray-500 capitalize border-b">
                            sign in
                        </p>
                    </Link>
                    <Link to='/signup'>
                        <p href="/sign-up" className="w-full px-6 pb-4 font-medium text-center text-gray-800 capitalize border-b-2 border-blue-500">
                            sign up
                        </p>
                    </Link>
                </div>

                <div className="relative flex items-center mt-8">
                    <span className="absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </span>

                    <input onChange={(e) => {
                        setEmail(e.target.value)
                    }
                    }
                        type="text"
                        className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Email" />
                </div>


                <div className="relative flex items-center mt-4">
                    <span className="absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </span>

                    <input onChange={(e) => setPassword(e.target.value)} type="password" className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Password" />
                </div>

                <div className="relative flex items-center mt-4">
                    <span className="absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </span>

                    <input type="password" className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Confirm Password" />
                </div>

                <div className="mt-6">
                    <button onClick={handleSignUp} className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                        Sign Up
                    </button>

                    <div className="mt-6 text-center ">
                        <Link to='/signin'>
                            <p className="text-sm text-blue-500 hover:underline">
                                Already have an account?
                            </p>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}