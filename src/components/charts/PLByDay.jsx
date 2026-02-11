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

export default function PLByDay({ trades }) {
  const dayNames = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  
  // Agrupar por dia da semana
  const dayData = [0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
    const dayTrades = trades.filter(t => {
      const date = new Date(t.tradeDate);
      return date.getDay() === dayIndex;
    });
    
    const total = dayTrades.reduce((acc, t) => acc + (t.resultado || 0), 0);
    const count = dayTrades.length;
    
    return {
      day: dayNames[dayIndex],
      value: total,
      count,
      isPositive: total >= 0
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-bold">{item.day}</p>
          <p className={`text-lg ${item.value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {item.value >= 0 ? '+' : ''}${item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-slate-400 text-xs">{item.count} trades</p>
        </div>
      );
    }
    return null;
  };

  if (trades.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-slate-500">
        Adicione trades para ver o P&L por dia
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="day" 
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
            {dayData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.isPositive ? '#10b981' : '#ef4444'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}