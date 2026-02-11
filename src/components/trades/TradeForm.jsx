// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 
  'USD/CAD', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY',
  'EUR/AUD', 'EUR/CAD', 'EUR/CHF', 'AUD/JPY', 'CAD/JPY',
  'XAU/USD', 'XAG/USD', 'US30', 'NAS100', 'SPX500'
];

const SESSIONS = ['Asian', 'London', 'NewYork', 'Sydney'];
const STRATEGIES = ['Scalping', 'DayTrading', 'Swing', 'Position'];
const DIRECTIONS = ['Buy', 'Sell'];

export default function TradeForm({ 
  open, 
  onOpenChange, 
  onSubmit, 
  editTrade = null,
  settings,
  accounts = [],
  selectedAccountId = null
}) {
  const getInitialFormData = () => ({
    accountId: editTrade?.accountId || selectedAccountId || (accounts.length > 0 ? accounts[0].id : ''),
    ativo: editTrade?.ativo || '',
    tipo: editTrade?.tipo || 'Win',
    resultado: editTrade?.resultado ?? '',
    session: editTrade?.session || '',
    strategy: editTrade?.strategy || '',
    direction: editTrade?.direction || '',
    entryPrice: editTrade?.entryPrice ?? '',
    exitPrice: editTrade?.exitPrice ?? '',
    lotSize: editTrade?.lotSize ?? settings?.defaultLotSize ?? '',
    stopLoss: editTrade?.stopLoss ?? '',
    takeProfit: editTrade?.takeProfit ?? '',
    pips: editTrade?.pips ?? '',
    riskRewardRatio: editTrade?.riskRewardRatio ?? '',
    notes: editTrade?.notes || '',
    tradeDate: editTrade?.tradeDate || new Date().toISOString().split('T')[0]
  });

  const [formData, setFormData] = useState(getInitialFormData);

  // Reset form when dialog opens or editTrade changes
  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData());
    }
  }, [open, editTrade, selectedAccountId, accounts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Converter valores numéricos
    const tradeData = {
      ...formData,
      resultado: parseFloat(formData.resultado) || 0,
      entryPrice: formData.entryPrice ? parseFloat(formData.entryPrice) : undefined,
      exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
      lotSize: formData.lotSize ? parseFloat(formData.lotSize) : undefined,
      stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : undefined,
      takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : undefined,
      pips: formData.pips ? parseFloat(formData.pips) : undefined,
      riskRewardRatio: formData.riskRewardRatio ? parseFloat(formData.riskRewardRatio) : undefined,
    };
    
    onSubmit(tradeData);
    onOpenChange(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Auto-calcular tipo baseado no resultado
  const handleResultadoChange = (value) => {
    const numValue = parseFloat(value);
    let tipo = 'BreakEven';
    if (numValue > 0) tipo = 'Win';
    else if (numValue < 0) tipo = 'Loss';
    
    setFormData(prev => ({ 
      ...prev, 
      resultado: value,
      tipo 
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {editTrade ? 'Editar Trade' : 'Novo Trade'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Conta */}
          {accounts.length > 0 && (
            <div className="space-y-2">
              <Label className="text-slate-300">Conta *</Label>
              <Select 
                value={formData.accountId} 
                onValueChange={(v) => handleChange('accountId', v)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Selecione a conta" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 z-[9999]">
                  {accounts.map(acc => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name} ({acc.currency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Linha 1: Ativo e Data */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Par de Moedas *</Label>
              <Select 
                value={formData.ativo} 
                onValueChange={(v) => handleChange('ativo', v)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Selecione o par" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 z-[9999]">
                  {PAIRS.map(pair => (
                    <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Data *</Label>
              <Input 
                type="date"
                value={formData.tradeDate}
                onChange={(e) => handleChange('tradeDate', e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </div>

          {/* Linha 2: Direção e Resultado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Direção</Label>
              <div className="flex gap-2">
                {DIRECTIONS.map(dir => (
                  <Button
                    key={dir}
                    type="button"
                    variant={formData.direction === dir ? "default" : "outline"}
                    className={`flex-1 ${
                      formData.direction === dir 
                        ? dir === 'Buy' 
                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                          : 'bg-red-600 hover:bg-red-700'
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    }`}
                    onClick={() => handleChange('direction', dir)}
                  >
                    {dir === 'Buy' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    {dir}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Resultado ($) *</Label>
              <Input 
                type="number"
                step="0.01"
                value={formData.resultado}
                onChange={(e) => handleResultadoChange(e.target.value)}
                placeholder="Ex: 150.00 ou -50.00"
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </div>

          {/* Tipo do Trade (visual) */}
          <div className="space-y-2">
            <Label className="text-slate-300">Tipo</Label>
            <div className="flex gap-2">
              {[
                { value: 'Win', label: 'Win', icon: TrendingUp, color: 'emerald' },
                { value: 'Loss', label: 'Loss', icon: TrendingDown, color: 'red' },
                { value: 'BreakEven', label: 'Break Even', icon: Minus, color: 'amber' }
              ].map(tipo => (
                <Button
                  key={tipo.value}
                  type="button"
                  variant={formData.tipo === tipo.value ? "default" : "outline"}
                  className={`flex-1 ${
                    formData.tipo === tipo.value 
                      ? `bg-${tipo.color}-600 hover:bg-${tipo.color}-700`
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                  }`}
                  style={formData.tipo === tipo.value ? {
                    backgroundColor: tipo.color === 'emerald' ? '#059669' : tipo.color === 'red' ? '#dc2626' : '#d97706'
                  } : {}}
                  onClick={() => handleChange('tipo', tipo.value)}
                >
                  <tipo.icon className="w-4 h-4 mr-1" />
                  {tipo.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Linha 3: Sessão e Estratégia */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Sessão</Label>
              <Select 
                value={formData.session} 
                onValueChange={(v) => handleChange('session', v)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Selecione a sessão" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 z-[9999]">
                  {SESSIONS.map(session => (
                    <SelectItem key={session} value={session}>{session}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Estratégia</Label>
              <Select 
                value={formData.strategy} 
                onValueChange={(v) => handleChange('strategy', v)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Selecione a estratégia" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 z-[9999]">
                  {STRATEGIES.map(strat => (
                    <SelectItem key={strat} value={strat}>{strat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Linha 4: Preços */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Preço de Entrada</Label>
              <Input 
                type="number"
                step="0.00001"
                value={formData.entryPrice}
                onChange={(e) => handleChange('entryPrice', e.target.value)}
                placeholder="1.08500"
                className="bg-slate-800 border-slate-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Preço de Saída</Label>
              <Input 
                type="number"
                step="0.00001"
                value={formData.exitPrice}
                onChange={(e) => handleChange('exitPrice', e.target.value)}
                placeholder="1.08750"
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </div>

          {/* Linha 5: Lote, SL, TP */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Lote</Label>
              <Input 
                type="number"
                step="0.01"
                value={formData.lotSize}
                onChange={(e) => handleChange('lotSize', e.target.value)}
                placeholder="0.10"
                className="bg-slate-800 border-slate-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Stop Loss</Label>
              <Input 
                type="number"
                step="0.00001"
                value={formData.stopLoss}
                onChange={(e) => handleChange('stopLoss', e.target.value)}
                placeholder="1.08400"
                className="bg-slate-800 border-slate-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Take Profit</Label>
              <Input 
                type="number"
                step="0.00001"
                value={formData.takeProfit}
                onChange={(e) => handleChange('takeProfit', e.target.value)}
                placeholder="1.08900"
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </div>

          {/* Linha 6: Pips e R:R */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Pips</Label>
              <Input 
                type="number"
                step="0.1"
                value={formData.pips}
                onChange={(e) => handleChange('pips', e.target.value)}
                placeholder="25"
                className="bg-slate-800 border-slate-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Risk:Reward</Label>
              <Input 
                type="number"
                step="0.1"
                value={formData.riskRewardRatio}
                onChange={(e) => handleChange('riskRewardRatio', e.target.value)}
                placeholder="2.5"
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label className="text-slate-300">Observações</Label>
            <Textarea 
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Ex: Setup de reversão na zona de demanda..."
              className="bg-slate-800 border-slate-700 min-h-[80px]"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-slate-800 border-slate-700 hover:bg-slate-700"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={!formData.ativo || formData.resultado === '' || (accounts.length > 0 && !formData.accountId)}
            >
              {editTrade ? 'Salvar Alterações' : 'Adicionar Trade'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}