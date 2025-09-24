import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("⚠️ Please enter both email and password");
            return;
        }
        // placeholder: perform auth request
    };

    return (
        <main className="auth-page">
            <div className="auth-card">
                        <div className="auth-brand">
                            <img src="/favico.svg" alt="logo" style={{width:40, height:40}} />
                    <div style={{marginLeft:10}}>
                        <div style={{fontWeight:700}}>Support Groups</div>
                        <div style={{fontSize:12, color:'var(--titles)'}}>A safe, moderated community</div>
                    </div>
                </div>

                <h1 className="auth-title">Sign in</h1>
                <p className="auth-sub">Sign in to your account to join groups and participate in discussions.</p>

                <form className="auth-form" onSubmit={handleLogin}>
                    <label className="sr-only">Email address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="form-control"
                        required
                    />

                    <label className="sr-only">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="form-control"
                        required
                    />

                    <button type="submit" className="btn btn-primary" style={{width:'100%'}}>Sign in</button>
                </form>

                <div className="auth-footer">
                    <p style={{margin:0}}>Don't have an account? <Link to="/signup" style={{color:'var(--titles)', fontWeight:700}}>Create one</Link></p>
                </div>
            </div>
        </main>
    );
}