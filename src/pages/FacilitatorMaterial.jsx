import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { loadFacilitatorContent, loadSharedContent } from '../lib/contentLoader';
import { SCENARIOS } from '../lib/stakeholders';
import MarkdownRenderer from '../components/MarkdownRenderer';

const CONTENT_META = {
  eventCards: {
    titleDe: 'Ereigniskarten',
    titleEn: 'Event Cards',
  },
  debriefing: {
    titleDe: 'Auswertungsfragen',
    titleEn: 'Debriefing Guide',
  },
};

export default function FacilitatorMaterial() {
  const { contentKey } = useParams();
  const [searchParams] = useSearchParams();
  const scenario = searchParams.get('scenario') || 'energy-transition';
  const level = searchParams.get('level') || SCENARIOS[scenario]?.defaultLevel || 'master';

  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const isGerman = scenario === 'talstadt';
  const meta = CONTENT_META[contentKey] || {};
  const title = isGerman ? meta.titleDe : meta.titleEn;

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
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
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
    <div>
      <Link
        to="/facilitate"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {isGerman ? 'Zurück' : 'Back'}
      </Link>

      <div className="mb-6">
        <p className="text-sm text-slate-500">
          {SCENARIOS[scenario]?.name}
          {' · '}
          {isGerman ? 'Spielleitung' : 'Facilitator Materials'}
        </p>
        {title && <h1 className="text-2xl font-bold text-slate-800">{title}</h1>}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}
