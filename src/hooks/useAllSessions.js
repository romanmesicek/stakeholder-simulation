import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { knownSessionCodes, getFacilitatorKey, removeFacilitatorKey } from '../lib/facilitatorKeys';

// Lists the sessions this facilitator holds keys for (localStorage).
// Sessions created on another device appear after importing their key.
export function useAllSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async () => {
    const codes = knownSessionCodes();
    if (codes.length === 0) {
      // Yield once so the state updates stay asynchronous even on this
      // shortcut path (avoids setState-in-effect render cascades).
      await Promise.resolve();
      setSessions([]);
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('sessions')
      .select(`
        *,
        participants:participants(count)
      `)
      .in('id', codes)
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError);
    } else {
      // Transform to include participant count
      const sessionsWithCount = data.map(session => ({
        ...session,
        participantCount: session.participants?.[0]?.count || 0
      }));
      setSessions(sessionsWithCount);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- all state updates in fetchSessions happen after await (async)
    fetchSessions();

    // Subscribe to session changes
    const sessionsChannel = supabase
      .channel('all-sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sessions' },
        () => fetchSessions()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'participants' },
        () => fetchSessions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
    };
  }, [fetchSessions]);

  const deleteSession = async (sessionId) => {
    const { error: deleteError } = await supabase.rpc('delete_session', {
      p_session_id: sessionId,
      p_owner_key: getFacilitatorKey(sessionId),
    });

    if (deleteError) {
      throw deleteError;
    }

    removeFacilitatorKey(sessionId);
    await fetchSessions();
  };

  return { sessions, loading, error, refetch: fetchSessions, deleteSession };
}
