import heroImage from '../../assets/group-2.jpg';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegCommentDots } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { fetchGroups, fetchPosts, createPost } from '../../api';

export default function Hero() {
    return (
        <div className="hero-visual-block">
            {/* decorative background image (positioned & filtered via CSS) */}
            <img src={heroImage} alt="People in a support group" className="hero-bg-img" />
            {/* full static overlay that covers the whole image (single encompassing layer) */}
            <div className="hero-full-overlay" aria-hidden></div>
            <div className="hero-overlay">
                    <div className="hero-inner" style={{minWidth: '100%', color:'white', display:'grid', gap:12}}>
                    <h1 className="hero-heading" style={{fontSize:'2.8rem', fontWeight:800, margin:0}}>Don't go through it alone.</h1>
                    <p className="hero-lead" style={{fontSize:'1.05rem', margin:0, color:'rgba(255,255,255,0.9)'}}>A welcoming community for people navigating mental health challenges — share, learn, and connect with moderated support groups.</p>
                    <div style={{marginTop:12}}>
                      <Link to="/signup" className="btn btn-primary" style={{marginRight:8}}>Join the community</Link>
                      <Link to="/info" className="btn btn-ghost">Learn more</Link>
                    </div>

                    {/* sample posts row to show community engagement */}
                    <HeroPosts />
                </div>
            </div>
        </div>
    )
}

function HeroPosts() {
    const [posts, setPosts] = useState([]);
    const posterName = 'dmbdesignpdx';

    useEffect(() => {
        let mounted = true;

        async function loadMultiple() {
            const groups = await fetchGroups();
            if (!mounted || !groups || !groups.length) return;

            // choose up to 4 groups to diversify the hero
            const chosenGroups = groups.slice(0, 4);

            // For each group, ensure there are a few posts (seed if empty), then collect posts
            const allPosts = [];
            for (const g of chosenGroups) {
                let groupPosts = await fetchPosts(g.id);
                if ((!groupPosts || groupPosts.length === 0) && mounted) {
                    // seed two sample posts that mention the group to keep content relevant
                    await createPost(g.id, { header: '', body: `Today in ${g.name} we shared a grounding exercise that helped many of us.` });
                    await createPost(g.id, { header: '', body: `Resources and tips from ${g.name}: breathing techniques, short meditations, and community check-ins.` });
                    groupPosts = await fetchPosts(g.id);
                }

                if (groupPosts && groupPosts.length) {
                    // attach group meta to each post for rendering
                    groupPosts.slice(0, 3).forEach(p => allPosts.push({ ...p, group: g }));
                }
            }

            // keep a reasonable number of posts for the hero scroll (e.g., 8)
            if (mounted) setPosts(allPosts.slice(0, 8));
        }

        loadMultiple();
        return () => { mounted = false };
    }, []);

    return (
        <div className="hero-posts-row" aria-label="group posts">
            {posts.map(p => (
                <article key={`${p.id}-${p.group.id}`} className="hero-post dark-card">
                    {p.group && (
                        <header className="post-head">
                            <div className="post-avatar-wrap">
                                <img src={heroImage} alt="poster avatar" className="post-avatar-img" />
                            </div>
                            <div className="post-head-meta">
                                <div className="post-username">{posterName}</div>
                                <div className="post-group">from {p.group.name}</div>
                            </div>
                        </header>
                    )}

                    <div className="post-body">{p.body}</div>
                    <hr />
                    <footer className="post-footer">
                        <div className="post-actions">
                            <button className="icon-btn like"><FaHeart aria-hidden/> <span>{p.likes || 0}</span></button>
                            <button className="icon-btn comment"><FaRegCommentDots aria-hidden/> <span>{(p.comments && p.comments.length) || 0}</span></button>
                        </div>
                        <button className="dismiss">×</button>
                    </footer>
                </article>
            ))}
        </div>
    );
}