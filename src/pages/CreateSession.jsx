import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { generateSessionCode } from '../lib/sessionUtils';
import { generateOwnerKey, saveFacilitatorKey } from '../lib/facilitatorKeys';
import { SCENARIOS, getScenariosArray, getStakeholdersForLevel, getDefaultGroupsForLevel } from '../lib/stakeholders';

export default function CreateSession() {
  const navigate = useNavigate();

  const [scenario, setScenario] = useState('energy-transition');
  const scenarioData = SCENARIOS[scenario];
  const hasMultipleLevels = scenarioData.levels.length > 1;

  const [educationLevel, setEducationLevel] = useState(scenarioData.defaultLevel);
  const [selectedGroups, setSelectedGroups] = useState(getDefaultGroupsForLevel(educationLevel, scenario));
  const [maxPerGroup, setMaxPerGroup] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const stakeholders = getStakeholdersForLevel(educationLevel, scenario);

  // Update level and groups when scenario changes
  useEffect(() => {
    const newScenario = SCENARIOS[scenario];
    const newLevel = newScenario.defaultLevel;
    setEducationLevel(newLevel);
    setSelectedGroups(getDefaultGroupsForLevel(newLevel, scenario));
  }, [scenario]);

  // Update selected groups when education level changes
  useEffect(() => {
    setSelectedGroups(getDefaultGroupsForLevel(educationLevel, scenario));
  }, [educationLevel, scenario]);

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

    const ownerKey = generateOwnerKey();

    // Create via RPC; retry with a fresh code on the (rare) code collision
    let created = false;
    let sessionCode;
    for (let attempts = 0; attempts < 5 && !created; attempts++) {
      sessionCode = generateSessionCode();
      const { error: rpcError } = await supabase.rpc('create_session', {
        p_id: sessionCode,
        p_scenario: scenario,
        p_education_level: educationLevel,
        p_active_groups: selectedGroups,
        p_max_per_group: maxPerGroup,
        p_owner_key: ownerKey,
      });

      if (!rpcError) {
        created = true;
      } else if (!rpcError.message?.includes('duplicate key')) {
        setError('Failed to create session. Please try again.');
        setLoading(false);
        return;
      }
    }

    if (!created) {
      setError('Failed to create session. Please try again.');
      setLoading(false);
      return;
    }

    // The key authorizes closing/deleting the session and managing
    // participants; it lives in this browser's localStorage.
    saveFacilitatorKey(sessionCode, ownerKey);

    navigate(`/facilitate/${sessionCode}`);
  };

  const scenarios = getScenariosArray();

  return (
    <div>
      <Link
        to="/facilitate"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Sessions
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 mb-6">Create Session</h1>

      <form onSubmit={handleSubmit}>
        {/* Scenario Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Scenario
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scenarios.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setScenario(s.id)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  scenario === s.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-medium text-slate-800">{s.name}</div>
                <div className="text-sm text-slate-500 mt-1">{s.description}</div>
                <div className="text-xs text-slate-400 mt-2">
                  {Object.keys(s.groups).length} groups
                  {s.levels.length > 1 && ` · ${s.levels.join(' / ')}`}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Level Selection - only show if scenario has multiple levels */}
        {hasMultipleLevels && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Education Level
            </label>
            <div className="grid grid-cols-2 gap-4">
              {scenarioData.levels.map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setEducationLevel(level)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    educationLevel === level
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-medium text-slate-800 capitalize">{level}</div>
                  <div className="text-sm text-slate-500">
                    {level === 'bachelor' && '~2 hours, 6 groups, simplified'}
                    {level === 'master' && '~3 hours, 8 groups, full complexity'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

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
