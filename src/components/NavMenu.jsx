import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../lib/RoleContext';

export default function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { activeSessionCode } = useRole();

  const navItems = [
    { path: '/', label: 'Start' },
    { path: '/info', label: 'Info Hub' },
    // Show My Role when user has joined a session (persisted in context/localStorage)
    ...(activeSessionCode ? [{ path: `/session/${activeSessionCode}`, label: 'My Role' }] : []),
  ];

  return (
    <nav className="relative">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-slate-600 hover:text-slate-800"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Desktop menu */}
      <ul className="hidden md:flex space-x-6">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 md:hidden z-50">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 text-sm ${
                location.pathname === item.path
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
