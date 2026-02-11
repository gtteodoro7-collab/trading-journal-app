import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function AccountsList({ accounts, trades, onEdit, onDelete, onSelect }) {
  const getCurrencySymbol = (currency) => {
    return { USD: '$', EUR: '€', BRL: 'R$', GBP: '£' }[currency] || '$';
  };

  const getAccountStats = (account) => {
    const accountTrades = trades.filter(t => t.accountId === account.id);
    const totalProfit = accountTrades.reduce((acc, t) => acc + (t.resultado || 0), 0);
    const wins = accountTrades.filter(t => t.tipo === 'Win').length;
    const winRate = accountTrades.length > 0 ? ((wins / accountTrades.length) * 100).toFixed(1) : 0;
    const currentBalance = account.accountBalance + totalProfit;
    
    return { totalProfit, winRate, tradesCount: accountTrades.length, currentBalance };
  };

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg">Nenhuma conta cadastrada</p>
        <p className="text-sm">Clique em "Nova Conta" para começar</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts.map(account => {
        const stats = getAccountStats(account);
        const symbol = getCurrencySymbol(account.currency);
        
        return (
          <Card 
            key={account.id}
            className={cn(
              "bg-slate-800/50 border-slate-700 p-4 cursor-pointer transition-all hover:scale-[1.02] hover:border-slate-600",
              "relative overflow-hidden"
            )}
            onClick={() => onSelect(account.id)}
          >
            {/* Color indicator */}
            <div 
              className="absolute top-0 left-0 w-full h-1"
              style={{ backgroundColor: account.color || '#10b981' }}
            />
            
            <div className="flex items-start justify-between mb-3 mt-1">
              <div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: account.color || '#10b981' }}
                  />
                  <h3 className="font-bold text-white">{account.name}</h3>
                </div>
                {account.broker && (
                  <p className="text-xs text-slate-500 mt-1">{account.broker}</p>
                )}
              </div>
              <Badge variant="outline" className="border-slate-600 text-slate-400">
                {account.currency}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Saldo Atual</span>
                <span className={cn(
                  "font-bold text-lg",
                  stats.totalProfit >= 0 ? "text-emerald-400" : "text-red-400"
                )}>
                  {symbol}{stats.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">P&L</span>
                <div className="flex items-center gap-1">
                  {stats.totalProfit >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={cn(
                    "font-semibold",
                    stats.totalProfit >= 0 ? "text-emerald-400" : "text-red-400"
                  )}>
                    {stats.totalProfit >= 0 ? '+' : ''}{symbol}{stats.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Win Rate</span>
                <span className="text-white font-medium">{stats.winRate}%</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Trades</span>
                <span className="text-white font-medium">{stats.tradesCount}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-3 border-t border-slate-700">
              <Button
                size="sm"
                variant="ghost"
                className="flex-1 text-slate-400 hover:text-white hover:bg-slate-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(account);
                }}
              >
                <Pencil className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="flex-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(account);
                }}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Excluir
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}