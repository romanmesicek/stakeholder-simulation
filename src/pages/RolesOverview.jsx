import RoleCard from '../components/RoleCard';
import { getOrderedStakeholders } from '../lib/stakeholders';

export default function RolesOverview() {
  const stakeholders = getOrderedStakeholders();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Select Your Role</h1>
      <div className="grid gap-4">
        {stakeholders.map((stakeholder) => (
          <RoleCard key={stakeholder.id} stakeholder={stakeholder} showDescription />
        ))}
      </div>
    </div>
  );
}
