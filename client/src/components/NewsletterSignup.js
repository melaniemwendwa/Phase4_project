import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function NewsletterSignup() {
  const [done, setDone] = useState(false);

  return (
    <section className="newsletter" style={{marginTop:24}}>
      <div className="container" style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:18, alignItems:'center'}}>
        <div>
          <h3 style={{margin:0, fontSize:'1.15rem', fontWeight:700}}>Stay in the loop</h3>
          <p style={{margin:'6px 0 0', color:'#6B7280'}}>Get updates about new groups, events, and resources — delivered with care.</p>
        </div>
        <div>
          {!done ? (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={Yup.object().shape({ email: Yup.string().email('Invalid email').required('Email required') })}
              onSubmit={(values, { setSubmitting }) => {
                // Placeholder: integrate with backend subscription
                setDone(true);
                setSubmitting(false);
              }}
            >{({ isSubmitting }) => (
              <Form style={{display:'flex', gap:8}}>
                <Field name="email" className="form-control" placeholder="Your email" />
                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>Subscribe</button>
                <div style={{color:'#b91c1c', fontSize:'0.85rem'}}><ErrorMessage name="email" /></div>
              </Form>
            )}</Formik>
          ) : (
            <div style={{background:'var(--card-bg)', padding:12, borderRadius:8}}>Thanks — we'll keep you updated.</div>
          )}
        </div>
      </div>
    </section>
  )
}
