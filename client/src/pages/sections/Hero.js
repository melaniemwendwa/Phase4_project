import heroImage from '../../assets/group-2.jpg';
import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <div className="hero-visual-block">
            {/* decorative background image (positioned & filtered via CSS) */}
            <img src={heroImage} alt="People in a support group" className="hero-bg-img" />
            {/* full static overlay that covers the whole image (single encompassing layer) */}
            <div className="hero-full-overlay" aria-hidden></div>
            <div className="hero-overlay">
                    <div className="hero-inner" style={{maxWidth:1100, left: 0, color:'white', display:'grid', gap:12}}>
                    <h1 className="hero-heading" style={{fontSize:'2.8rem', fontWeight:800, margin:0}}>Don't go through it alone.</h1>
                    <p className="hero-lead" style={{fontSize:'1.05rem', margin:0, color:'rgba(255,255,255,0.9)'}}>A welcoming community for people navigating mental health challenges — share, learn, and connect with moderated support groups.</p>
                    <div style={{marginTop:12}}>
                      <Link to="/groups" className="btn btn-primary" style={{marginRight:8}}>Join the community</Link>
                      <Link to="/about" className="btn btn-ghost">Learn more</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}