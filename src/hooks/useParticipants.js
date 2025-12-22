import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useParticipants(sessionCode) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchParticipants = async () => {
    if (!sessionCode) {
      setLoading(false);
      return;
    }

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
  };

  useEffect(() => {
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
  }, [sessionCode]);

  return { participants, loading, error, refetch: fetchParticipants };
}
