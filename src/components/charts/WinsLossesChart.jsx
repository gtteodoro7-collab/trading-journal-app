import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

export default function WinsLossesChart({ trades }) {
  const wins = trades.filter(t => t.tipo === 'Win').length;
  const losses = trades.filter(t => t.tipo === 'Loss').length;
  const breakEvens = trades.filter(t => t.tipo === 'BreakEven').length;

  const data = [
    { name: 'Wins', value: wins, color: '#10b981' },
    { name: 'Losses', value: losses, color: '#ef4444' },
    { name: 'Break Even', value: breakEvens, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const total = wins + losses + breakEvens;
      const percent = ((item.value / total) * 100).toFixed(1);
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-bold">{item.name}</p>
          <p className="text-lg" style={{ color: item.color }}>
            {item.value} trades ({percent}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (trades.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-slate-500">
        Adicione trades para ver a distribuição
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-slate-300 text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}