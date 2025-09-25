import heroImage from '../../assets/group-2.jpg';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';

export default function Hero({ onLearnMore }) {
    const location = useLocation();
    const { user } = useContext(AuthContext);
    return (
        <div className="hero-visual-block" style={{width: '100%', padding: 'none', display: 'flex',
            
        }} >
            {/* decorative background image (positioned & filtered via CSS) */}
            <img src={heroImage} alt="People in a support group" className="hero-bg-img" 
            style={{width: '100%', padding: 'none'}}/>
            {/* full static overlay that covers the whole image (single encompassing layer) */}
            <div className="hero-full-overlay" aria-hidden></div>
            <div className="hero-overlay">
                    <div className="hero-inner" style={{maxWidth:1100, left: 0, color:'white', display:'grid', gap:12}}>
                    <h1 className="hero-heading" style={{fontSize:'2.8rem', fontWeight:800, margin:0}}>Don't go through it alone.</h1>
                    <p className="hero-lead" style={{fontSize:'1.05rem', margin:0, color:'rgba(255,255,255,0.9)'}}>A welcoming community for people navigating mental health challenges — share, learn, and connect with moderated support groups.</p>
                    <div style={{marginTop:12}}>
                                      {!user && (
                                          <Link to="/signup" className="btn btn-primary" style={{marginRight:8}}>Join the community</Link>
                                      )}
                                      {/* If on landing, call the onLearnMore handler to reveal About in-page, otherwise link to /learnmore */}
                                      {onLearnMore && location.pathname === '/' ? (
                                          <button onClick={onLearnMore} className="btn btn-ghost">Learn more</button>
                                      ) : (
                                          <Link to="/learnmore" className="btn btn-ghost">Learn more</Link>
                                      )}
                    </div>
                </div>
            </div>
        </div>
    )
}