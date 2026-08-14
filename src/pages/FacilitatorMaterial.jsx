import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { loadFacilitatorContent, loadSharedContent } from '../lib/contentLoader';
import { SCENARIOS } from '../lib/stakeholders';
import { getScenarioLanguage } from '../lib/i18n';
import { MATERIAL_META } from '../lib/materialMeta';
import MarkdownRenderer from '../components/MarkdownRenderer';
import BackButton from '../components/BackButton';
import Loading from '../components/Loading';

export default function FacilitatorMaterial() {
  const { contentKey } = useParams();
  const [searchParams] = useSearchParams();
  const scenario = searchParams.get('scenario') || 'energy-transition';
  const level = searchParams.get('level') || SCENARIOS[scenario]?.defaultLevel || 'master';

  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const lang = getScenarioLanguage(scenario);
  const isGerman = lang === 'de';
  const title = MATERIAL_META[contentKey]?.label[lang];

  useEffect(() => {
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        let result;
        if (contentKey === 'debriefing') {
          result = await loadSharedContent(scenario, level, 'debriefing');
        } else {
          result = await loadFacilitatorContent(scenario, level, contentKey);
        }
        setContent(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [scenario, level, contentKey]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Content not available.</p>
        <Link to="/facilitate" className="text-blue-600 hover:underline">
          Back to Facilitator Home
        </Link>
      </div>
    );
  }

  return (
    <div lang={lang}>
      <BackButton to="/facilitate" label={isGerman ? 'Zurück' : 'Back'} />

      <div className="mb-6">
        <p className="text-sm text-slate-500">
          {SCENARIOS[scenario]?.name}
          {' · '}
          {isGerman ? 'Spielleitung' : 'Facilitator Materials'}
        </p>
        {title && <h1 className="text-2xl font-bold text-slate-800">{title}</h1>}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <MarkdownRenderer content={content} lang={lang} />
      </div>
    </div>
  );
}
