import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { fetchGroups, fetchPosts } from '../api';
import { fetchEvents } from '../apiEvents';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import { BASE_URL } from '../apiBase';

export default function Dashboard() {
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [recent, setRecent] = useState([]);
    const [joinedSet, setJoinedSet] = useState(new Set());

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const g = await fetchGroups();
                if (!mounted) return;
                setGroups(g);

                // fetch events for all groups and produce an upcoming list
                const eventsLists = await Promise.all(g.map(gr => fetchEvents(gr.id)));
                const eventsFlat = eventsLists.flat().map(ev => ({...ev, group_topic: g.find(x=>x.id===ev.group_id)?.topic}));
                eventsFlat.sort((a,b) => new Date(a.start_time) - new Date(b.start_time));
                setUpcoming(eventsFlat.slice(0,5).map(ev=>({ id: ev.id, title: `${ev.group_topic} — ${ev.title}`, time: ev.start_time })));

                // fetch recent posts across groups (combine and sort)
                const postsLists = await Promise.all(g.map(gr => fetchPosts(gr.id)));
                const postsFlat = postsLists.flat();
                postsFlat.sort((a,b) => new Date(b.timestamp || Date.now()) - new Date(a.timestamp || Date.now()));
                setRecent(postsFlat.slice(0,6).map(p => ({ id: p.id, text: p.header || p.body || 'Post', ts: p.timestamp ? new Date(p.timestamp).toLocaleString() : '' })));

                // simple heuristic: mark groups where user is a member by comparing member_count and user
                if (user && g.length) {
                    // We don't have membership list; keep groups the user has joined locally when they RSVP
                    // Initialize joinedSet empty; it will be updated when user clicks RSVP or later when we expose membership API
                    setJoinedSet(new Set());
                }
            } catch (err) {
                console.error('Dashboard load error', err);
            }
        }
        load();
        return () => { mounted = false };
    }, [user]);

    return (
        <main className="page-wrap" style={{background: 'var(--bg)'}}>
            <div style={{width: '100%', maxWidth: 1200, margin: '0 auto'}}>
                <section style={{marginBottom: 18}}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:16}}>
                        <div>
                            <h1 style={{fontSize: '1.6rem', margin:0, fontWeight:800, color:'var(--text)'}}>Welcome{user?.username ? `, ${user.username}` : ''}</h1>
                            <p style={{margin: '6px 0 0 0', color:'var(--titles)'}}>Your activity and groups at a glance.</p>
                        </div>
                    </div>
                </section>

                <section style={{display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap:12, marginBottom:16}}>
                    <div style={{background:'var(--card-bg)', padding:14, borderRadius:12, boxShadow:'0 6px 18px rgba(45,55,72,0.04)'}}>
                        <div style={{fontSize:12, color:'var(--titles)', fontWeight:600}}>Groups</div>
                        <div style={{fontSize:24, fontWeight:800, color:'var(--text)'}}>{groups.length}</div>
                        <div style={{fontSize:12, color:'var(--text)', opacity:0.85}}>Joined groups</div>
                    </div>

                    <div style={{background:'var(--card-bg)', padding:14, borderRadius:12, boxShadow:'0 6px 18px rgba(45,55,72,0.04)'}}>
                        <div style={{fontSize:12, color:'var(--titles)', fontWeight:600}}>Upcoming</div>
                        <div style={{fontSize:24, fontWeight:800, color:'var(--text)'}}>{upcoming.length}</div>
                        <div style={{fontSize:12, color:'var(--text)', opacity:0.85}}>Events & sessions</div>
                    </div>

                    <div style={{background:'var(--card-bg)', padding:14, borderRadius:12, boxShadow:'0 6px 18px rgba(45,55,72,0.04)'}}>
                        <div style={{fontSize:12, color:'var(--titles)', fontWeight:600}}>Activity</div>
                        <div style={{fontSize:24, fontWeight:800, color:'var(--text)'}}>{recent.length}</div>
                        <div style={{fontSize:12, color:'var(--text)', opacity:0.85}}>Recent interactions</div>
                    </div>
                </section>

                <section style={{display:'grid', gridTemplateColumns: '2fr 1fr', gap:12}}>
                    <div style={{background:'var(--card-bg)', padding:16, borderRadius:12, boxShadow:'0 6px 18px rgba(45,55,72,0.04)'}}>
                        <h2 style={{margin:0, fontSize:16, fontWeight:700, color:'var(--text)'}}>Feed & Recent Activity</h2>
                        <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:10}}>
                            {recent.map(item => (
                                <div key={item.id} style={{padding:10, borderRadius:8, background:'rgba(44,44,52,0.02)'}}>
                                    <div style={{fontSize:14, color:'var(--text)', fontWeight:600}}>{item.text}</div>
                                    <div style={{fontSize:12, color:'var(--titles)'}}>{item.ts}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside style={{display:'flex', flexDirection:'column', gap:12}}>
                        <div style={{background:'var(--card-bg)', padding:14, borderRadius:12, boxShadow:'0 6px 18px rgba(45,55,72,0.04)'}}>
                            <h3 style={{margin:0, fontSize:14, fontWeight:700, color:'var(--text)'}}>Upcoming Events</h3>
                            <ul style={{marginTop:10, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:8}}>
                                        {upcoming.map(ev => (
                                            <li key={ev.id} style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                                <div>
                                                    <div style={{fontWeight:700, color:'var(--text)'}}>{ev.title}</div>
                                                    <div style={{fontSize:12, color:'var(--titles)'}}>{new Date(ev.time).toLocaleString()}</div>
                                                </div>
                                                <button
                                                    className="btn btn-ghost"
                                                    style={{borderRadius:999}}
                                                    onClick={async () => {
                                                        if (!user) return navigate('/signin');
                                                        try {
                                                            const groupId = ev.group_id || null;
                                                            // if groupId not present, attempt to infer from title (fallback)
                                                            const gid = ev.group_id || groups.find(g=>ev.title.includes(g.topic))?.id;
                                                            if (!gid) return;
                                                            const res = await fetch(`${BASE_URL}/groups/${gid}/join`, {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ user_id: user.id })
                                                            });
                                                            if (res.ok) {
                                                                setJoinedSet(s => new Set([...Array.from(s), gid]));
                                                                // increment member count locally
                                                                setGroups(prev => prev.map(pg => pg.id === gid ? { ...pg, member_count: (pg.member_count || 0) + 1 } : pg));
                                                            }
                                                        } catch (err) { console.error(err) }
                                                    }}
                                                >
                                                    RSVP
                                                </button>
                                            </li>
                                        ))}
                            </ul>
                        </div>

                        <div style={{background:'var(--card-bg)', padding:14, borderRadius:12, boxShadow:'0 6px 18px rgba(45,55,72,0.04)'}}>
                            <h3 style={{margin:0, fontSize:14, fontWeight:700, color:'var(--text)'}}>Your Groups</h3>
                            <div style={{marginTop:10, display:'flex', flexDirection:'column', gap:8}}>
                                {groups.map(g => (
                                    <div key={g.id} style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                        <div>
                                            <div style={{fontWeight:700, color:'var(--text)'}}>{g.topic}</div>
                                            <div style={{fontSize:12, color:'var(--titles)'}}>{g.member_count || g.members || 0} members</div>
                                        </div>
                                        <div>
                                            <button
                                                title={`Open ${g.topic}`}
                                                className="btn btn-ghost"
                                                onClick={() => navigate(`/groups/${g.id}`)}
                                                style={{borderRadius:999, display:'inline-flex', alignItems:'center', justifyContent:'center', padding:'0.5rem 0.6rem'}}
                                            >
                                                <FaChevronRight />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </section>
            </div>
        </main>
    );
}