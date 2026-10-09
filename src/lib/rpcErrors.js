// Stable error tokens for RPC failures.
//
// The SQL functions raise with a PostgREST-style SQLSTATE (`PTxyz` → HTTP
// status xyz, see supabase/migrations/04_join_error_codes.sql), which
// supabase-js exposes as `error.code`. Databases that only ran migration 03
// carry the token in the message text instead, so that stays as fallback.

const CODE_TOKENS = {
  PT400: 'INVALID_NAME',
  PT404: 'SESSION_NOT_FOUND',
  PT409: 'GROUPS_FULL',
  PT423: 'SESSION_CLOSED',
};

const KNOWN_TOKENS = Object.values(CODE_TOKENS);

export function rpcErrorToken(error) {
  if (!error) return null;
  if (CODE_TOKENS[error.code]) return CODE_TOKENS[error.code];
  const message = error.message || '';
  return KNOWN_TOKENS.find(token => message.includes(token)) || null;
}
