import React, { useEffect, useState, useRef, useContext } from "react";
import { fetchMessages, createMessage, fetchEncouragements, createEncouragement } from "../apiEvents";
import { useParams } from "react-router-dom";
import { FaThumbsUp, FaHeart, FaEllipsisH } from 'react-icons/fa';
import { AuthContext } from '../context/AuthProvider';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

export default function GroupDiscussion() {
  const { id: groupId } = useParams();
  const [messages, setMessages] = useState([]);
  // Message input is handled by Formik in the form below
  const { user } = useContext(AuthContext);
  const [encs, setEncs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      if (!groupId) return;
      setLoading(true);
      setError("");
      try {
        const data = await fetchMessages(groupId);
        setMessages(data);
      } catch (e) {
        setError(e.message || "Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [groupId]);

  useEffect(() => {
    // scroll to bottom when messages change
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  // Submission handled by Formik below

  const loadEncouragements = async msgId => {
    try {
      const data = await fetchEncouragements(msgId);
      setEncs(encs => ({ ...encs, [msgId]: data }));
    } catch (e) {
      setError(e.message || "Failed to load encouragements");
    }
  };

  const handleEncourage = async (msgId, type) => {
    try {
      await createEncouragement(msgId, { user_id: 1, type });
      loadEncouragements(msgId);
    } catch (e) {
      setError(e.message || "Failed to submit encouragement");
    }
  };

  const retry = async () => {
    if (!groupId) return;
    setError("");
    setLoading(true);
    try {
      const data = await fetchMessages(groupId);
      setMessages(data);
    } catch (e) {
      setError(e.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="discussion-board chat-ui">
      <div className="chat-header">
        <div>
          <div className="chat-title">Group Chat</div>
          <div className="chat-sub">Live discussion</div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" role="alert" style={{margin:"0.5rem 1rem"}}>
          <span>{error}</span>
          <button className="btn btn-sm" style={{marginLeft:"0.5rem"}} onClick={retry}>Retry</button>
        </div>
      )}

      {loading && (
        <div className="chat-loading" style={{padding:"1rem"}}>Loading messages…</div>
      )}

      <div className="chat-list" ref={listRef}>
        {messages.map(msg => (
          <div key={msg.id} className={`chat-item ${msg.user_id === (user?.id || 1) ? 'me' : ''}`}>
            <div className="avatar">{msg.user_id === (user?.id || 1) ? 'You' : `U${msg.user_id}`}</div>
            <div className="chat-body">
              <div className="chat-meta">
                <span className="username">{msg.user_id === (user?.id || 1) ? 'You' : `User ${msg.user_id}`}</span>
                <span className="ts">{new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="chat-text">{msg.content}</div>
              <div className="chat-actions">
                <button className="action-btn" title="Encourage" onClick={() => handleEncourage(msg.id, "upvote")}><FaThumbsUp /></button>
                <button className="action-btn" title="Heart" onClick={() => handleEncourage(msg.id, "heart")}><FaHeart /></button>
                <button className="action-btn" title="View feedback" onClick={() => loadEncouragements(msg.id)}><FaEllipsisH /></button>
                {encs[msg.id] && (
                  <span className="enc-stats"><FaThumbsUp style={{marginRight:'0.25rem'}} />{encs[msg.id].filter(e => e.type === "upvote").length} &nbsp; <FaHeart style={{marginRight:'0.25rem'}} />{encs[msg.id].filter(e => e.type === "heart").length}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Formik
        initialValues={{ content: '', anonymous: false }}
        validationSchema={Yup.object().shape({ content: Yup.string().required('Message cannot be empty').min(1) })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const userId = user?.id || 1;
          try {
            await createMessage(groupId, { user_id: userId, content: values.content.trim(), anonymous: !!values.anonymous });
            resetForm();
            const data = await fetchMessages(groupId);
            setMessages(data);
          } catch (e) {
            setError(e.message || 'Failed to send message');
          } finally { setSubmitting(false) }
        }}
      >{({ isSubmitting }) => (
        <Form className="chat-input ms-form">
          <Field name="content" aria-label="Type a message" className="ms-input" placeholder="Type a message..." />
          <label className="ms-ctrl">
            <Field type="checkbox" name="anonymous" />
            <span className="ms-ctrl-label">Post anonymously</span>
          </label>
          <button type="submit" className="btn btn-primary ms-primary" disabled={isSubmitting}>Send</button>
        </Form>
      )}</Formik>
    </div>
  );
}
