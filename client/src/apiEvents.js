import { BASE_URL } from './apiBase';

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

export const updateEvent = async (groupId, eventId, data) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/events/${eventId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteEvent = async (groupId, eventId) => {
  await fetch(`${BASE_URL}/groups/${groupId}/events/${eventId}`, { method: "DELETE" });
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
