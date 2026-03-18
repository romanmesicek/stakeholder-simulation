import { useParams, Link } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { SCENARIOS, getOrderedStakeholders } from '../lib/stakeholders';
import RoleCard from '../components/RoleCard';

export default function FacilitatorRoles() {
  const { sessionCode } = useParams();
  const { session, loading } = useSession(sessionCode);

  if (loading) {
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
        <Link to="/facilitate" className="text-blue-600 hover:underline">
          Back
        </Link>
      </div>
    );
  }

  const scenario = session.scenario || 'energy-transition';
  const level = session.education_level || SCENARIOS[scenario]?.defaultLevel || 'master';
  const allGroups = getOrderedStakeholders(scenario);

  return (
    <div>
      <Link
        to={`/facilitate/${sessionCode}`}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Session
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 mb-2">Role Cards</h1>
      <p className="text-sm text-slate-500 mb-6">
        {SCENARIOS[scenario]?.name} · {level.charAt(0).toUpperCase() + level.slice(1)}
      </p>

      <div className="grid gap-4">
        {allGroups.map((stakeholder) => (
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
