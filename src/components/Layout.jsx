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
        <div className="max-w-4xl mx-auto px-4 py-6">
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
            className="inline-flex items-center gap-1.5 hover:text-slate-700"
            aria-label="Source code on GitHub"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            GitHub
          </a>
          <span className="text-slate-300">·</span>
          <a
            href="https://mesicek.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-700"
          >
            mesicek.com
          </a>
        </div>
      </footer>
    </div>
  );
}
