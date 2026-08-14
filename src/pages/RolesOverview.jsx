import { useSearchParams } from 'react-router-dom';
import RoleCard from '../components/RoleCard';
import { getOrderedStakeholders } from '../lib/stakeholders';
import { useRole } from '../lib/RoleContext';
import { getScenarioLanguage } from '../lib/i18n';

export default function RolesOverview() {
  const [searchParams] = useSearchParams();
  const { selectedScenario } = useRole();
  const scenario = searchParams.get('scenario') || selectedScenario || 'energy-transition';
  const stakeholders = getOrderedStakeholders(scenario);

  return (
    <div lang={getScenarioLanguage(scenario)}>
      <h1 className="text-2xl font-bold text-slate-800 mb-6" lang="en">Select Your Role</h1>
      <div className="grid gap-4">
        {stakeholders.map((stakeholder) => (
          <RoleCard key={stakeholder.id} stakeholder={stakeholder} showDescription />
        ))}
      </div>
    </div>
  );
}
