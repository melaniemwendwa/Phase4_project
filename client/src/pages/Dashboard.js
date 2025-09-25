import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { fetchUserGroups } from '../api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [groups, setGroups] = useState([]);

    function getInitials(text) {
        const t = (text || '').trim();
        if (!t) return '?';
        const parts = t.split(/\s+/).slice(0, 2);
        return parts.map(p => p[0]).join('').toUpperCase();
    }

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        setError('');
        fetchUserGroups(user.id)
            .then(setGroups)
            .catch(() => setError('Failed to load your groups'))
            .finally(() => setLoading(false));
    }, [user]);

    return (
        <div style={{minHeight:'80vh', padding:'3rem', background:'var(--bg)'}}>
            <div style={{maxWidth:1100, margin:'0 auto', background:'var(--card-bg)', padding:'2rem', borderRadius:12}}>
                <h1 style={{fontSize:'1.6rem', fontWeight:700, color:'var(--text)'}}>Dashboard</h1>
                <p style={{color:'#6B7280'}}>Your activity and groups will show here.</p>

                {error ? <div style={{color:'#ef4444', marginTop:12}}>{error}</div> : null}

                {/* Live promo removed */}

                <div style={{marginTop:24}}>
                    <h2 style={{fontSize:'1.2rem', fontWeight:700, color:'var(--text)'}}>Your Groups</h2>
                    {!user ? (
                        <div style={{color:'#6B7280'}}>Sign in to see groups you have joined.</div>
                    ) : loading ? (
                        <div className="muted">Loading your groups...</div>
                    ) : groups.length === 0 ? (
                        <div className="muted">You haven't joined any groups yet.</div>
                    ) : (
                        <ul style={{
                            listStyle:'none',
                            padding:0,
                            marginTop:16,
                            display:'grid',
                            gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
                            gap:16
                        }}>
                            {groups.map(g => (
                                <li key={g.id} style={{
                                    background:'var(--card-bg)',
                                    borderRadius:14,
                                    padding:16,
                                    border:'1px solid var(--border)',
                                    boxShadow:'0 8px 24px rgba(0,0,0,0.05)',
                                    display:'flex',
                                    flexDirection:'column',
                                    gap:10
                                }}>
                                    <div style={{display:'flex', alignItems:'center', gap:12}}>
                                        <div style={{
                                            width:44,
                                            height:44,
                                            borderRadius:'50%',
                                            display:'flex',
                                            alignItems:'center',
                                            justifyContent:'center',
                                            fontWeight:700,
                                            color:'var(--background)',
                                            background:'linear-gradient(135deg, #7B9B8C, #A8C5B6)'
                                        }}>{getInitials(g.topic)}</div>
                                        <div style={{flex:1, minWidth:0}}>
                                            <div style={{fontWeight:700, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{g.topic}</div>
                                            <div style={{color:'#6B7280', fontSize:'0.92rem', marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{g.meeting_times || 'Meets weekly'}</div>
                                        </div>
                                        <div style={{
                                            fontSize:'0.78rem',
                                            background:'#F3F4F6',
                                            color:'#374151',
                                            padding:'4px 10px',
                                            borderRadius:999,
                                            border:'1px solid #E5E7EB'
                                        }}>{g.member_count ?? 0} members</div>
                                    </div>
                                    <div style={{color:'#4B5563', fontSize:'0.95rem', lineHeight:1.5, marginTop:4}}>
                                        {g.description}
                                    </div>
                                    <div style={{display:'flex', justifyContent:'flex-end', marginTop:6}}>
                                        <Link
                                            to={`/groups/${g.id}`}
                                            className="btn btn-primary"
                                            style={{
                                                padding:'0.5em 1em',
                                                borderRadius:999,
                                                fontWeight:600
                                            }}
                                        >
                                            View group
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}