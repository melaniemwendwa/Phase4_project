// Tiny client-side auth helper (localStorage-based) for demo/dev.
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('currentUser');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user) {
  try { localStorage.setItem('currentUser', JSON.stringify(user)); } catch (e) {}
}

export function clearCurrentUser() {
  try { localStorage.removeItem('currentUser'); } catch (e) {}
}

export function isAuthenticated() {
  return !!getCurrentUser();
}
