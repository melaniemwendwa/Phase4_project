import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGroups } from '../api';

export default function Groups() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroups().then(setGroups);
  }, []);

  return (
    <main className="support-groups page-wrap">
      <section className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">Support Groups</h1>
          <p className="hero-sub">A safe, moderated place to connect with people who understand. Browse groups by topic and join conversations that matter.</p>
          <div className="hero-actions">
            <Link to="/groups" className="btn btn-primary">Browse groups</Link>
            <Link to="/signup" className="btn btn-ghost">Create an account</Link>
          </div>
        </div>

        <div className="hero-visual" aria-hidden>
          {/* Decorative illustration built with simple SVG shapes so no extra assets are required */}
          <svg width="420" height="240" viewBox="0 0 420 240" xmlns="http://www.w3.org/2000/svg" role="img">
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#7B9B8C" />
                <stop offset="100%" stopColor="#A8C5B6" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="420" height="240" rx="20" fill="var(--card-bg)" stroke="rgba(0,0,0,0.03)" />
            <circle cx="340" cy="60" r="44" fill="url(#g1)" opacity="0.95" />
            <rect x="36" y="46" width="220" height="28" rx="8" fill="#F3F4F6" />
            <rect x="36" y="86" width="160" height="20" rx="6" fill="#F3F4F6" />
            <rect x="36" y="116" width="280" height="10" rx="6" fill="#F3F4F6" />
            <g transform="translate(40,150)" opacity="0.95">
              <rect x="0" y="0" width="80" height="80" rx="12" fill="#EDE9FE" />
              <rect x="96" y="0" width="120" height="80" rx="12" fill="#FEF3C7" />
            </g>
          </svg>
        </div>
      </section>

      <section className="groups-section">
        <div className="container">
          <div className="groups-grid">
            {groups.map(g => (
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
      </section>
    </main>
  );
}
