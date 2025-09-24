import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // For now just show a thank you — integration with backend can be added later
    setDone(true);
  }

  return (
    <section className="newsletter" style={{marginTop:24}}>
      <div className="container" style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:18, alignItems:'center'}}>
        <div>
          <h3 style={{margin:0, fontSize:'1.15rem', fontWeight:700}}>Stay in the loop</h3>
          <p style={{margin:'6px 0 0', color:'#6B7280'}}>Get updates about new groups, events, and resources — delivered with care.</p>
        </div>
        <div>
          {!done ? (
            <form onSubmit={handleSubmit} style={{display:'flex', gap:8}}>
              <input className="form-control" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} />
              <button className="btn btn-primary" type="submit">Subscribe</button>
            </form>
          ) : (
            <div style={{background:'var(--card-bg)', padding:12, borderRadius:8}}>Thanks — we'll keep you updated.</div>
          )}
        </div>
      </div>
    </section>
  )
}
