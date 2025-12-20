import { Link, Outlet } from 'react-router-dom';
import NavMenu from './NavMenu';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">👥</span>
            <h1 className="text-lg font-semibold text-slate-800">
              Stakeholder Simulation
            </h1>
          </Link>
          <NavMenu />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-slate-500">
          Stakeholder Simulation
        </div>
      </footer>
    </div>
  );
}
