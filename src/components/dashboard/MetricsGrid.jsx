import React from "react";

export default function MetricsGrid({ trades = [], settings = {} }) {
  const hasTrades = Array.isArray(trades) && trades.length > 0;

  // Default values for a fresh account (no trades)
  const defaults = {
    net: '$0.00',
    netPct: '0.00%',
    winrate: '0.0%',
    profitFactor: '-',
    expectancy: '$0.00',
    maxdraw: '0.00%',
    best: '$0.00',
    worst: '$0.00',
    rr: '-',
  };

  // TODO: replace with real calculations when trades exist
  const metrics = [
    { key: 'net', title: 'Lucro Líquido', value: hasTrades ? '+$250.00' : defaults.net, subtitle: hasTrades ? '0.25% de retorno' : defaults.netPct, positive: hasTrades ? true : false },
    { key: 'winrate', title: 'Win Rate', value: hasTrades ? '100.0%' : defaults.winrate, subtitle: hasTrades ? '1W / 0L / OBE' : '', positive: hasTrades ? true : false },
    { key: 'profitFactor', title: 'Profit Factor', value: hasTrades ? '∞' : defaults.profitFactor, subtitle: hasTrades ? 'Lucro bruto / Perda bruta' : '', positive: hasTrades ? true : false },
    { key: 'expectancy', title: 'Expectativa', value: hasTrades ? '$250.00' : defaults.expectancy, subtitle: hasTrades ? 'Por trade' : '', positive: hasTrades ? true : false },
    { key: 'maxdraw', title: 'Max Drawdown', value: defaults.maxdraw, subtitle: 'Risco máximo atingido', positive: false },
    { key: 'best', title: 'Melhor Trade', value: hasTrades ? '+$250.00' : defaults.best, subtitle: '', positive: hasTrades ? true : false },
    { key: 'worst', title: 'Pior Trade', value: hasTrades ? '-$250.00' : defaults.worst, subtitle: '', positive: hasTrades ? false : false },
    { key: 'rr', title: 'R:R Médio', value: defaults.rr, subtitle: 'Risk/Reward', positive: false },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <div key={metric.key} className="relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 shadow-md">
          <p className="text-xs text-slate-400 uppercase tracking-wider">{metric.title}</p>

          <div className="mt-3 flex items-center justify-between">
            <h3 className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${metric.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {metric.value}
            </h3>
            <div className="text-sm text-slate-400">{metric.subtitle}</div>
          </div>

          <div className="absolute right-4 top-4 opacity-10">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1"/></svg>
          </div>
        </div>
      ))}
    </div>
  );
}
