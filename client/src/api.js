// API utility functions for events, messages, encouragements and groups
import { BASE_URL } from './apiBase';

// --- Events ---
export const fetchEvents = async groupId => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/events`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
};

export const createEvent = async (groupId, data) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
};

// --- Messages ---
export const fetchMessages = async groupId => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/messages`);
  if (!res.ok) return [];
  return res.json();
};

export const createMessage = async (groupId, data) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create message');
  return res.json();
};

// --- Encouragements ---
export const fetchEncouragements = async messageId => {
  const res = await fetch(`${BASE_URL}/messages/${messageId}/encouragements`);
  if (!res.ok) return [];
  return res.json();
};

export const createEncouragement = async (messageId, data) => {
  const res = await fetch(`${BASE_URL}/messages/${messageId}/encouragements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create encouragement');
  return res.json();
};

// --- Groups ---
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

// Check membership: server expects ?user_id=...
export const checkMembership = async (groupId, userId) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/membership?user_id=${userId}`);
  if (!res.ok) return { is_member: false };
  return res.json();
};

// Join a group (POST /groups/:id/join)
export const joinGroup = async (groupId, userId) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error('Failed to join group');
  return res.json();
};

// Leave a group (DELETE /groups/:id/join) - uses DELETE as the RESTful action
export const leaveGroup = async (groupId, userId) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/join`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error('Failed to leave group');
  return res.json();
};

export const fetchUserGroups = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/groups`);
  if (!res.ok) throw new Error('Failed to load user groups');
  return res.json();
};

// --- Posts ---
export const fetchPosts = async groupId => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/posts`);
  if (!res.ok) return [];
  return res.json();
};

export const createPost = async (groupId, postData) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
};

export const createComment = async (postId, content) => {
  // Placeholder: returns new comment object (client-side)
  return {
    id: Date.now(),
    content,
    replies: [],
  };
};

export const createReply = async (commentId, content) => {
  // Placeholder: returns new reply object (client-side)
  return {
    id: Date.now(),
    content,
  };
};

