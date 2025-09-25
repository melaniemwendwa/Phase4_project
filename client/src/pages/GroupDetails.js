// ...existing code...
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { FaRegThumbsUp, FaRegCommentDots, FaLeaf } from "react-icons/fa";
// import API functions (to be implemented)
import { fetchGroupDetails, fetchPosts, createPost, joinGroup, leaveGroup, fetchUserGroups } from "../api";
import GroupCalendar from "../components/GroupCalendar";
import GroupDiscussion from "../components/GroupDiscussion";
import { AuthContext } from "../context/AuthProvider";

const GroupDetails = () => {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [joined, setJoined] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [newPost, setNewPost] = useState({ header: "", body: "", links: "" });

  useEffect(() => {
    fetchGroupDetails(groupId).then(setGroup);
    fetchPosts(groupId).then(setPosts);
  }, [groupId]);

  // Detect if current user has already joined this group
  useEffect(() => {
    let active = true;
    async function checkMembership() {
      if (!user) { setJoined(false); return; }
      try {
        const myGroups = await fetchUserGroups(user.id);
        if (!active) return;
        const isMember = (myGroups || []).some(g => String(g.id) === String(groupId));
        setJoined(isMember);
      } catch (_) {
        if (!active) return;
        setJoined(false);
      }
    }
    checkMembership();
    return () => { active = false };
  }, [user, groupId]);

  const handleJoin = async () => {
    // Require authentication to join
    if (!user) {
      // Redirect to sign in if not authenticated
      navigate("/signin");
      return;
    }
    if (joined) return;
    try {
      const resp = await joinGroup(groupId, { user_id: user.id, role: "member" });
      setJoined(true);
      // Prefer server-returned member_count if available; otherwise increment
      setGroup((g) => g ? { ...g, member_count: resp && typeof resp.member_count === 'number' ? resp.member_count : ((g.member_count || 0) + 1) } : g);
      // Optionally navigate to dashboard; for toggle UX, we stay on page
    } catch (e) {
      // No-op here; could surface a toast/error UI if desired
    }
  };

  const handleLeave = async () => {
    if (!user) { navigate('/signin'); return; }
    try {
      const resp = await leaveGroup(groupId, { user_id: user.id });
      setJoined(false);
      setGroup((g) => g ? { ...g, member_count: resp && typeof resp.member_count === 'number' ? resp.member_count : Math.max(0, (g.member_count || 0) - 1) } : g);
    } catch (e) {
      // Optionally show error
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    const postData = {
      header: newPost.header,
      body: newPost.body,
      links: newPost.links.split(",").map(l => l.trim()).filter(Boolean),
    };
    const created = await createPost(groupId, postData);
    setPosts([created, ...posts]);
    setShowModal(false);
    setNewPost({ header: "", body: "", links: "" });
  };

  // comment and reply handlers removed (not used in current compact posts view)

  if (!group) return <div>Loading...</div>;

  return (
    <div className="community-page" style={{background: 'var(--background)', minHeight: '100vh', fontFamily: 'Poppins, Segoe UI, Arial, sans-serif', minWidth: '100vw'}}>
      {/* Go back button */}
      <div style={{margin: '2em 0 0 2em'}}>
        <button className="button cancel" style={{fontFamily: 'Poppins', background: 'transparent', 
          color: 'var(--text)', borderRadius: '999px', fontWeight: 600, fontSize: '1em', 
          padding: '0.7em 2em', boxShadow: '0 2px 8px rgba(232, 168, 124, 0.12)'}}
          onClick={() => navigate("/groups")}
        >&larr; Go Back</button>
      </div>

      {/* Title block */}
      <div className="group-header-row" style={{display: 'flex', alignItems: 'center', gap: '1.5em', margin: '1.2em 0 0 2em'}}>
        <div className="group-avatar" style={{width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #7B9B8C 60%, #A8C5B6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.9em', color: 'var(--background)', fontWeight: 700}}>{group.initials || 'EA'}</div>
        <div className="group-title-block" style={{display: 'flex', flexDirection: 'column', gap: '0.2em'}}>
          <div className="group-title" style={{fontSize: '2.2em', fontWeight: 800, color: 'var(--text)', fontFamily: 'Poppins'}}>{group.name}</div>
          <div className="group-subtitle" style={{fontSize: '1.05em', color: 'var(--titles)', fontWeight: 500}}>{group.name}</div>
        </div>
      </div>

      {/* Description */}
      <div className="group-description" style={{margin: '0.8em 0 0 2em', fontSize: '1.05em', color: 'var(--text)', fontFamily: 'Poppins', maxWidth: '900px'}}>{group.description}</div>

      {/* Stats row: members, posts, join, create */}
      <div className="group-stats-row" style={{display: 'flex', alignItems: 'center', gap: '1em', margin: '1.2em 0 0 2em', fontSize: '1em', fontFamily: 'Poppins'}}>
        <span style={{display: 'flex', alignItems: 'center', gap: '0.4em'}}><i className="fas fa-users"></i> {group.member_count ?? 0} members</span>
        <span style={{display: 'flex', alignItems: 'center', gap: '0.4em'}}><strong>{posts.length}</strong> posts</span>
          <div style={{marginLeft: '0.6em', display: 'flex', gap: '0.6em', alignItems: 'center'}}>
          {joined ? (
            <button
              className="btn btn-danger"
              style={{background:'#ef4444', color:'#fff', borderRadius:'999px', padding:'0.5em 1em'}}
              onClick={handleLeave}
            >
              Leave
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleJoin}
            >
              Join
            </button>
          )}
          <button className="button" style={{padding:'0.5em 1em', fontSize:'0.95em', borderRadius:'999px', fontFamily:'Poppins', display:'flex', alignItems:'center', gap:'0.4em', boxShadow:'0 2px 8px rgba(123,155,140,0.10)', background:'var(--primary)', color:'var(--background)', fontWeight:600}} onClick={()=>setShowGuidelines(true)}>
            <span style={{fontSize:'1.05em'}}>+</span>
            <span style={{fontSize:'0.98em'}}>Create</span>
          </button>
        </div>
      </div>

      {/* Shared on header */}
      <div className="posts" style={{maxWidth: '1200px', width: '100%', margin: '1.5em auto 0 auto', padding: '0 1em', fontFamily: 'Poppins'}}>
        <div className="posts-header-row" style={{display: 'flex', alignItems: 'center', gap: '0.8em', marginBottom: '1em', justifyContent: 'flex-start'}}>
          <FaLeaf style={{fontSize: '1.2rem', color: 'var(--accents)'}} />
          <h3 style={{fontSize: '1.2em', fontWeight: 700, fontFamily: 'Poppins', margin: 0}}>Shared on {group.name}</h3>
          <span style={{fontWeight: 400, fontSize: '0.95em', color: 'var(--titles)', marginLeft: '0.5em'}}>• Sorted by newest</span>
        </div>
      </div>

      {/* Main content row: left = posts list, right = calendar + discussion (column) */}
      <div style={{margin: '1em auto', maxWidth: '95%', padding: '0 1em'}}>
        <div style={{display:'flex', flexDirection:'row', gap:'2em', alignItems:'flex-start'}}>
          {/* Left: Posts column */}
          <div className="posts-column" style={{flex:'1.6 1 0', minWidth:'420px'}}>
            {posts.length === 0 ? (
              <div style={{fontFamily:'Poppins', color:'var(--text)', opacity:0.85, textAlign:'center', padding:'2em', background:'var(--card-bg)', borderRadius:'16px', boxShadow:'0 6px 20px rgba(0,0,0,0.04)'}}>
                <div style={{fontSize:'1.2em', fontWeight:600, marginBottom:'0.5em'}}>No member posts yet.</div>
                <div style={{fontSize:'1em', opacity:0.8, marginBottom:'1em'}}>Be the first to share your thoughts, encouragement, or experience with the group!</div>
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="post-card" style={{background:'var(--card-bg)', borderRadius:'18px', boxShadow:'0 6px 18px rgba(0,0,0,0.05)', padding:'1.6em', marginBottom:'1.6em', display:'flex', flexDirection:'column', gap:'0.7em'}}>
                  <div style={{fontWeight:700, fontSize:'1.15em', color:'var(--text)'}}>{post.header}</div>
                  <div style={{margin:'0.5em 0', color:'var(--text)', fontSize:'1.03em'}}>{post.body}</div>
                  {post.links && post.links.length > 0 && (
                    <div style={{marginBottom:'0.5em'}}>
                      {post.links.map((link, idx) => (
                        <a key={idx} href={link} target="_blank" rel="noopener noreferrer" style={{color:'var(--primary)', marginRight:'1em', fontSize:'0.98em'}}>{link}</a>
                      ))}
                    </div>
                  )}
                  <div style={{display:'flex', gap:'1.5em', marginTop:'0.5em'}}>
                    <button className="icon-btn" style={{background:'none', border:'none', color:'var(--primary)', cursor:'pointer', fontSize:'1em', display:'flex', alignItems:'center', gap:'0.3em'}}>
                      <FaRegThumbsUp size={20} /> <span>{post.likes || 0}</span>
                    </button>
                    <button className="icon-btn" style={{background:'none', border:'none', color:'var(--primary)', cursor:'pointer', fontSize:'1em', display:'flex', alignItems:'center', gap:'0.3em'}}>
                      <FaRegCommentDots size={20} /> <span>{post.comments.length}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right pane: Calendar above Discussion. Modals placed here so they overlay this pane only. */}
          <div className="right-pane" style={{flex:'0.9 1 0', minWidth:'320px', display:'flex', flexDirection:'column', gap:'1.6em', position:'relative'}}>
            <div style={{background: 'var(--card-bg)', borderRadius: '16px', padding: '1em', boxShadow:'0 6px 20px rgba(0,0,0,0.04)'}}>
              <GroupCalendar />
            </div>

            <div style={{background: 'var(--card-bg)', borderRadius: '16px', padding: '1em', boxShadow:'0 6px 20px rgba(0,0,0,0.04)'}}>
              <GroupDiscussion />
            </div>

            {/* Guidelines modal (scoped to right-pane) */}
            <Modal isOpen={showGuidelines} onClose={()=>setShowGuidelines(false)}>
              <div style={{fontFamily: 'Poppins', padding: '1.2em 0', textAlign: 'center'}}>
                <h2 style={{marginBottom:'1em', fontWeight:700, fontFamily: 'Poppins', fontSize:'1.25em', color:'var(--primary)'}}>Post Guidelines & Mental Health Advocacy</h2>
                <ul style={{textAlign: 'left', margin: '0 auto 1.5em auto', maxWidth: '420px', fontSize: '1.02em', color: 'var(--text)', lineHeight: '1.6'}}>
                  <li>Be kind, respectful, and supportive to all members.</li>
                  <li>Do not share personal information or private details about others.</li>
                  <li>Posts should encourage, inform, or share experiences — no hate speech, bullying, or discrimination.</li>
                  <li>Trigger warnings are encouraged for sensitive topics.</li>
                  <li>This is not a substitute for professional help. If you or someone else is in crisis, seek professional support.</li>
                  <li>All posts are subject to moderation for safety and well-being.</li>
                </ul>
                <button className="button" style={{borderRadius:'999px', fontFamily: 'Poppins', fontSize:'1em', padding:'0.7em 1.6em', background: 'var(--primary)', color: 'var(--background)', boxShadow: '0 2px 8px rgba(123, 155, 140, 0.12)'}} onClick={()=>{setShowGuidelines(false); setShowModal(true);}}>Continue</button>
              </div>
            </Modal>

            {/* Create Post modal (scoped to right-pane) */}
            <Modal isOpen={showModal} onClose={()=>setShowModal(false)}>
              <div style={{fontFamily: 'Poppins', padding: '1em 0'}}>
                <h2 style={{marginBottom:'1em', fontWeight:700, fontFamily: 'Poppins', fontSize:'1.25em', color:'var(--primary)'}}>Create a Post</h2>
                <form onSubmit={handleAddPost} style={{display:'flex', flexDirection:'column', gap:'0.9rem', fontFamily: 'Poppins'}}>
                  <input className="form-control" type="text" placeholder="Header (e.g. What's on your mind?)" value={newPost.header} onChange={e=>setNewPost({...newPost, header:e.target.value})} required />
                  <textarea className="form-control form-textarea" placeholder="Body (share your story, thoughts, or encouragement)" value={newPost.body} onChange={e=>setNewPost({...newPost, body:e.target.value})} rows={5} required />
                  <input className="form-control" type="text" placeholder="Links (comma separated URLs, optional)" value={newPost.links} onChange={e=>setNewPost({...newPost, links:e.target.value})} />
                  <div style={{display:'flex', justifyContent:'flex-end', gap:'0.6rem'}}>
                    <button type="button" className="btn btn-ghost btn-small" onClick={()=>setShowModal(false)}>Cancel</button>
                    <button className="btn btn-primary" type="submit">Post</button>
                  </div>
                </form>
              </div>
            </Modal>

          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
