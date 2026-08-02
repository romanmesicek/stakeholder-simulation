import { useParams, Link } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { SCENARIOS, getStakeholderById, getLevelMeta } from '../lib/stakeholders';
import RoleCard from '../components/RoleCard';
import BackButton from '../components/BackButton';
import Loading from '../components/Loading';

export default function FacilitatorRoles() {
  const { sessionCode } = useParams();
  const { session, loading } = useSession(sessionCode);

  if (loading) {
    return <Loading />;
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">Session not found.</p>
        <Link to="/facilitate" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>
    );
  }

  const scenario = session.scenario;
  const level = session.education_level;
  // Only the groups actually active in this session
  const activeStakeholders = session.active_groups
    .map(groupId => getStakeholderById(groupId, scenario))
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  return (
    <div>
      <BackButton to={`/facilitate/${sessionCode}`} label="Back to Session" />

      <h1 className="text-2xl font-bold text-slate-800 mb-2">Role Cards</h1>
      <p className="text-sm text-slate-500 mb-6">
        {SCENARIOS[scenario]?.name} · {getLevelMeta(scenario, level).label}
      </p>

      <div className="grid gap-4">
        {activeStakeholders.map((stakeholder) => (
          <RoleCard
            key={stakeholder.id}
            stakeholder={stakeholder}
            showDescription
            linkTo={`/info/roles/${stakeholder.id}?scenario=${scenario}&level=${level}`}
          />
        ))}
      </div>
    </div>
  );
}
