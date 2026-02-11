import React from 'react';
import { Zap, Clock, TrendingUp, Calendar } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function StrategyAnalysis({ trades, currency = 'USD' }) {
  const currencySymbol = {
    USD: '$',
    EUR: '€',
    BRL: 'R$',
    GBP: '£'
  }[currency] || '$';

  const strategyIcons = {
    Scalping: Zap,
    DayTrading: Clock,
    Swing: TrendingUp,
    Position: Calendar
  };

  const strategyColors = {
    Scalping: 'purple',
    DayTrading: 'blue',
    Swing: 'emerald',
    Position: 'amber'
  };

  // Agrupar trades por estratégia
  const strategyData = trades.reduce((acc, trade) => {
    const strat = trade.strategy || 'Não definida';
    if (!acc[strat]) {
      acc[strat] = {
        strategy: strat,
        trades: [],
        totalProfit: 0,
        wins: 0,
        losses: 0
      };
    }
    acc[strat].trades.push(trade);
    acc[strat].totalProfit += trade.resultado || 0;
    if (trade.tipo === 'Win') acc[strat].wins++;
    if (trade.tipo === 'Loss') acc[strat].losses++;
    return acc;
  }, {});

  const strategyStats = Object.values(strategyData).map(data => {
    const winRate = data.trades.length > 0 
      ? ((data.wins / data.trades.length) * 100).toFixed(1)
      : 0;
    
    const avgResult = data.trades.length > 0
      ? data.totalProfit / data.trades.length
      : 0;

    return {
      ...data,
      winRate,
      avgResult
    };
  }).sort((a, b) => b.totalProfit - a.totalProfit);

  if (strategyStats.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Adicione trades com estratégia para ver a análise
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {strategyStats.map((stat) => {
        const Icon = strategyIcons[stat.strategy] || Zap;
        const color = strategyColors[stat.strategy] || 'slate';
        
        return (
          <div 
            key={stat.strategy}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  `bg-${color}-500/20`
                )}
                style={{ backgroundColor: `${color === 'purple' ? '#8b5cf620' : color === 'blue' ? '#3b82f620' : color === 'emerald' ? '#10b98120' : '#f59e0b20'}` }}
                >
                  <Icon className={cn("w-5 h-5", `text-${color}-400`)} 
                    style={{ color: color === 'purple' ? '#a78bfa' : color === 'blue' ? '#60a5fa' : color === 'emerald' ? '#34d399' : '#fbbf24' }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-white">{stat.strategy}</p>
                  <p className="text-xs text-slate-500">
                    {stat.trades.length} trades • {stat.winRate}% win rate
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={cn(
                  "text-lg font-bold",
                  stat.totalProfit >= 0 ? "text-emerald-400" : "text-red-400"
                )}>
                  {stat.totalProfit >= 0 ? '+' : ''}{currencySymbol}{stat.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-500">
                  Média: {currencySymbol}{stat.avgResult.toFixed(2)}/trade
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}