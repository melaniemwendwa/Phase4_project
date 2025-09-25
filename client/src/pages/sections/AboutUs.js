import { WhatWeAreAbout, HowItWorks, HearFromOurCommunity } from "../../data/data"

export default function AboutUs() {
    return (
        <div id="about" style={{background: '#f4f1e8', padding:'3rem 0'}}>
            <div style={{maxWidth:1100, margin:'0 auto', display:'grid', gap:24}}>
                <header style={{textAlign:'center'}}>
                    <h2 style={{margin:0, fontSize:'1.6rem', fontWeight:800, color:'var(--text)'}}>What we're about</h2>
                    <p style={{marginTop:8, color:'#6B7280'}}>We bring people together to connect, share, and support one another through moderated group conversations and resources.</p>
                </header>

                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:18}}>
                    {WhatWeAreAbout.map((item, index) => (
                        <div key={index} style={{background:'var(--card-bg)', padding:18, borderRadius:12, boxShadow:'0 6px 20px rgba(0,0,0,0.04)'}}>
                            <h3 style={{margin:0, color:'var(--primary)', fontSize:'1.05rem'}}>{item.title}</h3>
                            <p style={{marginTop:8, color:'var(--text)'}}>{item.description}</p>
                        </div>
                    ))}
                </div>

                <section style={{marginTop:6}}>
                    <h3 style={{margin:0, fontSize:'1.2rem', fontWeight:700}}>How it works</h3>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:12, marginTop:12}}>
                        {HowItWorks.map((h, i) => (
                            <div key={i} style={{background:'var(--card-bg)', padding:16, borderRadius:12}}>
                                <strong style={{color:'var(--primary)'}}>{h.title}</strong>
                                {/* description may be a string or an object of titled points */}
                                {typeof h.description === 'string' ? (
                                    <p style={{marginTop:6, color:'var(--text)'}}>{h.description}</p>
                                ) : (
                                    <div style={{marginTop:8, display:'grid', gap:8}}>
                                        {Object.entries(h.description).map(([k, v]) => (
                                            <div key={k}>
                                                <div style={{fontWeight:700, color:'var(--text)'}}>{k}</div>
                                                <div style={{color:'var(--text)', marginTop:4}}>{v}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{marginTop:6}}>
                    <h3 style={{margin:0, fontSize:'1.2rem', fontWeight:700}}>Hear from our community</h3>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:12, marginTop:12}}>
                        {HearFromOurCommunity.map((t, idx) => (
                            <div key={idx} style={{display:'grid', gap:8}}>
                                {t.quotes && Object.entries(t.quotes).map(([author, quote]) => (
                                    <blockquote key={author} style={{background:'var(--card-bg)', padding:16, borderRadius:12}}>
                                        <p style={{margin:0, color:'var(--text)'}}>{quote}</p>
                                        <small style={{display:'block', marginTop:8, color:'#6B7280'}}>{author}</small>
                                    </blockquote>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}