export default function GroupMembersList({ members, highlightName }) {
  if (!members || members.length === 0) {
    return <p className="text-sm text-slate-400 italic">No members yet</p>;
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
          {member.name === highlightName ? `${member.name} (You)` : member.name}
        </li>
      ))}
    </ul>
  );
}
