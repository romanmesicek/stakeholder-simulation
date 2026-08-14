import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';
import { getFacilitatorKey, saveFacilitatorKey } from '../lib/facilitatorKeys';
import { useSession } from '../hooks/useSession';
import { useParticipants } from '../hooks/useParticipants';
import { loadSharedContent } from '../lib/contentLoader';
import { SCENARIOS, getStakeholderById, getLevelMeta } from '../lib/stakeholders';
import SessionCodeDisplay from '../components/SessionCodeDisplay';
import StatusBadge from '../components/StatusBadge';
import ParticipantList from '../components/ParticipantList';
import MarkdownRenderer from '../components/MarkdownRenderer';
import BackButton from '../components/BackButton';
import Loading from '../components/Loading';

export default function FacilitatorDashboard() {
  const { sessionCode } = useParams();
  const { session, loading: sessionLoading, updateStatus } = useSession(sessionCode);
  const { participants, loading: participantsLoading, refetch: refetchParticipants } = useParticipants(sessionCode);
  const [showDebriefing, setShowDebriefing] = useState(false);
  const [debriefingContent, setDebriefingContent] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [ownerKey, setOwnerKey] = useState(() => getFacilitatorKey(sessionCode));
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);

  const joinUrl = `${window.location.origin}/join/${sessionCode}`;
  // Legacy sessions (pre owner-key migration) are manageable without a key
  const needsKey = Boolean(session?.owner_key_hash) && !ownerKey;

  const handleImportKey = async () => {
    const trimmed = keyInput.trim();
    if (!trimmed) return;
    setActionError(null);
    const { data: valid, error } = await supabase.rpc('verify_owner_key', {
      p_session_id: sessionCode,
      p_owner_key: trimmed,
    });
    if (error || !valid) {
      setActionError('That facilitator key does not match this session.');
      return;
    }
    saveFacilitatorKey(sessionCode, trimmed);
    setOwnerKey(trimmed);
    setKeyInput('');
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(ownerKey);
      setKeyCopied(true);
      setTimeout(() => setKeyCopied(false), 2000);
    } catch {
      setActionError('Could not copy the key — please copy it manually.');
    }
  };

  const handleToggleStatus = async () => {
    setActionError(null);
    const newStatus = session.status === 'open' ? 'closed' : 'open';
    const ok = await updateStatus(newStatus);
    if (!ok) {
      setActionError('Could not update the session status. Please try again.');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      setActionError('Could not copy the link — please copy it manually.');
    }
  };

  const describeActionError = (error, fallback) => {
    if (error?.message?.includes('NOT_AUTHORIZED')) {
      return 'This action requires the facilitator key for this session.';
    }
    return fallback;
  };

  const handleMoveParticipant = async (member, newGroup) => {
    if (newGroup === member.stakeholder_group) return;
    setActionError(null);
    const { error } = await supabase.rpc('move_participant', {
      p_participant_id: member.id,
      p_owner_key: ownerKey,
      p_new_group: newGroup,
    });
    if (error) {
      setActionError(describeActionError(error, `Could not move ${member.name}. Please try again.`));
    }
    refetchParticipants();
  };

  const handleRemoveParticipant = async (member) => {
    const groupName = getStakeholderById(member.stakeholder_group, session.scenario)?.name || member.stakeholder_group;
    if (!window.confirm(`Remove ${member.name} (${groupName}) from this session?`)) return;
    setActionError(null);
    const { error } = await supabase.rpc('remove_participant', {
      p_participant_id: member.id,
      p_owner_key: ownerKey,
    });
    if (error) {
      setActionError(describeActionError(error, `Could not remove ${member.name}. Please try again.`));
    }
    refetchParticipants();
  };

  const handleOpenDebriefing = async () => {
    if (!debriefingContent && session) {
      const content = await loadSharedContent(session.scenario, session.education_level, 'debriefing');
      setDebriefingContent(content);
    }
    setShowDebriefing(true);
  };

  if (sessionLoading || participantsLoading) {
    return <Loading />;
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

  const levelMeta = getLevelMeta(session.scenario, session.education_level);

  return (
    <div>
      <BackButton to="/facilitate" label="All Sessions" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Session</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-slate-500">
              {SCENARIOS[session.scenario]?.name}
              {' · '}
              {levelMeta.label}
            </p>
            {levelMeta.badge && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                levelMeta.badge === 'BA'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {levelMeta.badge}
              </span>
            )}
          </div>
        </div>
        <StatusBadge status={session.status} />
      </div>

      <div className="mb-6">
        <p className="text-sm text-slate-500 mb-2">Share this code with participants:</p>
        <SessionCodeDisplay code={sessionCode} />
        <div className="mt-4 flex items-center gap-4">
          <div className="bg-white p-2 rounded-lg border border-slate-200 shrink-0">
            <QRCodeSVG value={joinUrl} size={112} aria-label={`QR code for ${joinUrl}`} />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-600 break-all">{joinUrl}</p>
            <button
              onClick={handleCopyLink}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {linkCopied ? 'Copied!' : 'Copy join link'}
            </button>
          </div>
        </div>
      </div>

      {needsKey && (
        <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-sm font-medium text-amber-800 mb-2">
            No facilitator key on this device
          </p>
          <p className="text-sm text-amber-700 mb-3">
            Closing the session and managing participants requires the key shown
            on the device that created this session. Paste it here to manage
            the session from this device too.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Facilitator key"
              aria-label="Facilitator key"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="flex-1 p-2 font-mono text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleImportKey}
              disabled={!keyInput.trim()}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {ownerKey && (
        <div className="mb-6 text-sm">
          <button
            onClick={() => setShowKey(!showKey)}
            aria-expanded={showKey}
            className="text-slate-500 hover:text-slate-700 font-medium"
          >
            {showKey ? '▾ Facilitator key' : '▸ Facilitator key'}
          </button>
          {showKey && (
            <div className="mt-2 p-3 rounded-lg bg-slate-100 border border-slate-200">
              <p className="font-mono break-all text-slate-700">{ownerKey}</p>
              <div className="mt-2 flex items-center gap-4">
                <button
                  onClick={handleCopyKey}
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  {keyCopied ? 'Copied!' : 'Copy key'}
                </button>
                <span className="text-xs text-slate-500">
                  Save this key to manage the session from another device.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-6">
        <p className="text-lg font-medium text-slate-800">
          {participants.length} Participant{participants.length !== 1 ? 's' : ''}
        </p>
      </div>

      {actionError && (
        <p role="alert" className="mb-4 text-sm text-red-600">{actionError}</p>
      )}

      <ParticipantList
        participants={participants}
        activeGroups={session.active_groups}
        maxPerGroup={session.max_per_group}
        scenario={session.scenario}
        onMoveParticipant={handleMoveParticipant}
        onRemoveParticipant={handleRemoveParticipant}
      />

      {/* Facilitator Actions */}
      <div className="mt-6 space-y-3">
        <Link
          to={`/facilitate/${sessionCode}/roles`}
          className="w-full py-3 px-6 rounded-lg font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Role Cards
        </Link>
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
                <MarkdownRenderer content={debriefingContent} lang={SCENARIOS[session.scenario]?.language} />
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
