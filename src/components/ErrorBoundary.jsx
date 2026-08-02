import { Component } from 'react';

// A render error must never white-screen a phone mid-class:
// show a bilingual fallback with a reload button instead.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
          <span className="text-5xl mb-4">😵</span>
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            Something went wrong · Etwas ist schiefgelaufen
          </h1>
          <p className="text-slate-600 mb-6 max-w-md">
            Please reload the page. · Bitte lade die Seite neu.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload · Neu laden
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
