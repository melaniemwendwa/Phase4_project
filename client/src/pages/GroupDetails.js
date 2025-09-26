// GroupDetails page: combined/cleaned version with membership checking and join/leave
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { FaRegThumbsUp, FaRegCommentDots, FaLeaf } from "react-icons/fa";
import { fetchGroupDetails, fetchPosts, createPost, checkMembership, joinGroup, leaveGroup } from "../api";
import GroupCalendar from "../components/GroupCalendar";
import GroupDiscussion from "../components/GroupDiscussion";
import { AuthContext } from "../context/AuthProvider";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const GroupDetails = () => {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [joined, setJoined] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchGroupDetails(groupId).then(g => { if (mounted) setGroup(g); }).catch(()=>{});
    fetchPosts(groupId).then(p => { if (mounted) setPosts(p); }).catch(()=>{});
    return () => { mounted = false };
  }, [groupId]);

  useEffect(() => {
    if (!user) { setJoined(false); return; }
    let active = true;
    checkMembership(groupId, user.id).then(res => {
      if (!active) return;
      setJoined(!!(res && (res.is_member || res.member_count || res.message === 'already a member')));
    }).catch(()=>{});
    return () => { active = false };
  }, [groupId, user]);

  const handleJoin = async () => {
    if (!user) { navigate('/signin'); return; }
    try {
      if (joined) {
        const resp = await leaveGroup(groupId, user.id);
        setJoined(false);
        setGroup(g => g ? { ...g, member_count: resp && typeof resp.member_count === 'number' ? resp.member_count : Math.max(0, (g.member_count || 1) - 1) } : g);
      } else {
        const resp = await joinGroup(groupId, user.id);
        setJoined(true);
        setGroup(g => g ? { ...g, member_count: resp && typeof resp.member_count === 'number' ? resp.member_count : ((g.member_count || 0) + 1) } : g);
      }
    } catch (err) {
      console.error('join/leave error', err);
    }
  };

  // Post creation handled by Formik in the modal

  if (!group) return <div>Loading...</div>;

  return (
    <div className="community-page group-page">
      <div className="container">
        <div className="group-back">
          <button className="button back-button" onClick={() => navigate("/groups")}>&larr; Go Back</button>
        </div>

        <div className="group-header">
          <div className="group-avatar-large">{group.initials || 'EA'}</div>
          <div className="group-title-block">
            <div className="group-title">{group.name}</div>
            <div className="group-subtitle">{group.name}</div>
          </div>
        </div>

        <div className="group-description">{group.description}</div>

        <div className="group-actions">
          <div className="meta">
            <span className="meta-item">{group.member_count ?? group.members ?? 0} members</span>
            <span className="meta-item"><strong>{posts.length}</strong> posts</span>
          </div>
          <div className="actions">
            <button className={joined ? 'btn btn-danger' : 'btn btn-primary'} onClick={handleJoin}>{joined ? 'Leave' : 'Join'}</button>
            <button className="button button-create" onClick={()=>setShowGuidelines(true)}>
              <span className="plus">+</span>
              <span>Create</span>
            </button>
          </div>
        </div>

        <div className="posts-header">
          <FaLeaf className="leaf-icon" />
          <h3>Shared on {group.name}</h3>
          <span className="sorted">• Sorted by newest</span>
        </div>

        <div className="group-layout">
          <div className="posts-column">
            {posts.length === 0 ? (
              <div style={{fontFamily:'Poppins', color:'var(--text)', opacity:0.85, textAlign:'center', padding:'2em', background:'var(--card-bg)', borderRadius:'16px', boxShadow:'0 6px 20px rgba(0,0,0,0.04)'}}>
                <div style={{fontSize:'1.2em', fontWeight:600, marginBottom:'0.5em'}}>No member posts yet.</div>
                <div style={{fontSize:'1em', opacity:0.8, marginBottom:'1em'}}>Be the first to share your thoughts, encouragement, or experience with the group!</div>
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="post-card" style={{background:'var(--card-bg)', borderRadius:'18px', boxShadow:'0 6px 18px rgba(0,0,0,0.05)', padding:'1.6em', marginBottom:'1.6em', display:'flex', flexDirection:'column', gap:'0.7em'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1rem'}}>
                    <div style={{display:'flex', flexDirection:'column'}}>
                      <div style={{fontWeight:700, fontSize:'1.15em', color:'var(--text)'}}>{post.header}</div>
                      <div style={{fontSize:'0.9rem', color:'#6B7280'}}>{post.anonymous ? 'Anonymous' : `Member #${post.user_id || ''}`}</div>
                    </div>
                    <div style={{fontSize:'0.9rem', color:'#9CA3AF'}}>{post.timestamp ? new Date(post.timestamp).toLocaleString() : ''}</div>
                  </div>
                  <div style={{margin:'0.5em 0', color:'var(--text)', fontSize:'1.03em', whiteSpace:'pre-wrap'}}>{post.body}</div>
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
                      <FaRegCommentDots size={20} /> <span>{(post.comments || []).length}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="right-pane" style={{flex:'0.9 1 0', minWidth:'320px', display:'flex', flexDirection:'column', gap:'1.6em', position:'relative'}}>
            <div style={{background: 'var(--card-bg)', borderRadius: '16px', padding: '1em', boxShadow:'0 6px 20px rgba(0,0,0,0.04)'}}>
              <GroupCalendar />
            </div>

            <div style={{background: 'var(--card-bg)', borderRadius: '16px', padding: '1em', boxShadow:'0 6px 20px rgba(0,0,0,0.04)'}}>
              <GroupDiscussion />
            </div>

            <Modal isOpen={showGuidelines} onClose={()=>setShowGuidelines(false)}>
              <div style={{fontFamily: 'Poppins', padding: '1.2em 0', textAlign: 'center'}}>
                <h2 style={{marginBottom:'1em', fontWeight:700, fontFamily: 'Poppins', fontSize:'1.25em', color: 'var(--primary)'}}>Post Guidelines & Mental Health Advocacy</h2>
                <ul style={{textAlign: 'left', margin: '0 auto 1.5em auto', maxWidth: '420px', fontSize: '1.02em', color: 'var(--text)', lineHeight: '1.6'}}>
                  <li>Be kind, respectful, and supportive to all members.</li>
                  <li>Do not share personal information or private details about others.</li>
                  <li>Posts should encourage, inform, or share experiences — no hate speech, bullying, or discrimination.</li>
                  <li>Trigger warnings are encouraged for sensitive topics.</li>
                  <li>This is not a substitute for professional help. If you or someone else is in crisis, seek professional support.</li>
                  <li>All posts are subject to moderation for safety and well-being.</li>
                </ul>
                <button className="button" style={{borderRadius:'999px', fontFamily: 'Poppins', fontSize:'1em', padding:'0.7em 1.6em', background: 'var(--primary)', color: 'var(--background)', boxShadow: '0 2px 8px rgba(124,58,237,0.12)'}} onClick={()=>{setShowGuidelines(false); setShowModal(true);}}>Continue</button>
              </div>
            </Modal>

            <Modal isOpen={showModal} onClose={()=>setShowModal(false)}>
              <div style={{fontFamily: 'Poppins', padding: '1em 0'}}>
                <h2 style={{marginBottom:'1em', fontWeight:700, fontFamily: 'Poppins', fontSize:'1.25em', color: 'var(--primary)'}}>Create a Post</h2>
                {/* Use Formik + Yup for validation */}
                <Formik
                  initialValues={{ header: '', body: '', links: '' }}
                  validationSchema={Yup.object().shape({
                    header: Yup.string().required('Header required').max(255, 'Header too long'),
                    body: Yup.string().required('Body required').min(5, 'Write a bit more'),
                    links: Yup.string().test('is-urls', 'Links must be comma separated valid URLs', value => {
                      if (!value) return true;
                      try {
                        return value.split(',').map(s=>s.trim()).filter(Boolean).every(u => /^(https?:)?\/\//.test(u) || /^https?:\/\//.test(u));
                      } catch(e) { return false }
                    })
                  })}
                  onSubmit={async (values, { setSubmitting }) => {
                    const postData = {
                      header: values.header,
                      body: values.body,
                      links: values.links ? values.links.split(',').map(l=>l.trim()).filter(Boolean) : [],
                      user_id: user ? user.id : 0
                    };
                    try {
                      await createPost(groupId, postData);
                      const refreshed = await fetchPosts(groupId);
                      setPosts(refreshed);
                      setShowModal(false);
                    } catch (err) {
                      console.error('create post failed', err);
                    } finally { setSubmitting(false) }
                  }}
                >{({ values, handleChange, handleBlur, isSubmitting, errors, touched }) => (
                  <Form className="ms-form">
                    <div className="ms-row">
                      <label className="ms-label" htmlFor="post-header">Header</label>
                      <Field id="post-header" name="header" className="form-control ms-input" placeholder="What's on your mind?" />
                      <div style={{color:'#b91c1c', fontSize:'0.9rem'}}><ErrorMessage name="header" /></div>
                    </div>

                    <div className="ms-row">
                      <label className="ms-label" htmlFor="post-body">Body</label>
                      <Field as="textarea" id="post-body" name="body" className="form-control ms-textarea" placeholder="Share your story, thoughts, or encouragement" rows={5} />
                      <div style={{color:'#b91c1c', fontSize:'0.9rem'}}><ErrorMessage name="body" /></div>
                    </div>

                    <div className="ms-row">
                      <label className="ms-label" htmlFor="post-links">Links (optional)</label>
                      <Field id="post-links" name="links" className="form-control ms-input" placeholder="Comma separated URLs" />
                      <div style={{color:'#b91c1c', fontSize:'0.9rem'}}><ErrorMessage name="links" /></div>
                    </div>

                    <div className="ms-actions">
                      <button type="button" className="btn btn-ghost btn-small" onClick={()=>setShowModal(false)}>Cancel</button>
                      <button className="btn btn-primary ms-primary" type="submit" disabled={isSubmitting}> {isSubmitting ? 'Posting...' : 'Post'}</button>
                    </div>
                  </Form>
                )}
                </Formik>
              </div>
            </Modal>

          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;

