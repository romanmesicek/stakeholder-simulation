import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Landing() {
  const navigate = useNavigate();
  const [sessionCode, setSessionCode] = useState('');
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);

  const handleCodeChange = (e) => {
    // Auto-uppercase and limit to 6 chars
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setSessionCode(value);
    setError(null);
  };

  const handleJoin = async (e) => {
    e.preventDefault();

    if (sessionCode.length !== 6) {
      setError('Please enter a 6-character code.');
      return;
    }

    setChecking(true);
    setError(null);

    // Check if session exists
    const { data: session, error: fetchError } = await supabase
      .from('sessions')
      .select('id, status')
      .eq('id', sessionCode)
      .single();

    if (fetchError || !session) {
      setError('Session not found. Check the code and try again.');
      setChecking(false);
      return;
    }

    if (session.status === 'closed') {
      setError('This session is closed.');
      setChecking(false);
      return;
    }

    // Check if already joined
    const participantId = localStorage.getItem(`participant-${sessionCode}`);
    if (participantId) {
      navigate(`/session/${sessionCode}`);
    } else {
      navigate(`/join/${sessionCode}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <span className="text-6xl mb-6">👥</span>
      <h1 className="text-3xl font-bold text-slate-800 mb-4">
        Stakeholder Simulation
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-md">
        Experience multi-stakeholder negotiations firsthand.
      </p>

      <form onSubmit={handleJoin} className="w-full max-w-xs mb-4">
        <input
          type="text"
          value={sessionCode}
          onChange={handleCodeChange}
          placeholder="Enter Session Code"
          className="w-full p-3 text-center font-mono text-lg tracking-wider border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={checking || sessionCode.length !== 6}
          className="w-full mt-3 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {checking ? 'Checking...' : 'Join Session'}
        </button>
      </form>

      <div className="w-full max-w-xs flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-slate-300"></div>
        <span className="text-sm text-slate-400">or</span>
        <div className="flex-1 h-px bg-slate-300"></div>
      </div>

      <Link
        to="/facilitate"
        className="w-full max-w-xs bg-slate-100 text-slate-700 font-medium py-3 px-6 rounded-lg hover:bg-slate-200 transition-colors"
      >
        Manage Sessions
      </Link>
      <p className="text-xs text-slate-400 mt-2">For facilitators</p>
    </div>
  );
}
