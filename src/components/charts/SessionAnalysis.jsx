import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function SessionAnalysis({ trades }) {
  const sessions = ['Asian', 'London', 'NewYork', 'Sydney'];
  
  const sessionData = sessions.map(session => {
    const sessionTrades = trades.filter(t => t.session === session);
    const total = sessionTrades.reduce((acc, t) => acc + (t.resultado || 0), 0);
    const wins = sessionTrades.filter(t => t.tipo === 'Win').length;
    const winRate = sessionTrades.length > 0 
      ? ((wins / sessionTrades.length) * 100).toFixed(0) 
      : 0;
    
    return {
      session,
      value: total,
      count: sessionTrades.length,
      winRate,
      isPositive: total >= 0
    };
  });

  const sessionColors = {
    Asian: '#8b5cf6',
    London: '#3b82f6',
    NewYork: '#10b981',
    Sydney: '#f59e0b'
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-bold">{item.session}</p>
          <p className={`text-lg ${item.value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {item.value >= 0 ? '+' : ''}${item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-slate-400 text-xs">{item.count} trades • {item.winRate}% win rate</p>
        </div>
      );
    }
    return null;
  };

  const hasSessionData = trades.some(t => t.session);
  
  if (!hasSessionData) {
    return (
      <div className="h-[250px] flex items-center justify-center text-slate-500">
        Adicione sessão aos trades para ver a análise
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sessionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="session" 
            stroke="#64748b"
            fontSize={11}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={11}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {sessionData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={sessionColors[entry.session]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}