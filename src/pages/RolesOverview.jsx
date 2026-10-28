import { Navigate } from 'react-router-dom';
import RoleCard from '../components/RoleCard';
import { getStakeholdersForLevel } from '../lib/stakeholders';
import { infoPath, useInfoParams } from '../lib/infoPaths';
import { getScenarioLanguage } from '../lib/i18n';

export default function RolesOverview() {
  const { scenario, level, valid } = useInfoParams();
  if (!valid) return <Navigate to="/info" replace />;

  const stakeholders = getStakeholdersForLevel(level, scenario);

  return (
    <div lang={getScenarioLanguage(scenario)}>
      <h1 className="text-2xl font-bold text-slate-800 mb-6" lang="en">Select Your Role</h1>
      <div className="grid gap-4">
        {stakeholders.map((stakeholder) => (
          <RoleCard
            key={stakeholder.id}
            stakeholder={stakeholder}
            showDescription
            linkTo={infoPath(scenario, level, `roles/${stakeholder.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
