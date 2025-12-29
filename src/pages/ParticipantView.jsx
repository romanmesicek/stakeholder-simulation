import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSession } from '../hooks/useSession';
import { useParticipants } from '../hooks/useParticipants';
import { getStakeholderById } from '../lib/stakeholders';
import { loadAllSessionContent } from '../lib/contentLoader';
import MarkdownRenderer from '../components/MarkdownRenderer';
import Accordion from '../components/Accordion';
import GroupMembersList from '../components/GroupMembersList';
import ParticipantList from '../components/ParticipantList';

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
        // Participant not found, clear localStorage and redirect
        localStorage.removeItem(`participant-${sessionCode}`);
        navigate(`/join/${sessionCode}`);
        return;
      }

      setParticipant(data);
      setLoading(false);
    };

    fetchParticipant();
  }, [sessionCode, navigate]);

  // Load content based on session education level
  useEffect(() => {
    const loadContent = async () => {
      if (!session || !participant) return;

      const level = session.education_level || 'master';

      try {
        const loadedContent = await loadAllSessionContent(level, participant.stakeholder_group);
        setContent(loadedContent);
      } catch (err) {
        console.error('Failed to load content:', err);
      } finally {
        setContentLoading(false);
      }
    };

    loadContent();
  }, [session, participant]);

  if (loading || sessionLoading || participantsLoading || contentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!session || !participant || !content) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">Session not found.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const stakeholder = getStakeholderById(participant.stakeholder_group);
  const myGroupMembers = participants.filter(
    p => p.stakeholder_group === participant.stakeholder_group
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">Your Role</h1>
        <span className="font-mono text-sm text-slate-500">{sessionCode}</span>
      </div>

      {/* Role Card */}
      <div className={`p-4 rounded-lg border-l-4 mb-6 ${colorClasses[stakeholder.color]}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{stakeholder.emoji}</span>
          <h2 className="text-xl font-bold text-slate-800">{stakeholder.name}</h2>
        </div>
        <div className="mt-3">
          <p className="text-sm font-medium text-slate-600 mb-2">Your group:</p>
          <GroupMembersList members={myGroupMembers} highlightName={participant.name} />
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-3">
        <Accordion title="📋 Your Role Card" defaultOpen>
          <MarkdownRenderer content={content.roleMarkdown} />
        </Accordion>

        <Accordion title="🎭 Staying in Role">
          <MarkdownRenderer content={content.keyFacts} />
        </Accordion>

        <Accordion title="📖 The Case">
          <MarkdownRenderer content={content.situationBriefing} />
        </Accordion>

        <Accordion title="📅 Schedule">
          <MarkdownRenderer content={content.schedule} />
        </Accordion>

        <Accordion title="👥 All Groups">
          <ParticipantList
            participants={participants}
            activeGroups={session.active_groups}
            maxPerGroup={session.max_per_group}
            highlightName={participant.name}
          />
        </Accordion>
      </div>
    </div>
  );
}
