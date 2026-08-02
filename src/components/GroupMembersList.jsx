import { getUiStrings } from '../lib/i18n';

export default function GroupMembersList({ members, highlightName, scenario }) {
  const t = getUiStrings(scenario);

  if (!members || members.length === 0) {
    return <p className="text-sm text-slate-500 italic">{t.noMembersYet}</p>;
  }

  return (
    <ul className="space-y-1">
      {members.map((member) => (
        <li
          key={member.id}
          className={`text-sm ${
            member.name === highlightName
              ? 'font-medium text-blue-600'
              : 'text-slate-600'
          }`}
        >
          {member.name === highlightName ? `${member.name} ${t.youSuffix}` : member.name}
        </li>
      ))}
    </ul>
  );
}
