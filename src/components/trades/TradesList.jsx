// @ts-nocheck
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Pencil, 
  Trash2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from "@/lib/utils";

export default function TradesList({ trades, onEdit, onDelete, currency = 'USD', accounts = [] }) {
  const currencySymbol = {
    USD: '$',
    EUR: '€',
    BRL: 'R$',
    GBP: '£'
  }[currency] || '$';

  const formatCurrency = (value) => {
    const absValue = Math.abs(value);
    return `${value >= 0 ? '+' : '-'}${currencySymbol}${absValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getTypeIcon = (tipo) => {
    switch (tipo) {
      case 'Win':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'Loss':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-amber-400" />;
    }
  };

  const getTypeBadge = (tipo) => {
    const styles = {
      Win: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      Loss: 'bg-red-500/20 text-red-400 border-red-500/30',
      BreakEven: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    };
    
    return (
      <Badge variant="outline" className={cn("border", styles[tipo])}>
        {getTypeIcon(tipo)}
        <span className="ml-1">{tipo === 'BreakEven' ? 'BE' : tipo}</span>
      </Badge>
    );
  };

  const getDirectionIcon = (direction) => {
    if (direction === 'Buy') {
      return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
    } else if (direction === 'Sell') {
      return <ArrowDownRight className="w-4 h-4 text-red-400" />;
    }
    return null;
  };

  const getAccountBadge = (accountId) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return null;
    return (
      <div className="flex items-center gap-1.5">
        <div 
          className="w-2.5 h-2.5 rounded-full" 
          style={{ backgroundColor: account.color || '#10b981' }}
        />
        <span className="text-xs text-slate-400">{account.name}</span>
      </div>
    );
  };

  // Ordenar trades por data (mais recente primeiro)
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(b.tradeDate) - new Date(a.tradeDate)
  );

  if (trades.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg">Nenhum trade registrado</p>
        <p className="text-sm">Clique em "Novo Trade" para começar</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-800/50 hover:bg-slate-800/50 border-slate-700">
            <TableHead className="text-slate-400">Data</TableHead>
            {accounts.length > 0 && <TableHead className="text-slate-400">Conta</TableHead>}
            <TableHead className="text-slate-400">Par</TableHead>
            <TableHead className="text-slate-400">Direção</TableHead>
            <TableHead className="text-slate-400">Tipo</TableHead>
            <TableHead className="text-slate-400">Resultado</TableHead>
            <TableHead className="text-slate-400">Sessão</TableHead>
            <TableHead className="text-slate-400">Estratégia</TableHead>
            <TableHead className="text-slate-400">R:R</TableHead>
            <TableHead className="text-slate-400 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTrades.map((trade) => (
            <TableRow 
              key={trade.id} 
              className="border-slate-700 hover:bg-slate-800/30 transition-colors"
            >
              <TableCell className="text-slate-300">
                {format(new Date(trade.tradeDate), 'dd/MM/yyyy', { locale: ptBR })}
              </TableCell>
              {accounts.length > 0 && (
                <TableCell>{getAccountBadge(trade.accountId)}</TableCell>
              )}
              <TableCell className="font-medium text-white">
                {trade.ativo}
              </TableCell>
              <TableCell>
                {trade.direction && (
                  <div className="flex items-center gap-1">
                    {getDirectionIcon(trade.direction)}
                    <span className={trade.direction === 'Buy' ? 'text-emerald-400' : 'text-red-400'}>
                      {trade.direction}
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell>{getTypeBadge(trade.tipo)}</TableCell>
              <TableCell className={cn(
                "font-bold",
                trade.resultado >= 0 ? "text-emerald-400" : "text-red-400"
              )}>
                {formatCurrency(trade.resultado)}
              </TableCell>
              <TableCell className="text-slate-400">
                {trade.session || '-'}
              </TableCell>
              <TableCell className="text-slate-400">
                {trade.strategy || '-'}
              </TableCell>
              <TableCell className="text-slate-400">
                {trade.riskRewardRatio ? `1:${trade.riskRewardRatio}` : '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
                    onClick={() => onEdit(trade)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => onDelete(trade)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}