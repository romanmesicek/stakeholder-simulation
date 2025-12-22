import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSession } from '../hooks/useSession';
import { useParticipants } from '../hooks/useParticipants';
import { assignToGroup } from '../lib/sessionUtils';

export default function JoinSession() {
  const { sessionCode } = useParams();
  const navigate = useNavigate();
  const { session, loading: sessionLoading } = useSession(sessionCode);
  const { participants, loading: participantsLoading } = useParticipants(sessionCode);

  const [name, setName] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);

  // Check if already joined
  useEffect(() => {
    const participantId = localStorage.getItem(`participant-${sessionCode}`);
    if (participantId) {
      navigate(`/session/${sessionCode}`);
    }
  }, [sessionCode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      setError('Please enter a name (at least 2 characters).');
      return;
    }

    setJoining(true);
    setError(null);

    // Assign to group
    const assignedGroup = assignToGroup(
      session.active_groups,
      participants,
      session.max_per_group
    );

    if (!assignedGroup) {
      setError('All groups are full. Please contact the facilitator.');
      setJoining(false);
      return;
    }

    // Insert participant
    const { data, error: insertError } = await supabase
      .from('participants')
      .insert({
        session_id: sessionCode,
        name: name.trim(),
        stakeholder_group: assignedGroup
      })
      .select()
      .single();

    if (insertError) {
      setError('Failed to join session. Please try again.');
      setJoining(false);
      return;
    }

    // Store participant ID
    localStorage.setItem(`participant-${sessionCode}`, data.id);

    navigate(`/session/${sessionCode}`);
  };

  if (sessionLoading || participantsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">Session not found. Check the code and try again.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  if (session.status === 'closed') {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">This session is closed and not accepting new participants.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 mb-2">Join Session</h1>
      <p className="text-slate-500 mb-6 font-mono">{sessionCode}</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={joining || name.trim().length < 2}
          className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {joining ? 'Joining...' : 'Join'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
        <p>{session.active_groups.length} groups active</p>
        <p>{participants.length} participant{participants.length !== 1 ? 's' : ''} joined</p>
      </div>
    </div>
  );
}
