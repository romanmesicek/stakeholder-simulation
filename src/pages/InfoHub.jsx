import { Link } from 'react-router-dom';

const infoCards = [
  {
    path: '/info/case',
    emoji: '📋',
    title: 'The Case',
    description: 'Read the full situation briefing and background',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
  },
  {
    path: '/info/reference',
    emoji: '📊',
    title: 'Quick Reference',
    description: 'Key facts and figures at a glance',
    color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
  },
  {
    path: '/info/schedule',
    emoji: '📅',
    title: 'Schedule',
    description: 'Simulation timeline and process steps',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
  },
  {
    path: '/info/roles',
    emoji: '👥',
    title: 'All Roles',
    description: 'Explore all 8 stakeholder groups',
    color: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
  },
];

export default function InfoHub() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Information Hub</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {infoCards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className={`block p-4 rounded-lg border shadow-sm transition-colors ${card.color}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{card.emoji}</span>
              <div>
                <h2 className="font-semibold text-slate-800">{card.title}</h2>
                <p className="text-sm text-slate-600 mt-1">{card.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
