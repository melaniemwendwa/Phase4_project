import React, { useEffect, useState, useRef, useContext } from "react";
import { fetchMessages, createMessage, fetchEncouragements, createEncouragement } from "../apiEvents";
import { useParams } from "react-router-dom";
import { FaThumbsUp, FaHeart, FaEllipsisH } from 'react-icons/fa';
import { AuthContext } from '../context/AuthProvider';

export default function GroupDiscussion() {
  const { id: groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const { user } = useContext(AuthContext);
  const [encs, setEncs] = useState({});
  const listRef = useRef(null);

  useEffect(() => {
    fetchMessages(groupId).then(setMessages);
  }, [groupId]);

  useEffect(() => {
    // scroll to bottom when messages change
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async e => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const userId = user?.id || 1; // fallback to 1 for dev when not available
    await createMessage(groupId, { user_id: userId, content: newMsg.trim() });
    setNewMsg("");
    fetchMessages(groupId).then(setMessages);
  };

  const loadEncouragements = async msgId => {
    const data = await fetchEncouragements(msgId);
    setEncs(encs => ({ ...encs, [msgId]: data }));
  };

  const handleEncourage = async (msgId, type) => {
    await createEncouragement(msgId, { user_id: 1, type });
    loadEncouragements(msgId);
  };

  return (
    <div className="discussion-board chat-ui">
      <div className="chat-header">
        <div>
          <div className="chat-title">Group Chat</div>
          <div className="chat-sub">Live discussion</div>
        </div>
      </div>

      <div className="chat-list" ref={listRef}>
        {messages.map(msg => (
          <div key={msg.id} className={`chat-item ${msg.user_id === (user?.id || 1) ? 'me' : ''}`}>
            <div className="avatar">{msg.user_id === (user?.id || 1) ? 'You' : `U${msg.user_id}`}</div>
            <div className="chat-body">
              <div className="chat-meta">
                <span className="username">{msg.user_id === (user?.id || 1) ? 'You' : `User ${msg.user_id}`}</span>
                <span className="ts">{new Date(msg.created_at || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
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

      <form className="chat-input" onSubmit={handleSend}>
        <input aria-label="Type a message" value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
