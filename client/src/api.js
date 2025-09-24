// API utility functions for events, messages, encouragements

// In-memory post storage for MVP
const postsStore = {};

const BASE_URL = "http://localhost:5000";

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


// --- GroupDetails page API ---
const healthGroups = [
  { id: 1, name: "Stress Management", description: "Share strategies and support for managing stress in daily life.", members: 0 },
  { id: 2, name: "Grief Support", description: "A safe space to process loss and grief with others who understand.", members: 0 },
  { id: 3, name: "Addiction Recovery", description: "Support and resources for overcoming addiction and staying healthy.", members: 0 },
  { id: 4, name: "Anxiety Support", description: "Connect with others to share experiences and coping skills for anxiety.", members: 0 },
  { id: 5, name: "Depression Support", description: "Find encouragement and share your journey with depression.", members: 0 },
  { id: 6, name: "Mindfulness & Meditation", description: "Learn and share mindfulness and meditation practices for mental wellness.", members: 0 },
  { id: 7, name: "Trauma Healing", description: "A community for healing and growth after trauma.", members: 0 },
  { id: 8, name: "Self-Esteem Boosters", description: "Share tips and stories to build self-esteem and confidence.", members: 0 },
  { id: 9, name: "Youth Mental Health", description: "Support for young people navigating mental health challenges.", members: 0 },
  { id: 10, name: "Parenting & Family", description: "Resources and support for parents and families facing mental health issues.", members: 0 },
];

// Export fetchGroups for use in frontend
export const fetchGroups = async () => {
  return healthGroups;
};

export const fetchGroupDetails = async groupId => {
  const group = healthGroups.find(g => g.id === Number(groupId));
  if (group) {
    return group;
  }
  // fallback for unknown group
  return {
    name: "Unknown Group",
    description: "This group does not exist.",
    members: 0,
  };
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
