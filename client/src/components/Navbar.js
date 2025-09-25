import { NavLinks } from "../data/data";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from '../context/AuthProvider';
// logo.svg is served from the public/ folder — reference it by URL at runtime

export default function NavBar() {
    const [open, setOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, clearUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const profileRef = useRef(null);
        useEffect(() => {
            function handleKey(e) {
                if (e.key === 'Escape') setProfileOpen(false);
            }

            function handleClick(e) {
                if (profileRef.current && !profileRef.current.contains(e.target)) {
                    setProfileOpen(false);
                }
            }

            document.addEventListener('keydown', handleKey);
            document.addEventListener('click', handleClick);
            return () => {
                document.removeEventListener('keydown', handleKey);
                document.removeEventListener('click', handleClick);
            };
        }, []);

        // Guest nav: only logo + join button
        if (!user) {
      return (
        <header className="site-header">
          <div className="nav-inner">
            <NavLink to="/" className="site-logo">
              <img src={`${process.env.PUBLIC_URL || ''}/logo.svg`} alt="OpenCircle" style={{width: '150px', height: 'auto'}}/>
            </NavLink>
            <div style={{display:'flex', alignItems:'center', gap:12}}>
              <NavLink to="/signup"><button className="btn btn-primary">Join the community</button></NavLink>
            </div>
          </div>
        </header>
      );
    }

        return (
        <header className="site-header">
            <div className="nav-inner">
                <NavLink to="/" className="site-logo">
                    <img src={`${process.env.PUBLIC_URL || ''}/logo.svg`} alt="OpenCircle" 
                    style={{width: '150px', height: 'auto'}}/>
                </NavLink>

                <div style={{display:'flex', alignItems:'center', gap:12, justifyContent:'space-between'}}>
                    <div className="nav-links">
                        {/* Signed-in ordering: Dashboard first, then Groups */}
                        <NavLink to={'/dashboard'} className={({isActive})=> isActive ? 'active' : ''}>Dashboard</NavLink>
                        <NavLink to={'/groups'} className={({isActive})=> isActive ? 'active' : ''}>Groups</NavLink>
                    </div>

                    <div className="nav-cta">
                        <div style={{position:'relative'}}>
                            <div ref={profileRef} style={{position:'relative'}} onClick={(e)=>e.stopPropagation()}>
                                <button
                                    className="btn"
                                    onClick={() => setProfileOpen(p => !p)}
                                    aria-expanded={profileOpen}
                                    aria-haspopup="true"
                                    style={{color: 'var(--text)'}}
                                >
                                    {(() => {
                                        // Prefer username, then name, then email local-part, then fallback
                                        if (user?.username) return user.username;
                                        if (user?.name) return user.name;
                                        if (user?.email) return user.email.split('@')[0];
                                        return 'Profile';
                                    })()} ▾
                                </button>

                                {profileOpen && (
                                    <div className="profile-dropdown" onClick={(e)=>e.stopPropagation()} style={{position: 'absolute', right:0, top:'calc(100% + 8px)', borderRadius: 10, boxShadow: '0 8px 24px rgba(2,6,23,0.12)', padding: 0, minWidth: 220, zIndex: 60, overflow: 'hidden'}}>
                                        <div style={{background: 'var(--primary)', color: 'var(--background)', padding: '0.6rem 0.8rem', borderBottom: '1px solid rgba(255,255,255,0.06)'}}>
                                            <div style={{fontWeight:700}}>{user?.username || (user?.email ? user.email.split('@')[0] : 'Profile')}</div>
                                            {user?.email && <div style={{fontSize:12, opacity:0.9}}>{user.email}</div>}
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'column', background: 'var(--card-bg)'}}>
                                            <NavLink to={'/dashboard'} onClick={() => setProfileOpen(false)} style={{padding: '0.6rem 0.9rem', border: 'none', textDecoration: 'none', color: 'var(--text)'}}>Dashboard</NavLink>
                                            <NavLink to={'/groups'} onClick={() => setProfileOpen(false)} style={{padding: '0.6rem 0.9rem', border: 'none', textDecoration: 'none', color: 'var(--text)'}}>Groups</NavLink>
                                            <button style={{textAlign:'left', padding: '0.6rem 0.9rem', border: 'none', background:'transparent', color:'var(--text)', cursor:'pointer'}} onClick={()=>{ setProfileOpen(false); clearUser(); navigate('/signin'); }}>Logout</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button className="hamburger" aria-label="Toggle menu" onClick={()=>setOpen(o=>!o)}>☰</button>
                </div>
            </div>

            {open && (
                <div className="mobile-menu">
                    <div className="links">
                        {Object.entries(NavLinks).map(([key, value]) => (
                            <NavLink key={key} to={value} onClick={()=>setOpen(false)}>{key}</NavLink>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}