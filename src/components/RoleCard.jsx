import { Link } from 'react-router-dom';

const colorClasses = {
  blue: 'border-blue-400 bg-blue-50 hover:bg-blue-100',
  amber: 'border-amber-400 bg-amber-50 hover:bg-amber-100',
  emerald: 'border-emerald-400 bg-emerald-50 hover:bg-emerald-100',
  green: 'border-green-400 bg-green-50 hover:bg-green-100',
  purple: 'border-purple-400 bg-purple-50 hover:bg-purple-100',
  orange: 'border-orange-400 bg-orange-50 hover:bg-orange-100',
  slate: 'border-slate-400 bg-slate-50 hover:bg-slate-100',
  cyan: 'border-cyan-400 bg-cyan-50 hover:bg-cyan-100',
};

export default function RoleCard({ stakeholder }) {
  const { id, name, emoji, color } = stakeholder;

  return (
    <Link
      to={`/info/roles/${id}`}
      className={`block p-4 rounded-lg border-l-4 shadow-sm transition-colors ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{emoji}</span>
        <h3 className="font-medium text-slate-800">{name}</h3>
      </div>
    </Link>
  );
}
