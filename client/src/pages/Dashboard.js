export default function Dashboard() {
    return (
        <div style={{minHeight:'80vh', padding:'3rem', background:'var(--bg)'}}>
            <div style={{maxWidth:1100, margin:'0 auto', background:'var(--card-bg)', padding:'2rem', borderRadius:12}}>
                <h1 style={{fontSize:'1.6rem', fontWeight:700, color:'var(--text)'}}>Dashboard</h1>
                <p style={{color:'#6B7280'}}>Your activity and groups will show here.</p>
            </div>
        </div>
    )
}