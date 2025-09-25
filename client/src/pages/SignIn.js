import toast from "react-hot-toast";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthProvider';

export default function SignIn() {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        // Frontend validation
        if (!email || !password) {
            toast.error("Please enter both email and password");
            return;
        }

        // API call to the backend
        try {
            const response = await fetch("http://localhost:5555/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Sign-in successful!");
                // Persist logged-in user for later API calls (e.g., joining groups)
                try {
                    // update global auth context (also persists using auth helper)
                    if (setUser) setUser(data);
                } catch (_) {}
                navigate("/dashboard"); // Redirect to dashboard on success
            } else {
                // Read the specific error message from the backend
                toast.error(`${data.error}`);
            }
        } catch (error) {
            console.error("Error during sign-in:", error);
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    return (<section className="bg-white">
        <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
            <form className="w-full max-w-md">
                <h1 className="mt-3 text-2xl font-semibold text-gray-800 capitalize sm:text-3xl">sign In</h1>

                <div className="relative flex items-center mt-8">
                    <span className="absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </span>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        placeholder="Email address"
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

                <div className="mt-6">
                    <button onClick={handleLogin} className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                        Sign in
                    </button>
                    <div className="mt-6 text-center ">
                        <Link to="/signup">
                            <p className="text-sm text-blue-500 hover:underline">
                                Don’t have an account yet? Sign up
                            </p>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    </section>)
}
