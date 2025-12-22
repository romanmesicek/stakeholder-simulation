import { useParams, Link } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { useParticipants } from '../hooks/useParticipants';
import SessionCodeDisplay from '../components/SessionCodeDisplay';
import StatusBadge from '../components/StatusBadge';
import ParticipantList from '../components/ParticipantList';

export default function FacilitatorDashboard() {
  const { sessionCode } = useParams();
  const { session, loading: sessionLoading, updateStatus } = useSession(sessionCode);
  const { participants, loading: participantsLoading } = useParticipants(sessionCode);

  const handleToggleStatus = async () => {
    const newStatus = session.status === 'open' ? 'closed' : 'open';
    await updateStatus(newStatus);
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
        <p className="text-slate-600 mb-4">Session not found.</p>
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
        Exit
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Session</h1>
        <StatusBadge status={session.status} />
      </div>

      <div className="mb-6">
        <p className="text-sm text-slate-500 mb-2">Share this code with participants:</p>
        <SessionCodeDisplay code={sessionCode} />
      </div>

      <div className="mb-6">
        <p className="text-lg font-medium text-slate-800">
          {participants.length} Participant{participants.length !== 1 ? 's' : ''}
        </p>
      </div>

      <ParticipantList
        participants={participants}
        activeGroups={session.active_groups}
        maxPerGroup={session.max_per_group}
      />

      <div className="mt-8 pt-6 border-t border-slate-200">
        <button
          onClick={handleToggleStatus}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            session.status === 'open'
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {session.status === 'open' ? 'Close Session' : 'Reopen Session'}
        </button>
        <p className="mt-2 text-xs text-slate-500 text-center">
          {session.status === 'open'
            ? 'Closing prevents new participants from joining.'
            : 'Reopening allows new participants to join.'}
        </p>
      </div>
    </div>
  );
}
