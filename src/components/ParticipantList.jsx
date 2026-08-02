import { getStakeholderById } from '../lib/stakeholders';
import GroupMembersList from './GroupMembersList';

const colorClasses = {
  blue: 'border-blue-400 bg-blue-50',
  amber: 'border-amber-400 bg-amber-50',
  emerald: 'border-emerald-400 bg-emerald-50',
  green: 'border-green-400 bg-green-50',
  purple: 'border-purple-400 bg-purple-50',
  orange: 'border-orange-400 bg-orange-50',
  slate: 'border-slate-400 bg-slate-50',
  cyan: 'border-cyan-400 bg-cyan-50',
};

export default function ParticipantList({
  participants,
  activeGroups,
  maxPerGroup,
  highlightName,
  scenario = 'energy-transition',
  // Facilitator-only: when provided, members get move/remove controls
  onMoveParticipant,
  onRemoveParticipant,
}) {
  const editable = Boolean(onMoveParticipant && onRemoveParticipant);

  // Group participants by stakeholder group
  const grouped = {};
  activeGroups.forEach(groupId => {
    grouped[groupId] = participants.filter(p => p.stakeholder_group === groupId);
  });

  return (
    <div className="space-y-3">
      {activeGroups.map(groupId => {
        const stakeholder = getStakeholderById(groupId, scenario);
        if (!stakeholder) return null;

        const members = grouped[groupId] || [];
        const count = members.length;
        const overfull = count > maxPerGroup;

        return (
          <div
            key={groupId}
            className={`p-3 rounded-lg border-l-4 ${colorClasses[stakeholder.color] || colorClasses.slate}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{stakeholder.emoji}</span>
                <span className="font-medium text-slate-800">{stakeholder.name}</span>
              </div>
              <span className={`text-sm ${overfull ? 'font-semibold text-red-600' : 'text-slate-500'}`}>
                {count}/{maxPerGroup}
              </span>
            </div>
            {editable ? (
              members.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No members yet</p>
              ) : (
                <ul className="space-y-2">
                  {members.map(member => (
                    <li key={member.id} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-slate-600">{member.name}</span>
                      <div className="flex items-center gap-1">
                        <select
                          value={member.stakeholder_group}
                          onChange={(e) => onMoveParticipant(member, e.target.value)}
                          aria-label={`Move ${member.name} to another group`}
                          className="text-xs border border-slate-300 rounded-md py-1.5 pl-2 pr-6 bg-white text-slate-600 max-w-[140px]"
                        >
                          {activeGroups.map(g => (
                            <option key={g} value={g}>
                              {getStakeholderById(g, scenario)?.name || g}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => onRemoveParticipant(member)}
                          aria-label={`Remove ${member.name}`}
                          title={`Remove ${member.name}`}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <GroupMembersList members={members} highlightName={highlightName} scenario={scenario} />
            )}
          </div>
        );
      })}
    </div>
  );
}
