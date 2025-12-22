import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSession(sessionCode) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSession = async () => {
    if (!sessionCode) {
      setLoading(false);
      return;
    }

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
  };

  useEffect(() => {
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
  }, [sessionCode]);

  const updateStatus = async (newStatus) => {
    const { error } = await supabase
      .from('sessions')
      .update({ status: newStatus })
      .eq('id', sessionCode);

    if (error) {
      setError(error);
      return false;
    }
    return true;
  };

  return { session, loading, error, refetch: fetchSession, updateStatus };
}
