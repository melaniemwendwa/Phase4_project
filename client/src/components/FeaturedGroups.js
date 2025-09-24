import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGroups } from '../api';

export default function FeaturedGroups() {
  const [groups, setGroups] = useState([]);

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
          <Link to="/groups" className="btn btn-ghost">See all groups</Link>
        </header>

        <div className="featured-grid" style={{marginTop:12}}>
          {groups.map(g => (
            <Link key={g.id} to={`/groups/${g.id}`} className="group-spotlight">
              <div className="avatar">
                {g.name.split(' ').slice(0,2).map(w=>w[0]).join('')}
              </div>
              <div className="meta">
                <div className="name">{g.name}</div>
                <div className="desc">{g.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
