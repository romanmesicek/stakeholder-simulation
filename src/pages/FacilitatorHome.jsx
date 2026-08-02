import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAllSessions } from '../hooks/useAllSessions';
import { saveFacilitatorKey } from '../lib/facilitatorKeys';
import { SCENARIOS, getLevelMeta } from '../lib/stakeholders';
import { getScenarioLanguage } from '../lib/i18n';
import { MATERIAL_META } from '../lib/materialMeta';
import { getFacilitatorMaterials } from '../lib/contentLoader';
import Loading from '../components/Loading';

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
  const levelBadge = getLevelMeta(session.scenario, session.education_level).badge;

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
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            {SCENARIOS[session.scenario]?.name || session.scenario}
          </span>
          {levelBadge && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              levelBadge === 'BA'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-purple-100 text-purple-700'
            }`}>
              {levelBadge}
            </span>
          )}
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

function ImportSession({ onImported }) {
  const [expanded, setExpanded] = useState(false);
  const [code, setCode] = useState('');
  const [key, setKey] = useState('');
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState(null);

  const handleImport = async () => {
    const trimmedCode = code.trim().toUpperCase();
    const trimmedKey = key.trim();
    if (trimmedCode.length !== 6 || !trimmedKey) return;

    setImporting(true);
    setError(null);
    const { data: valid, error: rpcError } = await supabase.rpc('verify_owner_key', {
      p_session_id: trimmedCode,
      p_owner_key: trimmedKey,
    });
    if (rpcError || !valid) {
      setError('Code and key do not match a session.');
      setImporting(false);
      return;
    }

    saveFacilitatorKey(trimmedCode, trimmedKey);
    setCode('');
    setKey('');
    setExpanded(false);
    setImporting(false);
    onImported();
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="text-sm text-slate-500 hover:text-slate-700 font-medium"
      >
        {expanded ? '▾' : '▸'} Session from another device?
      </button>
      {expanded && (
        <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-sm text-slate-600 mb-3">
            Enter the session code and the facilitator key (shown on the
            session dashboard of the device that created it).
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
              placeholder="Code"
              aria-label="Session code"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="characters"
              spellCheck={false}
              className="sm:w-28 p-2 font-mono text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
            />
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Facilitator key"
              aria-label="Facilitator key"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="flex-1 p-2 font-mono text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleImport}
              disabled={importing || code.trim().length !== 6 || !key.trim()}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {importing ? '...' : 'Add'}
            </button>
          </div>
          {error && (
            <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function FacilitatorHome() {
  const { sessions, loading, deleteSession, refetch } = useAllSessions();

  const openSessions = sessions.filter(s => s.status === 'open');
  const closedSessions = sessions.filter(s => s.status === 'closed');

  if (loading) {
    return <Loading text="Loading sessions..." />;
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

      <ImportSession onImported={refetch} />

      {sessions.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <p className="text-slate-500 mb-4">No sessions on this device yet.</p>
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

      {/* Facilitator Materials Section */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Facilitator Materials</h2>
        <div className="space-y-4">
          {Object.entries(SCENARIOS).map(([scenarioId, scenario]) =>
            scenario.levels.map(level => {
              const facilitatorKeys = getFacilitatorMaterials(scenarioId, level);
              const allKeys = ['debriefing', ...facilitatorKeys.filter(k => k !== 'debriefing')];
              const lang = getScenarioLanguage(scenarioId);
              const levelBadge = getLevelMeta(scenarioId, level).badge;

              return (
                <div key={`${scenarioId}-${level}`} className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-medium text-slate-800">{scenario.name}</h3>
                    {scenario.levels.length > 1 && levelBadge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        levelBadge === 'BA'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {levelBadge}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {allKeys.map(key => {
                      const meta = MATERIAL_META[key];
                      if (!meta) return null;
                      return (
                        <Link
                          key={key}
                          to={`/facilitate/materials/${key}?scenario=${scenarioId}&level=${level}`}
                          className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          <span className="text-xl">{meta.emoji}</span>
                          <div>
                            <p className="font-medium text-slate-800 text-sm">
                              {meta.label[lang]}
                            </p>
                            <p className="text-xs text-slate-500">
                              {meta.description[lang]}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
