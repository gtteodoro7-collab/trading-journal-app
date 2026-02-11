import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Wallet, Layers } from 'lucide-react';

export default function AccountSelector({ accounts, selectedAccountId, onSelect }) {
  return (
    <Select value={selectedAccountId || 'all'} onValueChange={onSelect}>
      <SelectTrigger className="w-[200px] bg-slate-800 border-slate-700">
        <div className="flex items-center gap-2">
          {selectedAccountId === 'all' ? (
            <Layers className="w-4 h-4 text-slate-400" />
          ) : (
            <Wallet className="w-4 h-4 text-emerald-400" />
          )}
          <SelectValue placeholder="Selecionar conta" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-slate-700">
        <SelectItem value="all">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Todas as Contas</span>
          </div>
        </SelectItem>
        {accounts.map(account => (
          <SelectItem key={account.id} value={account.id}>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: account.color || '#10b981' }}
              />
              <span>{account.name}</span>
              <span className="text-slate-500 text-xs">({account.currency})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}