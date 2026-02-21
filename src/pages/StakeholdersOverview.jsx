import { useSearchParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { getOrderedStakeholders, SCENARIOS } from '../lib/stakeholders';
import { useRole } from '../lib/RoleContext';

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

export default function StakeholdersOverview() {
  const [searchParams] = useSearchParams();
  const { selectedScenario } = useRole();
  const scenario = searchParams.get('scenario') || selectedScenario || 'energy-transition';
  const stakeholders = getOrderedStakeholders(scenario);
  const isGerman = scenario === 'talstadt';

  return (
    <div>
      <BackButton to={`/info?scenario=${scenario}`} label={isGerman ? 'Zurück' : 'Back to Info Hub'} />
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        {isGerman ? 'Alle Interessengruppen' : 'All Stakeholder Groups'}
      </h1>
      <div className="grid gap-3">
        {stakeholders.map((stakeholder) => (
          <div
            key={stakeholder.id}
            className={`p-4 rounded-lg border-l-4 shadow-sm ${colorClasses[stakeholder.color]}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{stakeholder.emoji}</span>
              <div>
                <h3 className="font-medium text-slate-800">{stakeholder.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{stakeholder.shortDescription}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
