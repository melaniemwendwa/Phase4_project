import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordMinLength = 10;

    const handleSignUp = async (e) => {
        e.preventDefault();

        // Frontend validation
        if (!emailRegex.test(email)) {
            toast.error("❌ Invalid Email Format");
            return;
        }

        if (password.length < passwordMinLength) {
            toast.error(`❌ Password must be at least ${passwordMinLength} characters`);
            return;
        }

        if (password !== confirmPassword) {
            toast.error("❌ Passwords do not match");
            return;
        }

        // API call to the backend
        try {
            const response = await fetch("http://localhost:5555/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("✅ Account created successfully!");
                navigate("/signin");
            } else {
                // Read the specific error message from the backend
                toast.error(`❌ ${data.error}`);
            }
        } catch (error) {
            console.error("Error during sign-up:", error);
            toast.error("❌ An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
            <form className="w-full max-w-md">

                <div className="flex items-center justify-center mt-6 gap-8">
                    <Link to='/signin'>
                        <p className="w-full px-6 pb-4 font-medium text-center text-gray-500 capitalize border-b">
                            sign in
                        </p>
                    </Link>
                    <Link to='/signup'>
                        <p className="w-full px-6 pb-4 font-medium text-center text-gray-800 capitalize border-b-2 border-blue-500">
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
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        placeholder="Email"
                        value={email}
                    />
                </div>

                <div className="relative flex items-center mt-4">
                    <span className="absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </span>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        placeholder="Password"
                        value={password}
                    />
                </div>

                <div className="relative flex items-center mt-4">
                    <span className="absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </span>
                    <input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                    />
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
    );
}
