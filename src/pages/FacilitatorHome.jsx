import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAllSessions } from '../hooks/useAllSessions';

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}

function SessionCard({ session, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(session.id);
    } catch (err) {
      console.error('Failed to delete session:', err);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-slate-800">{session.id}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            session.status === 'open'
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-100 text-slate-500'
          }`}>
            {session.status === 'open' ? 'Open' : 'Closed'}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
          <span>{session.participantCount} participant{session.participantCount !== 1 ? 's' : ''}</span>
          <span>{session.active_groups.length} groups</span>
          <span>{formatDate(session.created_at)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to={`/facilitate/${session.id}`}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          View
        </Link>

        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors disabled:opacity-50"
            >
              {deleting ? '...' : 'Confirm'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              disabled={deleting}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete session"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function FacilitatorHome() {
  const { sessions, loading, deleteSession } = useAllSessions();

  const openSessions = sessions.filter(s => s.status === 'open');
  const closedSessions = sessions.filter(s => s.status === 'closed');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500">Loading sessions...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Manage Sessions</h1>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Session
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <p className="text-slate-500 mb-4">No sessions yet.</p>
          <Link
            to="/create"
            className="text-blue-600 hover:underline"
          >
            Create your first session
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {openSessions.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                Open ({openSessions.length})
              </h2>
              <div className="space-y-2">
                {openSessions.map(session => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onDelete={deleteSession}
                  />
                ))}
              </div>
            </div>
          )}

          {closedSessions.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                Closed ({closedSessions.length})
              </h2>
              <div className="space-y-2">
                {closedSessions.map(session => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onDelete={deleteSession}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
