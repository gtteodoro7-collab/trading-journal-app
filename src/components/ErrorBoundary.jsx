// @ts-nocheck
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // Log to console for developer
    // You can also send to external logging here
    console.error(error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">Algo deu errado</h2>
            <p className="text-sm text-slate-400 mb-4">O aplicativo encontrou um erro. Você pode recarregar a página ou copiar o erro abaixo para suporte.</p>
            <pre className="text-xs bg-slate-800 p-3 rounded overflow-auto max-h-40">{String(this.state.error)}</pre>
            <div className="mt-4 flex gap-2">
              <button
                className="bg-emerald-600 px-3 py-2 rounded"
                onClick={() => window.location.reload()}
              >
                Recarregar
              </button>
              <button
                className="bg-slate-700 px-3 py-2 rounded"
                onClick={() => {
                  const text = String(this.state.error) + '\n' + (this.state.info?.componentStack || '');
                  if (navigator.clipboard) navigator.clipboard.writeText(text);
                }}
              >
                Copiar erro
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
