import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { isFacilitatorUnlocked, unlockFacilitator } from '../lib/facilitatorAccess';

// Layout route: renders the nested facilitator pages only after the shared
// access code has been entered once on this device.
export default function FacilitatorGate() {
  const [unlocked, setUnlocked] = useState(isFacilitatorUnlocked);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  if (unlocked) return <Outlet />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChecking(true);
    setError(false);
    const ok = await unlockFacilitator(code);
    setChecking(false);
    if (ok) {
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <span className="text-5xl mb-4">🔒</span>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Facilitator Area</h1>
      <p className="text-slate-600 mb-6 max-w-sm">
        This area contains confidential game materials (role overviews, event
        cards, deal-space notes). Enter the facilitator access code once to
        unlock it on this device.
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          placeholder="Access code"
          aria-label="Facilitator access code"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
          className="w-full p-3 text-center font-mono text-lg tracking-wider border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
        />
        {error && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            Wrong code. Please try again.
          </p>
        )}
        <button
          type="submit"
          disabled={checking || code.trim().length === 0}
          className="w-full mt-3 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {checking ? 'Checking…' : 'Unlock'}
        </button>
      </form>
      <p className="text-xs text-slate-500 mt-4 max-w-xs">
        No code? Ask the person running your course or workshop.
      </p>
    </div>
  );
}
