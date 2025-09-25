export default function Footer() {
    return (
    <footer className="site-footer">
            <div style={{maxWidth:1100, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div style={{display:'flex', alignItems:'center', gap:12}}>
                    <img src={`${process.env.PUBLIC_URL || ''}/favico.svg`} alt="logo" style={{width:40, height:40}} />
                    <div style={{fontWeight:700, color:'var(--text)'}}>OpenCircle</div>
                </div>
                <div style={{color:'#6B7280'}}>© {new Date().getFullYear()} OpenCircle — Peer Support for Mental Health</div>
            </div>
        </footer>
    )
}