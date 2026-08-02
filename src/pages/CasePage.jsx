import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { loadSharedContent } from '../lib/contentLoader';
import { resolveLevel } from '../lib/stakeholders';
import { useRole } from '../lib/RoleContext';

export default function CasePage() {
  const [searchParams] = useSearchParams();
  const { selectedScenario, selectedLevel } = useRole();
  const scenario = searchParams.get('scenario') || selectedScenario || 'energy-transition';
  const level = resolveLevel(scenario, searchParams.get('level'), selectedScenario, selectedLevel);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const isGerman = scenario === 'talstadt';

  useEffect(() => {
    setLoading(true);
    loadSharedContent(scenario, level, 'situationBriefing')
      .then(setContent)
      .finally(() => setLoading(false));
  }, [scenario, level]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <BackButton to={`/info?scenario=${scenario}`} label={isGerman ? 'Zurück' : 'Back to Info Hub'} />
      <MarkdownRenderer content={content} />
    </div>
  );
}
