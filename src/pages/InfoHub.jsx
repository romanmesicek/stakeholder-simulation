import { Link, useSearchParams } from 'react-router-dom';
import { getScenariosArray, SCENARIOS, resolveLevel, getLevelMeta } from '../lib/stakeholders';
import { useRole } from '../lib/useRole';

const labels = {
  'energy-transition': {
    hubTitle: 'Information Hub',
    case: { title: 'The Case', description: 'Read the full situation briefing and background' },
    schedule: { title: 'Schedule', description: 'Simulation timeline and process steps' },
    stakeholders: { title: 'Stakeholder Groups', description: 'Overview of all stakeholder groups' },
    reference: { title: 'Reference Materials', description: 'Key facts and reference information' },
  },
  'talstadt': {
    hubTitle: 'Informationen',
    case: { title: 'Die Fallstudie', description: 'Hintergrund und Ausgangssituation in Talstadt' },
    schedule: { title: 'Spielablauf', description: 'Zeitplan, Phasen und Hinweise zum Planspiel' },
    stakeholders: { title: 'Interessengruppen', description: 'Übersicht aller Gruppen im Planspiel' },
    reference: { title: 'Informationsmaterialien', description: 'Fakten, Gutachten und Gesetze' },
  },
  'data-centers': {
    hubTitle: 'Information Hub',
    case: { title: 'The Case', description: 'The Falkenberg situation briefing and background' },
    schedule: { title: 'Schedule', description: 'Simulation timeline, phases and the permit rules' },
    stakeholders: { title: 'Stakeholder Groups', description: 'Overview of all stakeholder groups' },
    reference: { title: 'Key Facts & Reference', description: 'The shared fact sheet all parties can cite — and contest' },
  },
};

const defaultLabels = labels['energy-transition'];

export default function InfoHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedScenario, setSelectedScenario, selectedLevel } = useRole();
  const scenario = searchParams.get('scenario') || selectedScenario || 'energy-transition';
  const scenarioData = SCENARIOS[scenario];
  const level = resolveLevel(scenario, null, selectedScenario, selectedLevel);
  const scenarios = getScenariosArray();
  const l = labels[scenario] || defaultLabels;

  const handleScenarioChange = (newScenario) => {
    setSelectedScenario(newScenario);
    setSearchParams({ scenario: newScenario });
  };

  const queryString = `?scenario=${scenario}&level=${level}`;
  const groupCount = Object.keys(scenarioData?.groups || {}).length;

  const infoCards = [
    {
      path: `/info/case${queryString}`,
      emoji: '📋',
      title: l.case.title,
      description: l.case.description,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    },
    {
      path: `/info/schedule${queryString}`,
      emoji: '📅',
      title: l.schedule.title,
      description: l.schedule.description,
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    },
    {
      path: `/info/stakeholders${queryString}`,
      emoji: '👥',
      title: l.stakeholders.title,
      description: `${l.stakeholders.description} (${groupCount})`,
      color: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    },
    {
      path: `/info/reference${queryString}`,
      emoji: '🎭',
      title: l.reference.title,
      description: l.reference.description,
      color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    },
  ];

  return (
    <div>
      {/* Scenario Picker */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-slate-500 mb-3">
          Choose your case · Fall auswählen
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {scenarios.map(s => (
            <button
              key={s.id}
              lang={s.language}
              onClick={() => handleScenarioChange(s.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                scenario === s.id
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-800">{s.name}</span>
                {s.levels.map(lvl => {
                  const badge = getLevelMeta(s.id, lvl).badge;
                  if (!badge) return null;
                  return (
                    <span
                      key={lvl}
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        badge === 'BA'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {badge}
                    </span>
                  );
                })}
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                  {s.language === 'de' ? 'DE' : 'EN'}
                </span>
              </div>
              <div className="text-sm text-slate-500 mt-1">{s.description}</div>
              <div className="text-xs text-slate-400 mt-2">
                {Object.keys(s.groups).length} {s.language === 'de' ? 'Gruppen' : 'groups'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <h1 className="text-2xl font-bold text-slate-800 mb-4" lang={scenarioData?.language}>{l.hubTitle}</h1>

      <div className="grid gap-4 sm:grid-cols-2" lang={scenarioData?.language}>
        {infoCards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
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
