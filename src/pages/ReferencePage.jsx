import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Loading from '../components/Loading';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { loadSharedContent } from '../lib/contentLoader';
import { resolveLevel } from '../lib/stakeholders';
import { getScenarioLanguage } from '../lib/i18n';
import { useRole } from '../lib/RoleContext';

export default function ReferencePage() {
  const [searchParams] = useSearchParams();
  const { selectedScenario, selectedLevel } = useRole();
  const scenario = searchParams.get('scenario') || selectedScenario || 'energy-transition';
  const level = resolveLevel(scenario, searchParams.get('level'), selectedScenario, selectedLevel);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const isGerman = getScenarioLanguage(scenario) === 'de';

  useEffect(() => {
    setLoading(true);
    loadSharedContent(scenario, level, 'keyFacts')
      .then(setContent)
      .finally(() => setLoading(false));
  }, [scenario, level]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <BackButton to={`/info?scenario=${scenario}`} label={isGerman ? 'Zurück' : 'Back to Info Hub'} />
      <MarkdownRenderer content={content} />
    </div>
  );
}
