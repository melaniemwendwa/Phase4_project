import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { fetchGroups } from '../api';
import { AuthContext } from '../context/AuthProvider';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetchGroups().then(setGroups);
  }, []);

  return (
    <main className="support-groups page-wrap" style={{background: 'var(--bg)'}}>
      <section className="home-hero">
        <div className="hero-content" style={{marginLeft: '160px'}}>
          <h1 className="hero-title">Support Groups</h1>
          <p className="hero-sub">A safe, moderated place to connect with people who understand. Browse groups by topic and join conversations that matter.</p>
          <div className="hero-actions">
            {!user && (
              <>
                <Link to="/groups" className="btn btn-primary">Browse groups</Link>
                <Link to="/signup" className="btn btn-ghost">Create an account</Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="groups-section">
        <div className="container">
          {/* Search / filters */}
          <div className="search-bar" style={{marginBottom: '1rem', display: 'flex', gap: 12, alignItems: 'center'}}>
            <input
              aria-label="Search groups"
              placeholder="Search groups by topic or keyword"
              value={query}
              onChange={e=>setQuery(e.target.value)}
              className="form-control"
              style={{flex: 1, minWidth: 180}}
            />
            <select value={sort} onChange={e=>setSort(e.target.value)} className="form-control" style={{width: 180}}>
              <option value="newest">Sorted by newest</option>
              <option value="popular">Most members</option>
              <option value="alpha">A → Z</option>
            </select>
          </div>

          <div className="groups-layout">
            <div className="main-column">
              <div className="groups-grid">
                {groups
                  .filter(g => !query || (g.topic || '').toLowerCase().includes(query.toLowerCase()) || (g.description || '').toLowerCase().includes(query.toLowerCase()))
                  .sort((a,b)=>{
                    if(sort==='popular') return (b.member_count||0)-(a.member_count||0);
                    if(sort==='alpha') return (a.topic||'').localeCompare(b.topic||'');
                    return (new Date(b.created_at||0)) - (new Date(a.created_at||0));
                  })
                  .map(g => (
                    <Link key={g.id} to={`/groups/${g.id}`} className="group-link">
                      <article className="group-card">
                        <div className="group-row">
                          <div className="group-avatar-small">{(g.topic || '').split(' ').slice(0,2).map(w=>w[0]).join('')}</div>
                          <div className="group-meta">
                            <div className="group-name">{g.topic}</div>
                            <div className="group-members">{g.member_count ?? 0} members</div>
                          </div>
                        </div>
                        <p className="group-desc">{g.description}</p>
                      </article>
                    </Link>
                ))}
              </div>
            </div>

            <aside className="sidebar">
              <div className="group-card" style={{padding: '1rem'}}> 
                <h3 style={{marginTop:0, marginBottom:8}}>Featured groups</h3>
                <p style={{margin:0, color:'var(--titles)'}}>Quick access to highlighted communities</p>
              </div>

              <div className="group-card" style={{marginTop:12, padding:'1rem'}}>
                <h3 style={{marginTop:0}}>Group Session Calendar</h3>
                <p style={{color:'var(--titles)'}}>Upcoming sessions and events</p>
              </div>

              <div className="group-card" style={{marginTop:12, padding:'1rem'}}>
                <h3 style={{marginTop:0}}>Live group chat</h3>
                <p style={{color:'var(--titles)'}}>Join real-time conversations</p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
