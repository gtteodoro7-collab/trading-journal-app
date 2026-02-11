import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Wallet } from 'lucide-react';

const COLORS = [
  { name: 'Verde', value: '#10b981' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Amarelo', value: '#eab308' },
  { name: 'Ciano', value: '#06b6d4' },
];

export default function AccountForm({ open, onOpenChange, onSubmit, editAccount = null }) {
  const [formData, setFormData] = useState(editAccount || {
    name: '',
    broker: '',
    accountNumber: '',
    accountBalance: 10000,
    currency: 'USD',
    riskPerTrade: 1,
    defaultLotSize: 0.1,
    dailyGoal: 100,
    weeklyGoal: 500,
    monthlyGoal: 2000,
    maxDailyLoss: 200,
    color: '#10b981',
    isActive: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      accountBalance: parseFloat(formData.accountBalance) || 10000,
      riskPerTrade: parseFloat(formData.riskPerTrade) || 1,
      defaultLotSize: parseFloat(formData.defaultLotSize) || 0.1,
      dailyGoal: parseFloat(formData.dailyGoal) || 100,
      weeklyGoal: parseFloat(formData.weeklyGoal) || 500,
      monthlyGoal: parseFloat(formData.monthlyGoal) || 2000,
      maxDailyLoss: parseFloat(formData.maxDailyLoss) || 200,
    });
    onOpenChange(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            {editAccount ? 'Editar Conta' : 'Nova Conta'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Nome da Conta *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Conta Principal"
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Cor</Label>
              <Select value={formData.color} onValueChange={(v) => handleChange('color', v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: formData.color }} />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {COLORS.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Corretora</Label>
              <Input
                value={formData.broker}
                onChange={(e) => handleChange('broker', e.target.value)}
                placeholder="Ex: IC Markets"
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Nº da Conta</Label>
              <Input
                value={formData.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                placeholder="Ex: 123456"
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Saldo Inicial *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.accountBalance}
                onChange={(e) => handleChange('accountBalance', e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Moeda *</Label>
              <Select value={formData.currency} onValueChange={(v) => handleChange('currency', v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="BRL">BRL (R$)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Risco por Trade (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.riskPerTrade}
                onChange={(e) => handleChange('riskPerTrade', e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Lote Padrão</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.defaultLotSize}
                onChange={(e) => handleChange('defaultLotSize', e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Meta Diária</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.dailyGoal}
                onChange={(e) => handleChange('dailyGoal', e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Meta Semanal</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.weeklyGoal}
                onChange={(e) => handleChange('weeklyGoal', e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Meta Mensal</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.monthlyGoal}
                onChange={(e) => handleChange('monthlyGoal', e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Perda Máxima Diária</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.maxDailyLoss}
              onChange={(e) => handleChange('maxDailyLoss', e.target.value)}
              className="bg-slate-800 border-slate-700"
            />
          </div>

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
              disabled={!formData.name || !formData.accountBalance}
            >
              {editAccount ? 'Salvar' : 'Criar Conta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}