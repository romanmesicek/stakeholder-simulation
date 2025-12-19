import BackButton from '../components/BackButton';
import RoleCard from '../components/RoleCard';
import { getOrderedStakeholders } from '../lib/stakeholders';

export default function RolesOverview() {
  const stakeholders = getOrderedStakeholders();

  return (
    <div>
      <BackButton to="/info" label="Back to Info Hub" />
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Stakeholder Roles</h1>
      <div className="grid gap-4">
        {stakeholders.map((stakeholder) => (
          <RoleCard key={stakeholder.id} stakeholder={stakeholder} />
        ))}
      </div>
    </div>
  );
}
