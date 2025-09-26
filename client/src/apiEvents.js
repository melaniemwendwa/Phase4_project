import { BASE_URL } from './apiBase';

export const fetchEvents = async groupId => {
  try {
    const res = await fetch(`${BASE_URL}/groups/${groupId}/events`);
    if (!res.ok) throw new Error(`Failed to fetch events (${res.status})`);
    return await res.json();
  } catch (err) {
    throw new Error(`Network error fetching events: ${err.message}`);
  }
};

export const createEvent = async (groupId, data) => {
  try {
    const res = await fetch(`${BASE_URL}/groups/${groupId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to create event (${res.status})`);
    return await res.json();
  } catch (err) {
    throw new Error(`Network error creating event: ${err.message}`);
  }
};

export const updateEvent = async (groupId, eventId, data) => {
  try {
    const res = await fetch(`${BASE_URL}/groups/${groupId}/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to update event (${res.status})`);
    return await res.json();
  } catch (err) {
    throw new Error(`Network error updating event: ${err.message}`);
  }
};

export const deleteEvent = async (groupId, eventId) => {
  try {
    const res = await fetch(`${BASE_URL}/groups/${groupId}/events/${eventId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Failed to delete event (${res.status})`);
  } catch (err) {
    throw new Error(`Network error deleting event: ${err.message}`);
  }
};

export const fetchMessages = async groupId => {
  try {
    const res = await fetch(`${BASE_URL}/groups/${groupId}/messages`);
    if (!res.ok) throw new Error(`Failed to fetch messages (${res.status})`);
    return await res.json();
  } catch (err) {
    throw new Error(`Network error fetching messages: ${err.message}`);
  }
};

export const createMessage = async (groupId, data) => {
  try {
    const res = await fetch(`${BASE_URL}/groups/${groupId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to create message (${res.status})`);
    return await res.json();
  } catch (err) {
    throw new Error(`Network error creating message: ${err.message}`);
  }
};

export const fetchEncouragements = async messageId => {
  try {
    const res = await fetch(`${BASE_URL}/messages/${messageId}/encouragements`);
    if (!res.ok) throw new Error(`Failed to fetch encouragements (${res.status})`);
    return await res.json();
  } catch (err) {
    throw new Error(`Network error fetching encouragements: ${err.message}`);
  }
};

export const createEncouragement = async (messageId, data) => {
  try {
    const res = await fetch(`${BASE_URL}/messages/${messageId}/encouragements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to create encouragement (${res.status})`);
    return await res.json();
  } catch (err) {
    throw new Error(`Network error creating encouragement: ${err.message}`);
  }
};

