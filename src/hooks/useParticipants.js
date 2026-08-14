import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useParticipants(sessionCode) {
  const [participants, setParticipants] = useState([]);
  // Without a session code there is nothing to load — start resolved.
  const [loading, setLoading] = useState(() => Boolean(sessionCode));
  const [error, setError] = useState(null);

  const fetchParticipants = useCallback(async () => {
    if (!sessionCode) return;

    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('session_id', sessionCode)
      .order('joined_at', { ascending: true });

    if (error) {
      setError(error);
    } else {
      setParticipants(data || []);
      setError(null);
    }
    setLoading(false);
  }, [sessionCode]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- all state updates in fetchParticipants happen after await (async)
    fetchParticipants();

    if (!sessionCode) return;

    const channel = supabase
      .channel(`participants-${sessionCode}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'participants',
        filter: `session_id=eq.${sessionCode}`
      }, () => {
        fetchParticipants();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [sessionCode, fetchParticipants]);

  return { participants, loading, error, refetch: fetchParticipants };
}
