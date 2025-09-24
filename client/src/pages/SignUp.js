import React, { useState } from "react"
import { Link } from "react-router-dom";

export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")

    const handleSignUp = (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please fill all fields');
            return;
        }
        if (password !== confirm) {
            alert('Passwords do not match');
            return;
        }
        // placeholder: submit sign up request
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                        <div className="auth-brand">
                            <img src="/favico.svg" alt="logo" style={{width:40, height:40}} />
                    <div style={{marginLeft:10}}>
                        <div style={{fontWeight:700}}>Support Groups</div>
                        <div style={{fontSize:12, color:'var(--titles)'}}>Join our community</div>
                    </div>
                </div>

                <h1 className="auth-title">Create an account</h1>
                <p className="auth-sub">Sign up to participate in groups and access community resources.</p>

                <form className="auth-form" onSubmit={handleSignUp}>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="form-control" required />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="form-control" required />
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm password" className="form-control" required />

                    <button type="submit" className="btn btn-primary" style={{width:'100%'}}>Create account</button>
                </form>

                <div className="auth-footer">
                    <p style={{margin:0}}>Already have an account? <Link to="/signin" style={{color:'var(--titles)', fontWeight:700}}>Sign in</Link></p>
                </div>
            </div>
        </main>
    )
}