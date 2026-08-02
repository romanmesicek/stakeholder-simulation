// Facilitator owner keys, stored per session code in localStorage.
// The database only ever sees a SHA-256 hash of these keys; losing
// localStorage means re-importing the key on the dashboard.

const STORAGE_KEY = 'facilitator-keys';

export function getFacilitatorKeys() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function getFacilitatorKey(sessionCode) {
  return getFacilitatorKeys()[sessionCode] || null;
}

export function saveFacilitatorKey(sessionCode, key) {
  const keys = getFacilitatorKeys();
  keys[sessionCode] = key;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function removeFacilitatorKey(sessionCode) {
  const keys = getFacilitatorKeys();
  delete keys[sessionCode];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function knownSessionCodes() {
  return Object.keys(getFacilitatorKeys());
}

export function generateOwnerKey() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}
