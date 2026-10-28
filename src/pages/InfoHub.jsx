import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { getScenariosArray, SCENARIOS, getLevelMeta } from '../lib/stakeholders';
import { infoPath, isValidInfoTarget } from '../lib/infoPaths';
import { getUiStrings } from '../lib/i18n';
import { useRole } from '../lib/useRole';

const badgeClass = (badge) =>
  badge === 'BA' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700';

function LevelBadge({ scenario, level }) {
  const { badge } = getLevelMeta(scenario, level);
  if (!badge) return null;
  return <span className={`text-xs px-2 py-0.5 rounded-full ${badgeClass(badge)}`}>{badge}</span>;
}

// Step 1 of the info hub: choose the case and, where a case has several
// levels, the level. Everything after this lives under /info/:scenario/:level.
export default function InfoHub() {
  const [searchParams] = useSearchParams();
  const { activeSessionCode, selectedScenario, selectedLevel } = useRole();
  const scenarios = getScenariosArray();

  // Legacy links (/info?scenario=x): single-level cases go straight to their
  // overview; multi-level cases stay here with the case highlighted.
  const legacyScenario = searchParams.get('scenario');
  if (legacyScenario && SCENARIOS[legacyScenario]?.levels.length === 1) {
    return <Navigate to={infoPath(legacyScenario, SCENARIOS[legacyScenario].levels[0])} replace />;
  }

  const hasSession = activeSessionCode && isValidInfoTarget(selectedScenario, selectedLevel);
  const t = getUiStrings(selectedScenario);

  return (
    <div>
      {hasSession && (
        <Link
          to={infoPath(selectedScenario, selectedLevel)}
          lang={SCENARIOS[selectedScenario].language}
          className="block mb-8 p-4 rounded-xl border-2 border-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          <div className="text-xs font-medium uppercase tracking-wide text-blue-700">{t.infoYourSession}</div>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <span className="font-semibold text-slate-800">{SCENARIOS[selectedScenario].name}</span>
            <span className="text-slate-500">· {getLevelMeta(selectedScenario, selectedLevel).label}</span>
            <LevelBadge scenario={selectedScenario} level={selectedLevel} />
          </div>
          <div className="text-sm text-blue-700 mt-1">{t.infoOpenMaterials} →</div>
        </Link>
      )}

      <h1 className="text-sm font-medium text-slate-500 mb-3">
        Choose your case · Fall auswählen
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {scenarios.map(s => {
          const single = s.levels.length === 1;
          const highlighted = legacyScenario === s.id;
          const header = (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-800">{s.name}</span>
                {single && <LevelBadge scenario={s.id} level={s.levels[0]} />}
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                  {s.language === 'de' ? 'DE' : 'EN'}
                </span>
              </div>
              <div className="text-sm text-slate-500 mt-1">{s.description}</div>
            </>
          );
          const frame = `p-4 rounded-xl border-2 text-left transition-all ${
            highlighted ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200'
          }`;

          if (single) {
            return (
              <Link
                key={s.id}
                lang={s.language}
                to={infoPath(s.id, s.levels[0])}
                className={`block ${frame} hover:border-slate-300 hover:bg-slate-50`}
              >
                {header}
                <div className="text-xs text-slate-400 mt-2">{getLevelMeta(s.id, s.levels[0]).description}</div>
              </Link>
            );
          }

          return (
            <div key={s.id} lang={s.language} className={frame}>
              {header}
              <div className="grid gap-2 mt-3">
                {s.levels.map(lvl => {
                  const meta = getLevelMeta(s.id, lvl);
                  return (
                    <Link
                      key={lvl}
                      to={infoPath(s.id, lvl)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <LevelBadge scenario={s.id} level={lvl} />
                      <span className="text-sm font-medium text-slate-800">{meta.label}</span>
                      <span className="text-xs text-slate-500">{meta.description}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
