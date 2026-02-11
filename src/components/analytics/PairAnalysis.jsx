import React from 'react';
import { TrendingUp, TrendingDown, Target, Scale } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function PairAnalysis({ trades, currency = 'USD' }) {
  const currencySymbol = {
    USD: '$',
    EUR: '€',
    BRL: 'R$',
    GBP: '£'
  }[currency] || '$';

  // Agrupar trades por par
  const pairData = trades.reduce((acc, trade) => {
    if (!acc[trade.ativo]) {
      acc[trade.ativo] = {
        pair: trade.ativo,
        trades: [],
        totalProfit: 0,
        wins: 0,
        losses: 0
      };
    }
    acc[trade.ativo].trades.push(trade);
    acc[trade.ativo].totalProfit += trade.resultado || 0;
    if (trade.tipo === 'Win') acc[trade.ativo].wins++;
    if (trade.tipo === 'Loss') acc[trade.ativo].losses++;
    return acc;
  }, {});

  const pairStats = Object.values(pairData).map(data => {
    const winRate = data.trades.length > 0 
      ? ((data.wins / data.trades.length) * 100).toFixed(1)
      : 0;
    
    const grossProfit = data.trades
      .filter(t => t.resultado > 0)
      .reduce((acc, t) => acc + t.resultado, 0);
    
    const grossLoss = Math.abs(data.trades
      .filter(t => t.resultado < 0)
      .reduce((acc, t) => acc + t.resultado, 0));
    
    const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : '∞';
    
    const bestTrade = data.trades.length > 0 
      ? Math.max(...data.trades.map(t => t.resultado || 0))
      : 0;
    
    const worstTrade = data.trades.length > 0 
      ? Math.min(...data.trades.map(t => t.resultado || 0))
      : 0;

    return {
      ...data,
      winRate,
      profitFactor,
      bestTrade,
      worstTrade
    };
  }).sort((a, b) => b.totalProfit - a.totalProfit);

  if (pairStats.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Adicione trades para ver a análise por par
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {pairStats.map((stat) => (
        <div 
          key={stat.pair}
          className={cn(
            "p-4 rounded-xl border transition-all hover:scale-[1.01]",
            stat.totalProfit >= 0 
              ? "bg-gradient-to-r from-emerald-900/20 to-slate-900/50 border-emerald-500/20"
              : "bg-gradient-to-r from-red-900/20 to-slate-900/50 border-red-500/20"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-white">{stat.pair}</span>
              <span className="text-xs text-slate-500">{stat.trades.length} trades</span>
            </div>
            <span className={cn(
              "text-xl font-bold",
              stat.totalProfit >= 0 ? "text-emerald-400" : "text-red-400"
            )}>
              {stat.totalProfit >= 0 ? '+' : ''}{currencySymbol}{stat.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs text-slate-500">Win Rate</p>
                <p className={cn(
                  "font-semibold",
                  parseFloat(stat.winRate) >= 50 ? "text-emerald-400" : "text-amber-400"
                )}>
                  {stat.winRate}%
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-xs text-slate-500">Profit Factor</p>
                <p className={cn(
                  "font-semibold",
                  parseFloat(stat.profitFactor) >= 1.5 ? "text-emerald-400" : 
                  parseFloat(stat.profitFactor) >= 1 ? "text-amber-400" : "text-red-400"
                )}>
                  {stat.profitFactor}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs text-slate-500">Melhor</p>
                <p className="font-semibold text-emerald-400">
                  +{currencySymbol}{stat.bestTrade.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <div>
                <p className="text-xs text-slate-500">Pior</p>
                <p className="font-semibold text-red-400">
                  {currencySymbol}{stat.worstTrade.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}