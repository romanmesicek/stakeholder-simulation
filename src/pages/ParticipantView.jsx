import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSession } from '../hooks/useSession';
import { useParticipants } from '../hooks/useParticipants';
import { getStakeholderById, SCENARIOS } from '../lib/stakeholders';
import { loadAllSessionContent } from '../lib/contentLoader';
import { getUiStrings } from '../lib/i18n';
import MarkdownRenderer from '../components/MarkdownRenderer';
import Accordion from '../components/Accordion';
import GroupMembersList from '../components/GroupMembersList';
import ParticipantList from '../components/ParticipantList';
import Loading from '../components/Loading';

const colorClasses = {
  blue: 'border-blue-400 bg-blue-50',
  amber: 'border-amber-400 bg-amber-50',
  emerald: 'border-emerald-400 bg-emerald-50',
  green: 'border-green-400 bg-green-50',
  purple: 'border-purple-400 bg-purple-50',
  orange: 'border-orange-400 bg-orange-50',
  slate: 'border-slate-400 bg-slate-50',
  cyan: 'border-cyan-400 bg-cyan-50',
};

export default function ParticipantView() {
  const { sessionCode } = useParams();
  const navigate = useNavigate();
  const { session, loading: sessionLoading } = useSession(sessionCode);
  const { participants, loading: participantsLoading } = useParticipants(sessionCode);

  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState(false);

  const t = getUiStrings(session?.scenario);

  useEffect(() => {
    const fetchParticipant = async () => {
      const participantId = localStorage.getItem(`participant-${sessionCode}`);

      if (!participantId) {
        navigate(`/join/${sessionCode}`);
        return;
      }

      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('id', participantId)
        .single();

      if (error || !data) {
        // Participant record is gone (e.g. removed by the facilitator) —
        // tell the join page why so the student doesn't silently re-register.
        localStorage.removeItem(`participant-${sessionCode}`);
        navigate(`/join/${sessionCode}`, { state: { reason: 'removed' } });
        return;
      }

      setParticipant(data);
      setLoading(false);
    };

    fetchParticipant();
  }, [sessionCode, navigate]);

  // Load content based on session education level
  const loadContent = useCallback(async () => {
    if (!session || !participant) return;

    const scenario = session.scenario;
    const level = session.education_level || SCENARIOS[scenario]?.defaultLevel || 'master';

    setContentLoading(true);
    setContentError(false);
    try {
      const loadedContent = await loadAllSessionContent(scenario, level, participant.stakeholder_group);
      setContent(loadedContent);
    } catch (err) {
      console.error('Failed to load content:', err);
      setContentError(true);
    } finally {
      setContentLoading(false);
    }
  }, [session, participant]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  if (sessionLoading || (session && (loading || participantsLoading || contentLoading))) {
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

  // Session + participant are fine but the markdown chunks didn't load
  // (bad wifi, deploy during class) — offer a retry instead of a dead end.
  if (participant && (contentError || !content)) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4" role="alert">{t.contentLoadError}</p>
        <button
          onClick={loadContent}
          className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t.retry}
        </button>
      </div>
    );
  }

  if (!participant) {
    return null; // redirect to join is already in flight
  }

  const stakeholder = getStakeholderById(participant.stakeholder_group, session.scenario);

  if (!stakeholder) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4" role="alert">{t.unknownRole}</p>
        <Link to="/" className="text-blue-600 hover:underline">
          {t.backHome}
        </Link>
      </div>
    );
  }

  const myGroupMembers = participants.filter(
    p => p.stakeholder_group === participant.stakeholder_group
  );
  const keyFactsLabel = SCENARIOS[session.scenario]?.keyFactsLabel || '🎭 Staying in Role';

  return (
    <div lang={SCENARIOS[session.scenario]?.language}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">{t.yourRole}</h1>
        <span className="font-mono text-sm text-slate-500">{sessionCode}</span>
      </div>

      {session.status === 'closed' && (
        <div className="mb-6 p-3 rounded-lg bg-slate-100 border border-slate-200 text-sm text-slate-700">
          {t.sessionClosedBanner}
        </div>
      )}

      {/* Role Card */}
      <div className={`p-4 rounded-lg border-l-4 mb-6 ${colorClasses[stakeholder.color] || colorClasses.slate}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{stakeholder.emoji}</span>
          <h2 className="text-xl font-bold text-slate-800">{stakeholder.name}</h2>
        </div>
        <div className="mt-3">
          <p className="text-sm font-medium text-slate-600 mb-2">{t.yourGroup}</p>
          <GroupMembersList
            members={myGroupMembers}
            highlightName={participant.name}
            scenario={session.scenario}
          />
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-3">
        <Accordion title={t.roleCardSection} defaultOpen>
          <MarkdownRenderer content={content.roleMarkdown} lang={SCENARIOS[session.scenario]?.language} />
        </Accordion>

        <Accordion title={keyFactsLabel}>
          <MarkdownRenderer content={content.keyFacts} lang={SCENARIOS[session.scenario]?.language} />
        </Accordion>

        <Accordion title={t.caseSection}>
          <MarkdownRenderer content={content.situationBriefing} lang={SCENARIOS[session.scenario]?.language} />
        </Accordion>

        <Accordion title={t.scheduleSection}>
          <MarkdownRenderer content={content.schedule} lang={SCENARIOS[session.scenario]?.language} />
        </Accordion>

        <Accordion title={t.allGroupsSection}>
          <ParticipantList
            participants={participants}
            activeGroups={session.active_groups}
            maxPerGroup={session.max_per_group}
            highlightName={participant.name}
            scenario={session.scenario}
          />
        </Accordion>
      </div>
    </div>
  );
}
