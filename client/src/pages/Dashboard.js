export default function Dashboard() {
    return (
        <div style={{minHeight:'80vh', padding:'3rem', background:'var(--bg)'}}>
            <div style={{maxWidth:1100, margin:'0 auto', background:'var(--card-bg)', padding:'2rem', borderRadius:12}}>
                <h1 style={{fontSize:'1.6rem', fontWeight:700, color:'var(--text)'}}>Dashboard</h1>
                <p style={{color:'#6B7280'}}>Your activity and groups will show here.</p>

                <div style={{marginTop:18, padding:12, borderRadius:8, background:'linear-gradient(90deg, rgba(255,0,0,0.06), rgba(255,0,0,0.02))', display:'flex', alignItems:'center', gap:12}}>
                    <div style={{width:12, height:12, background:'red', borderRadius:'50%', boxShadow:'0 0 6px rgba(255,0,0,0.6)'}}></div>
                    <div>
                        <div style={{fontWeight:700, color:'var(--text)'}}>Live: Community group session</div>
                        <div style={{color:'#6B7280', fontSize:'0.9rem'}}>A moderated session is broadcasting now — join to listen and participate.</div>
                    </div>
                    <div style={{marginLeft:'auto'}}>
                        <button className="btn btn-primary">Join Live</button>
                    </div>
                </div>
            </div>
        </div>
    )
}