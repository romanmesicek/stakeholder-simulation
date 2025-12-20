import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <span className="text-6xl mb-6">👥</span>
      <h1 className="text-3xl font-bold text-slate-800 mb-4">
        Stakeholder Simulation
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-md">
        Experience multi-stakeholder negotiations firsthand. Take on a role, defend your interests, and find common ground in complex real-world scenarios.
      </p>
      <p className="text-sm text-slate-500 mb-8 max-w-sm">
        Current case: Energy Transition — negotiating the shift from coal to renewable energy.
      </p>
      <Link
        to="/info"
        className="w-full max-w-xs bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Enter Simulation
      </Link>
    </div>
  );
}
