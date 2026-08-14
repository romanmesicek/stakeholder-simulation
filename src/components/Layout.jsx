import { Link, Outlet, useLocation } from 'react-router-dom';
import NavMenu from './NavMenu';
import { version } from '../../package.json';

export default function Layout() {
  const isLanding = useLocation().pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          {isLanding ? (
            <span />
          ) : (
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <h1 className="text-lg font-semibold text-slate-800">
                Stakeholder Simulation
              </h1>
            </Link>
          )}
          <NavMenu />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* break-words + hyphens-auto inherit into all pages; hyphenation
            language follows the nearest lang attribute set per page. */}
        <div className="max-w-4xl mx-auto px-4 py-6 break-words hyphens-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-center gap-3 flex-wrap text-sm text-slate-500">
          <span>v{version}</span>
          <span className="text-slate-300">·</span>
          <Link to="/impressum" className="hover:text-slate-700">
            Impressum
          </Link>
          <span className="text-slate-300">·</span>
          <a
            href="https://github.com/romanmesicek/stakeholder-simulation"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-700"
            aria-label="Source code on GitHub"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
