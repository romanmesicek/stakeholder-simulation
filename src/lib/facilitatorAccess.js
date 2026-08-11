// Access gate for the facilitator area and full foreign role cards.
// The plain access code is NOT in the repo — only its SHA-256 hash.
// To change the code: `echo -n "NEW-CODE" | shasum -a 256` and replace the hash.
// Note: this is friction against curious participants, not real security —
// all content ships in the client bundle regardless.

const ACCESS_HASH = 'f72f2078e4fa5c10ee427ae2be6852fcbfa992d942e2b8ccfad321371018630d';
const STORAGE_KEY = 'facilitator-access';

export function isFacilitatorUnlocked() {
  try {
    return localStorage.getItem(STORAGE_KEY) === ACCESS_HASH;
  } catch {
    return false;
  }
}

export async function unlockFacilitator(code) {
  const data = new TextEncoder().encode(code.trim().toUpperCase());
  const digest = await crypto.subtle.digest('SHA-256', data);
  const hex = Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  if (hex === ACCESS_HASH) {
    localStorage.setItem(STORAGE_KEY, hex);
    return true;
  }
  return false;
}
