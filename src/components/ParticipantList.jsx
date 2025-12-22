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

export default function ParticipantList({ participants, activeGroups, maxPerGroup, highlightName }) {
  // Group participants by stakeholder group
  const grouped = {};
  activeGroups.forEach(groupId => {
    grouped[groupId] = participants.filter(p => p.stakeholder_group === groupId);
  });

  return (
    <div className="space-y-3">
      {activeGroups.map(groupId => {
        const stakeholder = getStakeholderById(groupId);
        if (!stakeholder) return null;

        const members = grouped[groupId] || [];
        const count = members.length;

        return (
          <div
            key={groupId}
            className={`p-3 rounded-lg border-l-4 ${colorClasses[stakeholder.color]}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{stakeholder.emoji}</span>
                <span className="font-medium text-slate-800">{stakeholder.name}</span>
              </div>
              <span className="text-sm text-slate-500">
                {count}/{maxPerGroup}
              </span>
            </div>
            <GroupMembersList members={members} highlightName={highlightName} />
          </div>
        );
      })}
    </div>
  );
}
