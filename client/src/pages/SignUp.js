import React, { useContext } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function SignUp() {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const SignupSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Required'),
        username: Yup.string().min(3, 'Too short').max(30, 'Too long').required('Required'),
        password: Yup.string().min(10, 'Password must be at least 10 characters').required('Required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Required')
    });

    const submit = async (values, { setSubmitting }) => {
        try {
            const response = await fetch("http://localhost:5555/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: values.username, email: values.email, password: values.password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Account created successfully!");
                if (setUser && data) {
                    setUser(data);
                    navigate('/dashboard');
                } else {
                    navigate('/signin');
                }
            } else {
                toast.error(data.error || 'Sign up failed');
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
                        <h1 className="auth-title">Create your account</h1>
                        <p className="auth-sub">Start building and joining communities</p>
                    </div>
                </div>

                <Formik
                    initialValues={{ email: '', username: '', password: '', confirmPassword: '' }}
                    validationSchema={SignupSchema}
                    onSubmit={submit}
                >{({ isSubmitting }) => (
                    <Form className="auth-form">
                        <div>
                            <label className="auth-label" htmlFor="email">Email</label>
                            <Field id="email" name="email" type="email" placeholder="Email" className="form-control" />
                            <div style={{color:'#b91c1c', fontSize: '0.9rem'}}><ErrorMessage name="email" /></div>
                        </div>

                        <div>
                            <label className="auth-label" htmlFor="username">Username</label>
                            <Field id="username" name="username" type="text" placeholder="Pick a username" className="form-control" />
                            <div style={{color:'#b91c1c', fontSize: '0.9rem'}}><ErrorMessage name="username" /></div>
                        </div>

                        <div>
                            <label className="auth-label" htmlFor="password">Password</label>
                            <Field id="password" name="password" type="password" placeholder="Create a password" className="form-control" />
                            <div style={{color:'#b91c1c', fontSize: '0.9rem'}}><ErrorMessage name="password" /></div>
                        </div>

                        <div>
                            <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
                            <Field id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm password" className="form-control" />
                            <div style={{color:'#b91c1c', fontSize: '0.9rem'}}><ErrorMessage name="confirmPassword" /></div>
                        </div>

                        <div>
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{width:'100%'}}>
                                {isSubmitting ? 'Creating...' : 'Create account'}
                            </button>
                            <div className="auth-footer"><Link to='/signin' style={{color: 'var(--primary)'}}>Already have an account?</Link></div>
                        </div>
                    </Form>
                )}
                </Formik>
            </div>
        </main>
    );
}
