import { NavLinks } from "../data/data";
import { NavLink } from "react-router-dom";
import { useState } from "react";
// logo.svg is served from the public/ folder — reference it by URL at runtime

export default function NavBar() {
    const [open, setOpen] = useState(false);
    return (
        <header className="site-header">
            <div className="nav-inner">
                <NavLink to="/" className="site-logo">
                    <img src={`${process.env.PUBLIC_URL || ''}/logo.svg`} alt="OpenCircle" 
                    style={{width: '150px', height: 'auto'}}/>
                </NavLink>

                <div style={{display:'flex', alignItems:'center', gap:12}}>
                    <div className="nav-links">
                        {Object.entries(NavLinks).map(([key, value]) => (
                            <NavLink key={key} to={value} className={({isActive})=> isActive ? 'active' : ''}>{key}</NavLink>
                        ))}
                    </div>

                    <div className="nav-cta">
                        <NavLink to="/groups"><button className="btn btn-primary">Join the community</button></NavLink>
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