import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { getStakeholderById } from '../lib/stakeholders';
import { useRole } from '../lib/RoleContext';
import { loadRoleContent } from '../lib/contentLoader';

export default function RoleDetail() {
  const { roleId } = useParams();
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level') || 'master';
  const { selectedRoleId, setSelectedRoleId } = useRole();
  const stakeholder = getStakeholderById(roleId);
  const isMyRole = selectedRoleId === roleId;

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [roleId]);

  useEffect(() => {
    if (!roleId) return;

    setLoading(true);
    loadRoleContent(level, roleId)
      .then(setContent)
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [roleId, level]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!stakeholder || !content) {
    return (
      <div>
        <p className="text-slate-600">Role not found for this level.</p>
      </div>
    );
  }

  const handleSelectRole = () => {
    setSelectedRoleId(roleId);
  };

  const handleClearRole = () => {
    setSelectedRoleId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{stakeholder.emoji}</span>
          <h1 className="text-2xl font-bold text-slate-800">{stakeholder.name}</h1>
        </div>
        {isMyRole ? (
          <button
            onClick={handleClearRole}
            className="text-sm px-3 py-1.5 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
          >
            Clear selection
          </button>
        ) : (
          <button
            onClick={handleSelectRole}
            className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Select as my role
          </button>
        )}
      </div>
      <MarkdownRenderer content={content} />
    </div>
  );
}
