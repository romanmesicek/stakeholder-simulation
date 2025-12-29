import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { loadSharedContent } from '../lib/contentLoader';

export default function CasePage() {
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level') || 'master';
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSharedContent(level, 'situationBriefing')
      .then(setContent)
      .finally(() => setLoading(false));
  }, [level]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <BackButton to="/info" label="Back to Info Hub" />
      <div className="mb-4 text-sm text-slate-500">
        Viewing: {level === 'bachelor' ? 'Bachelor' : 'Master'} version
      </div>
      <MarkdownRenderer content={content} />
    </div>
  );
}
