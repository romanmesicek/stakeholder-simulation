import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Loading from '../components/Loading';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { loadSharedContent } from '../lib/contentLoader';
import { infoPath, useInfoParams } from '../lib/infoPaths';
import { getScenarioLanguage, getUiStrings } from '../lib/i18n';

// One shared markdown file of a case/level: situationBriefing, schedule or keyFacts.
export default function InfoContentPage({ contentKey }) {
  const { scenario, level, valid } = useInfoParams();
  // Loading is derived: content counts as stale until it matches the current
  // scenario/level/content key — no synchronous setState inside the effect.
  const loadKey = `${scenario}/${level}/${contentKey}`;
  const [loaded, setLoaded] = useState({ key: null, content: null });
  const loading = loaded.key !== loadKey;
  const content = loading ? null : loaded.content;

  useEffect(() => {
    if (!valid) return;
    let active = true;
    loadSharedContent(scenario, level, contentKey)
      .then(c => { if (active) setLoaded({ key: loadKey, content: c }); })
      .catch(() => { if (active) setLoaded({ key: loadKey, content: null }); });
    return () => { active = false; };
  }, [valid, scenario, level, contentKey, loadKey]);

  if (!valid) return <Navigate to="/info" replace />;
  if (loading) return <Loading />;

  const lang = getScenarioLanguage(scenario);
  return (
    <div lang={lang}>
      <BackButton to={infoPath(scenario, level)} label={getUiStrings(scenario).infoBackToOverview} />
      <MarkdownRenderer content={content} lang={lang} />
    </div>
  );
}
