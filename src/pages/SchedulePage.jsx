import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Loading from '../components/Loading';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { loadSharedContent } from '../lib/contentLoader';
import { resolveLevel } from '../lib/stakeholders';
import { getScenarioLanguage } from '../lib/i18n';
import { useRole } from '../lib/useRole';

export default function SchedulePage() {
  const [searchParams] = useSearchParams();
  const { selectedScenario, selectedLevel } = useRole();
  const scenario = searchParams.get('scenario') || selectedScenario || 'energy-transition';
  const level = resolveLevel(scenario, searchParams.get('level'), selectedScenario, selectedLevel);
  // Loading is derived: content counts as stale until it matches the current
  // scenario/level key — no synchronous setState inside the effect.
  const contentKey = `${scenario}/${level}`;
  const [loaded, setLoaded] = useState({ key: null, content: null });
  const loading = loaded.key !== contentKey;
  const content = loading ? null : loaded.content;
  const isGerman = getScenarioLanguage(scenario) === 'de';

  useEffect(() => {
    let active = true;
    loadSharedContent(scenario, level, 'schedule')
      .then(c => { if (active) setLoaded({ key: contentKey, content: c }); })
      .catch(() => { if (active) setLoaded({ key: contentKey, content: null }); });
    return () => { active = false; };
  }, [scenario, level, contentKey]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div lang={getScenarioLanguage(scenario)}>
      <BackButton to={`/info?scenario=${scenario}`} label={isGerman ? 'Zurück' : 'Back to Info Hub'} />
      <MarkdownRenderer content={content} lang={getScenarioLanguage(scenario)} />
    </div>
  );
}
