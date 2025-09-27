import toast from "react-hot-toast";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthProvider';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BASE_URL } from '../apiBase';

export default function SignIn() {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().required('Required')
    });

    const submit = async (values, { setSubmitting }) => {
        try {
            const response = await fetch(`${BASE_URL}/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: values.email, password: values.password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Sign-in successful!");
                if (setUser) setUser(data);
                navigate('/dashboard');
            } else {
                toast.error(data.error || 'Sign-in failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('An unexpected error occurred');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <img src="/favico.svg" alt="App logo" className="auth-logo" />
                    <div>
                        <h1 className="auth-title">Sign in</h1>
                        <p className="auth-sub">Sign in to your account</p>
                    </div>
                </div>

                <Formik initialValues={{ email: '', password: '', remember: false }} validationSchema={LoginSchema} onSubmit={submit}>
                    {({ isSubmitting }) => (
                        <Form className="auth-form">
                            <div>
                                <label className="auth-label" htmlFor="email">Email</label>
                                <Field id="email" name="email" type="email" placeholder="Email address" className="form-control" />
                                <div style={{color:'#b91c1c', fontSize: '0.9rem'}}><ErrorMessage name="email" /></div>
                            </div>

                            <div>
                                <label className="auth-label" htmlFor="password">Password</label>
                                <Field id="password" name="password" type="password" placeholder="Password" className="form-control" />
                                <div style={{color:'#b91c1c', fontSize: '0.9rem'}}><ErrorMessage name="password" /></div>
                            </div>

                            <div>
                                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{width:'100%'}}>
                                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                                </button>
                                <div className="auth-row" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8}}>
                                    <label style={{display:'flex', alignItems:'center', gap:8, color:'#6B7280'}}>
                                        <Field type="checkbox" name="remember" style={{width:16, height:16}} />
                                        <span style={{fontSize:'0.95rem'}}>Keep me signed in</span>
                                    </label>
                                    <div style={{fontSize:'0.95rem'}}><Link to="/signup" style={{color: 'var(--primary)'}}>Create account</Link></div>
                                </div>
                                <div className="auth-footer"><Link to="/signup" style={{color: 'var(--primary)'}}>Don’t have an account yet? Sign up</Link></div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </main>
    )
}
