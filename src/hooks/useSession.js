import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getFacilitatorKey } from '../lib/facilitatorKeys';

export function useSession(sessionCode) {
  const [session, setSession] = useState(null);
  // Without a session code there is nothing to load — start resolved.
  const [loading, setLoading] = useState(() => Boolean(sessionCode));
  const [error, setError] = useState(null);

  const fetchSession = useCallback(async () => {
    if (!sessionCode) return;

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionCode)
      .single();

    if (error) {
      setError(error);
      setSession(null);
    } else {
      setSession(data);
      setError(null);
    }
    setLoading(false);
  }, [sessionCode]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- all state updates in fetchSession happen after await (async)
    fetchSession();

    if (!sessionCode) return;

    const channel = supabase
      .channel(`session-status-${sessionCode}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'sessions',
        filter: `id=eq.${sessionCode}`
      }, (payload) => {
        setSession(payload.new);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [sessionCode, fetchSession]);

  const updateStatus = async (newStatus) => {
    const { error } = await supabase.rpc('set_session_status', {
      p_session_id: sessionCode,
      p_owner_key: getFacilitatorKey(sessionCode),
      p_status: newStatus,
    });

    if (error) {
      setError(error);
      return false;
    }
    return true;
  };

  return { session, loading, error, refetch: fetchSession, updateStatus };
}
