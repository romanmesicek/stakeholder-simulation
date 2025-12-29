import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { useParticipants } from '../hooks/useParticipants';
import { loadSharedContent } from '../lib/contentLoader';
import SessionCodeDisplay from '../components/SessionCodeDisplay';
import StatusBadge from '../components/StatusBadge';
import ParticipantList from '../components/ParticipantList';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function FacilitatorDashboard() {
  const { sessionCode } = useParams();
  const { session, loading: sessionLoading, updateStatus } = useSession(sessionCode);
  const { participants, loading: participantsLoading } = useParticipants(sessionCode);
  const [showDebriefing, setShowDebriefing] = useState(false);
  const [debriefingContent, setDebriefingContent] = useState(null);

  const handleToggleStatus = async () => {
    const newStatus = session.status === 'open' ? 'closed' : 'open';
    await updateStatus(newStatus);
  };

  const handleOpenDebriefing = async () => {
    if (!debriefingContent && session) {
      const content = await loadSharedContent(session.education_level || 'master', 'debriefing');
      setDebriefingContent(content);
    }
    setShowDebriefing(true);
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
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Session</h1>
          <p className="text-sm text-slate-500">
            {session.education_level === 'bachelor' ? 'Bachelor Level (~2 hours)' : 'Master Level (~3 hours)'}
          </p>
        </div>
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

      {/* Debriefing Guide Button */}
      <div className="mt-6">
        <button
          onClick={handleOpenDebriefing}
          className="w-full py-3 px-6 rounded-lg font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Debriefing Guide
        </button>
      </div>

      {/* Debriefing Modal */}
      {showDebriefing && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl my-8">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Debriefing Guide</h2>
              <button
                onClick={() => setShowDebriefing(false)}
                className="text-slate-500 hover:text-slate-700 p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              {debriefingContent ? (
                <MarkdownRenderer content={debriefingContent} />
              ) : (
                <p className="text-slate-500">Loading...</p>
              )}
            </div>
            <div className="border-t border-slate-200 px-6 py-4 rounded-b-lg">
              <button
                onClick={() => setShowDebriefing(false)}
                className="w-full py-2 px-4 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
