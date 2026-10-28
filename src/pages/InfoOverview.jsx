import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { SCENARIOS, getLevelMeta, getStakeholdersForLevel } from '../lib/stakeholders';
import { infoPath, useInfoParams, getInfoLabels } from '../lib/infoPaths';
import { getUiStrings } from '../lib/i18n';
import { useRole } from '../lib/useRole';

// Step 2 of the info hub: the materials of exactly one case and level.
export default function InfoOverview() {
  const { scenario, level, valid } = useInfoParams();
  const { activeSessionCode, setSelectedScenario } = useRole();

  // Browsing a case adopts its language for the nav, unless a joined session
  // owns the scenario selection (it drives "My Role").
  useEffect(() => {
    if (valid && !activeSessionCode) setSelectedScenario(scenario);
  }, [valid, activeSessionCode, scenario, setSelectedScenario]);

  if (!valid) return <Navigate to="/info" replace />;

  const scenarioData = SCENARIOS[scenario];
  const meta = getLevelMeta(scenario, level);
  const l = getInfoLabels(scenario);
  const t = getUiStrings(scenario);
  const groupCount = getStakeholdersForLevel(level, scenario).length;

  const infoCards = [
    { sub: 'case', emoji: '📋', ...l.case, color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
    { sub: 'schedule', emoji: '📅', ...l.schedule, color: 'bg-purple-50 border-purple-200 hover:bg-purple-100' },
    {
      sub: 'stakeholders', emoji: '👥', title: l.stakeholders.title,
      description: `${l.stakeholders.description} (${groupCount})`,
      color: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    },
    { sub: 'reference', emoji: '📊', ...l.reference, color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
  ];

  return (
    <div lang={scenarioData.language}>
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold text-slate-800">{scenarioData.name}</h1>
          {meta.badge && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              meta.badge === 'BA' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'
            }`}>
              {meta.badge}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 mt-1">
          {l.hubTitle} · {meta.label}
          {meta.description && ` · ${meta.description}`}
        </p>
        <Link to="/info" className="inline-block text-sm text-blue-600 hover:text-blue-700 mt-2">
          {t.infoChangeCase}
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {infoCards.map((card) => (
          <Link
            key={card.sub}
            to={infoPath(scenario, level, card.sub)}
            className={`block p-4 rounded-lg border shadow-sm transition-colors ${card.color}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{card.emoji}</span>
              <div>
                <h2 className="font-semibold text-slate-800">{card.title}</h2>
                <p className="text-sm text-slate-600 mt-1">{card.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
