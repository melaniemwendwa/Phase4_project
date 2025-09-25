// API utility functions for events, messages, encouragements
import { BASE_URL } from './apiBase';

// In-memory post storage for MVP
const postsStore = {};

// Using shared BASE_URL (http://localhost:5555)

export const fetchEvents = async groupId => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/events`);
  return res.json();
};

export const createEvent = async (groupId, data) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const fetchMessages = async groupId => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/messages`);
  return res.json();
};

export const createMessage = async (groupId, data) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const fetchEncouragements = async messageId => {
  const res = await fetch(`${BASE_URL}/messages/${messageId}/encouragements`);
  return res.json();
};

export const createEncouragement = async (messageId, data) => {
  const res = await fetch(`${BASE_URL}/messages/${messageId}/encouragements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};


// --- Groups API ---
export const fetchGroups = async () => {
  const res = await fetch(`${BASE_URL}/groups`);
  if (!res.ok) throw new Error('Failed to load groups');
  return res.json();
};

export const fetchGroupDetails = async groupId => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}`);
  if (!res.ok) throw new Error('Failed to load group');
  return res.json();
};

export const joinGroup = async (groupId, { user_id, role = 'member' }) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, role })
  });
  if (!res.ok) throw new Error('Failed to join group');
  return res.json();
};

export const leaveGroup = async (groupId, { user_id }) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/leave`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id })
  });
  if (!res.ok) throw new Error('Failed to leave group');
  return res.json();
};

export const fetchUserGroups = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/groups`);
  if (!res.ok) throw new Error('Failed to load user groups');
  return res.json();
};

export const fetchPosts = async groupId => {
  if (!postsStore[groupId]) postsStore[groupId] = [];
  return postsStore[groupId];
};

export const createPost = async (groupId, postData) => {
  if (!postsStore[groupId]) postsStore[groupId] = [];
  const newPost = {
    id: Date.now(),
    header: postData.header,
    body: postData.body,
    links: postData.links || [],
    comments: [],
    likes: 0,
    shares: 0,
    saves: 0,
    liked: false,
    shared: false,
    saved: false,
  };
  postsStore[groupId].unshift(newPost);
  return newPost;
};

export const createComment = async (postId, content) => {
  // Placeholder: returns new comment object
  return {
    id: Date.now(),
    content,
    replies: [],
  };
};

export const createReply = async (commentId, content) => {
  // Placeholder: returns new reply object
  return {
    id: Date.now(),
    content,
  };
};
