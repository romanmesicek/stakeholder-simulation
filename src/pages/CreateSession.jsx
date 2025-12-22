import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { generateSessionCode } from '../lib/sessionUtils';
import { getOrderedStakeholders } from '../lib/stakeholders';

const defaultSelected = ['management', 'workers', 'community', 'environmental', 'government'];

export default function CreateSession() {
  const navigate = useNavigate();
  const stakeholders = getOrderedStakeholders();

  const [selectedGroups, setSelectedGroups] = useState(defaultSelected);
  const [maxPerGroup, setMaxPerGroup] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleGroup = (groupId) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedGroups.length < 2) {
      setError('Please select at least 2 groups.');
      return;
    }

    setLoading(true);
    setError(null);

    // Generate unique session code
    let sessionCode = generateSessionCode();
    let attempts = 0;

    while (attempts < 5) {
      const { data: existing } = await supabase
        .from('sessions')
        .select('id')
        .eq('id', sessionCode)
        .single();

      if (!existing) break;
      sessionCode = generateSessionCode();
      attempts++;
    }

    // Create session
    const { error: insertError } = await supabase
      .from('sessions')
      .insert({
        id: sessionCode,
        status: 'open',
        active_groups: selectedGroups,
        max_per_group: maxPerGroup
      });

    if (insertError) {
      setError('Failed to create session. Please try again.');
      setLoading(false);
      return;
    }

    navigate(`/facilitate/${sessionCode}`);
  };

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 mb-6">Create Session</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Select Active Groups
          </label>
          <div className="space-y-2">
            {stakeholders.map(stakeholder => (
              <label
                key={stakeholder.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedGroups.includes(stakeholder.id)}
                  onChange={() => toggleGroup(stakeholder.id)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-xl">{stakeholder.emoji}</span>
                <span className="text-slate-800">{stakeholder.name}</span>
              </label>
            ))}
          </div>
          {selectedGroups.length < 2 && (
            <p className="mt-2 text-sm text-amber-600">
              Select at least 2 groups
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Max participants per group
          </label>
          <select
            value={maxPerGroup}
            onChange={(e) => setMaxPerGroup(Number(e.target.value))}
            className="w-full p-2 border border-slate-300 rounded-lg"
          >
            {[2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || selectedGroups.length < 2}
          className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Session'}
        </button>
      </form>
    </div>
  );
}
