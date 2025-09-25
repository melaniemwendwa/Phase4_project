import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { fetchGroups } from '../api';
import { AuthContext } from '../context/AuthProvider';

export default function FeaturedGroups() {
  const [groups, setGroups] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    let mounted = true;
    fetchGroups().then(list => {
      if (!mounted) return;
      setGroups(list.slice(0, 4));
    });
    return () => { mounted = false };
  }, []);

  return (
    <section className="featured-section">
      <div className="container">
        <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
          <div>
            <h2 style={{margin:0, fontSize:'1.4rem', fontWeight:800}}>Featured groups</h2>
            <p style={{margin: '6px 0 0', color:'#6B7280'}}>Join moderated conversations that meet regularly.</p>
          </div>
          {user ? <Link to="/groups" className="btn btn-ghost">See all groups</Link> : null}
        </header>

        <div className="featured-grid" style={{marginTop:12}}>
          {groups.map(g => {
            const content = (
              <article className="group-spotlight" key={g.id} style={!user ? {opacity:0.92} : {}}>
                <div className="avatar">
                  {(g.topic || '').split(' ').slice(0,2).map(w=>w[0]).join('')}
                </div>
                <div className="meta">
                  <div className="name">{g.topic}</div>
                  <div className="desc">{g.description}</div>
                  <div className="desc" style={{marginTop:4, fontSize:'0.9em', color:'#6B7280'}}>{g.member_count ?? 0} members</div>
                </div>
              </article>
            );

            return user ? (
              <Link key={g.id} to={`/groups/${g.id}`} className="group-spotlight-link">{content}</Link>
            ) : (
              // non-signed users see a static card (no navigation)
              <div key={g.id} style={{cursor:'default'}}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
