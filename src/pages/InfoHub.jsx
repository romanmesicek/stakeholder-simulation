import { Link } from 'react-router-dom';
import { getOrderedStakeholders } from '../lib/stakeholders';

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
];

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

export default function InfoHub() {
  const stakeholders = getOrderedStakeholders();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Information Hub</h1>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
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

      <h2 className="text-xl font-bold text-slate-800 mb-4">All Stakeholder Groups</h2>
      <div className="grid gap-3">
        {stakeholders.map((stakeholder) => (
          <div
            key={stakeholder.id}
            className={`p-4 rounded-lg border-l-4 shadow-sm ${colorClasses[stakeholder.color]}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{stakeholder.emoji}</span>
              <div>
                <h3 className="font-medium text-slate-800">{stakeholder.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{stakeholder.shortDescription}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
