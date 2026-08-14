import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSession } from '../hooks/useSession';
import { useParticipants } from '../hooks/useParticipants';
import { SCENARIOS, getStakeholderById } from '../lib/stakeholders';
import { getUiStrings } from '../lib/i18n';
import { useRole } from '../lib/RoleContext';
import Loading from '../components/Loading';

export default function JoinSession() {
  const { sessionCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading: sessionLoading } = useSession(sessionCode);
  const { participants, loading: participantsLoading } = useParticipants(sessionCode);
  const { joinSession } = useRole();

  const [name, setName] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);
  // Exact name match found — waiting for the user to confirm it's them
  const [pendingRejoin, setPendingRejoin] = useState(null);
  // Similar name found — probably a rejoin typo
  const [similarMatch, setSimilarMatch] = useState(null);
  const [similarDismissedFor, setSimilarDismissedFor] = useState(null);

  const t = getUiStrings(session?.scenario);
  const removedNotice = location.state?.reason === 'removed';

  // Check if already joined
  useEffect(() => {
    const participantId = localStorage.getItem(`participant-${sessionCode}`);
    if (participantId) {
      navigate(`/session/${sessionCode}`);
    }
  }, [sessionCode, navigate]);

  const cleanName = () => name.trim().replace(/\s+/g, ' ');

  const completeJoin = (participantId) => {
    localStorage.setItem(`participant-${sessionCode}`, participantId);
    joinSession(sessionCode, session?.scenario, session?.education_level);
    navigate(`/session/${sessionCode}`);
  };

  const insertParticipant = async (trimmedName) => {
    // The server assigns the group atomically; ties between equally full
    // groups are broken by the scenario's staffing priority.
    const scenarioGroups = SCENARIOS[session.scenario]?.groups || {};
    const priorityOrder = [...session.active_groups].sort(
      (a, b) => (scenarioGroups[a]?.priority ?? 999) - (scenarioGroups[b]?.priority ?? 999)
    );

    const { data, error: rpcError } = await supabase.rpc('join_session', {
      p_session_id: sessionCode,
      p_name: trimmedName,
      p_group_priority: priorityOrder,
    });

    if (rpcError || !data) {
      const message = rpcError?.message || '';
      if (message.includes('GROUPS_FULL')) {
        setError(t.allGroupsFull);
      } else if (message.includes('SESSION_CLOSED')) {
        setError(t.closedNoNewJoin);
      } else {
        setError(t.joinFailed);
      }
      setJoining(false);
      return;
    }

    completeJoin(data.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = cleanName();

    if (trimmed.length < 2) {
      setError(t.nameTooShort);
      return;
    }

    setError(null);
    setPendingRejoin(null);
    setSimilarMatch(null);

    // Exact name match → ask before silently taking over that identity
    const existingParticipant = participants.find(
      p => p.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existingParticipant) {
      setPendingRejoin(existingParticipant);
      return;
    }

    // Closed sessions accept rejoins only, no new participants
    if (session.status === 'closed') {
      setError(t.closedNoNewJoin);
      return;
    }

    // Similar existing name → probably a rejoin typo, ask once
    if (similarDismissedFor !== trimmed.toLowerCase()) {
      const similar = participants.find(p => {
        const a = p.name.toLowerCase();
        const b = trimmed.toLowerCase();
        return a !== b && (a.startsWith(b) || b.startsWith(a)) && Math.min(a.length, b.length) >= 3;
      });
      if (similar) {
        setSimilarMatch(similar);
        return;
      }
    }

    setJoining(true);
    await insertParticipant(trimmed);
  };

  const handleConfirmRejoin = () => {
    completeJoin(pendingRejoin.id);
  };

  const handleRejectRejoin = () => {
    setPendingRejoin(null);
    setError(t.duplicateNameHint);
  };

  const handleJoinAsNew = async () => {
    const trimmed = cleanName();
    setSimilarDismissedFor(trimmed.toLowerCase());
    setSimilarMatch(null);
    setJoining(true);
    await insertParticipant(trimmed);
  };

  if (sessionLoading || participantsLoading) {
    return <Loading text={t.loading} />;
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">{t.sessionNotFound}</p>
        <Link to="/" className="text-blue-600 hover:underline">
          {t.backHome}
        </Link>
      </div>
    );
  }

  const isClosed = session.status === 'closed';
  const pendingRejoinGroup = pendingRejoin
    ? getStakeholderById(pendingRejoin.stakeholder_group, session.scenario)?.name
    : null;

  return (
    <div lang={SCENARIOS[session?.scenario]?.language}>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t.back}
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 mb-2">{t.joinTitle}</h1>
      <p className="text-slate-500 mb-6 font-mono">{sessionCode}</p>

      {removedNotice && (
        <div role="alert" className="mb-6 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
          {t.removedNotice}
        </div>
      )}

      {isClosed && (
        <div className="mb-6 p-3 rounded-lg bg-slate-100 border border-slate-200 text-sm text-slate-700">
          {t.closedRejoinNotice}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="participant-name" className="block text-sm font-medium text-slate-700 mb-2">
            {t.yourName}
          </label>
          <input
            id="participant-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setPendingRejoin(null);
              setSimilarMatch(null);
            }}
            placeholder={t.namePlaceholder}
            maxLength={30}
            autoCorrect="off"
            spellCheck={false}
            aria-describedby={error ? 'join-error' : undefined}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
        </div>

        {error && (
          <p id="join-error" role="alert" className="mb-4 text-sm text-red-600">{error}</p>
        )}

        {pendingRejoin && (
          <div className="mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-slate-700 mb-3">
              {t.rejoinConfirmQuestion(pendingRejoin.name, pendingRejoinGroup)}
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleConfirmRejoin}
                className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t.rejoinYes}
              </button>
              <button
                type="button"
                onClick={handleRejectRejoin}
                className="w-full bg-white text-slate-700 font-medium py-3 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                {t.rejoinNo}
              </button>
            </div>
          </div>
        )}

        {similarMatch && (
          <div className="mb-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-sm text-slate-700 mb-3">
              {t.similarNameQuestion(similarMatch.name)}
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setName(similarMatch.name);
                  setPendingRejoin(similarMatch);
                  setSimilarMatch(null);
                }}
                className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t.rejoinAs(similarMatch.name)}
              </button>
              <button
                type="button"
                onClick={handleJoinAsNew}
                className="w-full bg-white text-slate-700 font-medium py-3 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                {t.joinAsNew}
              </button>
            </div>
          </div>
        )}

        {!pendingRejoin && !similarMatch && (
          <button
            type="submit"
            disabled={joining || name.trim().length < 2}
            className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {joining ? t.joiningButton : t.joinButton}
          </button>
        )}
      </form>

      <div className="mt-6 pt-6 border-t border-slate-200 text-sm text-slate-500">
        <div className="text-center mb-3">
          <p>{t.groupsActive(session.active_groups.length)}</p>
          <p>{t.participantsJoined(participants.length)}</p>
        </div>
        <p className="text-xs text-slate-500 text-center">
          {t.rejoinHint}
        </p>
      </div>
    </div>
  );
}
