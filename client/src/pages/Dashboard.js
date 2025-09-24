import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        const user = stored ? JSON.parse(stored) : null;
        if (!user?.id) {
            navigate('/signin');
            return;
        }
        fetch(`http://localhost:5555/users/${user.id}/groups`)
            .then(res => res.json())
            .then(setGroups)
            .catch(() => setGroups([]))
            .finally(() => setLoading(false));
    }, [navigate]);

    return (
        <div style={{minHeight:'80vh', padding:'3rem', background:'var(--bg)'}}>
            <div style={{maxWidth:1100, margin:'0 auto', background:'var(--card-bg)', padding:'2rem', borderRadius:12}}>
                <h1 style={{fontSize:'1.6rem', fontWeight:700, color:'var(--text)'}}>Dashboard</h1>
                <div style={{marginTop:'1rem'}}>
                    <h2 style={{fontSize:'1.2rem', fontWeight:700}}>Your groups</h2>
                    {loading ? (
                        <p style={{color:'#6B7280'}}>Loading…</p>
                    ) : groups.length === 0 ? (
                        <p style={{color:'#6B7280'}}>You haven't joined any groups yet.</p>
                    ) : (
                        <ul style={{listStyle:'none', padding:0, marginTop:'0.75rem', display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'16px'}}>
                            {groups.map(g => (
                                <li key={g.id} style={{border:'1px solid #e5e7eb', borderRadius:14, background:'#fff', overflow:'hidden', transition:'box-shadow 180ms ease, transform 180ms ease'}}>
                                    <Link to={`/groups/${g.id}`} style={{textDecoration:'none', color:'inherit', display:'block'}}>
                                        <div style={{display:'flex', alignItems:'center', gap:12, padding:'14px 14px 10px 14px'}}>
                                            <div style={{width:44, height:44, borderRadius:'999px', display:'grid', placeItems:'center', fontWeight:700, color:'#fff', background:'var(--primary)'}}>
                                                {(g.topic || '').split(' ').slice(0,2).map(w=>w[0]).join('')}
                                            </div>
                                            <div style={{flex:1, minWidth:0}}>
                                                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8}}>
                                                    <div style={{fontWeight:700, fontSize:'1.02rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{g.topic}</div>
                                                    <span style={{background:'#F3F4F6', color:'#374151', fontSize:'0.78rem', padding:'4px 8px', borderRadius:999, whiteSpace:'nowrap'}}>
                                                        {(g.member_count ?? 0)} members
                                                    </span>
                                                </div>
                                                <div style={{color:'#6B7280', fontSize:'0.92rem', marginTop:4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden'}}>{g.description}</div>
                                            </div>
                                        </div>
                                        {g.meeting_times ? (
                                            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px 14px 14px', borderTop:'1px solid #f3f4f6'}}>
                                                <div style={{color:'#6B7280', fontSize:'0.85rem'}}>{g.meeting_times}</div>
                                                <div style={{fontWeight:600, fontSize:'0.88rem', color:'var(--primary)'}}>View group →</div>
                                            </div>
                                        ) : (
                                            <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end', padding:'10px 14px 14px 14px', borderTop:'1px solid #f3f4f6'}}>
                                                <div style={{fontWeight:600, fontSize:'0.88rem', color:'var(--primary)'}}>View group →</div>
                                            </div>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}