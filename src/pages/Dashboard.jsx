import { useNavigate } from "react-router-dom";
import React, { useState, useMemo, lazy, Suspense } from 'react';
import supabase from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { 
  LayoutDashboard, 
  LineChart, 
  ListOrdered, 
  BarChart3,
  Wallet,
  Plus,
  Download,
  TrendingUp,
  LogOut
} from 'lucide-react';

const MetricsGrid = lazy(() => import('../components/dashboard/MetricsGrid'));
const EquityCurve = lazy(() => import('../components/charts/EquityCurve'));
const PLByDay = lazy(() => import('../components/charts/PLByDay'));
const WinsLossesChart = lazy(() => import('../components/charts/WinsLossesChart'));
const SessionAnalysis = lazy(() => import('../components/charts/SessionAnalysis'));
const TradesList = lazy(() => import('../components/trades/TradesList'));
const TradeForm = lazy(() => import('../components/trades/TradeForm'));
const PairAnalysis = lazy(() => import('../components/analytics/PairAnalysis'));
const StrategyAnalysis = lazy(() => import('../components/analytics/StrategyAnalysis'));
const AccountSelector = lazy(() => import('../components/accounts/AccountSelector'));
const AccountForm = lazy(() => import('../components/accounts/AccountForm'));
const AccountsList = lazy(() => import('../components/accounts/AccountsList'));

import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
 const handleLogin = async (e) => {
  e.preventDefault();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast.error("Erro ao fazer login");
  } else {
    navigate("/");
  }
};
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewStartDate, setViewStartDate] = useState('');
  const [viewEndDate, setViewEndDate] = useState('');

  const { data: accounts = [], refetch: refetchAccounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['accounts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase.from('accounts').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: allTrades = [], refetch: refetchTrades, isLoading: tradesLoading } = useQuery({
    queryKey: ['trades', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase.from('trades').select('*').eq('user_id', user.id).order('trade_date', { ascending: false });
      if (error) return [];
      return data || [];
    },
    enabled: !!user?.id,
  });

  const trades = useMemo(() => selectedAccountId === 'all' ? allTrades : allTrades.filter(t => t.account_id === selectedAccountId), [allTrades, selectedAccountId]);
  const filteredTrades = useMemo(() => {
    let list = trades;
    if (viewStartDate && viewEndDate) {
      const start = new Date(viewStartDate);
      const end = new Date(viewEndDate);
      // normalize dates (ignore time)
      list = list.filter(t => {
        const d = new Date((t.tradeDate || t.trade_date || t.trade_date_local || '').toString());
        return d >= start && d <= end;
      });
    }

    if (!searchTerm) return list;
    const q = searchTerm.trim().toLowerCase();
    return list.filter(t => {
      const pair = (t.ativo || t.pair || '').toString().toLowerCase();
      const strategy = (t.strategy || '').toString().toLowerCase();
      const session = (t.session || '').toString().toLowerCase();
      return pair.includes(q) || strategy.includes(q) || session.includes(q);
    });
  }, [trades, searchTerm, viewStartDate, viewEndDate]);
  const selectedAccount = useMemo(() => selectedAccountId === 'all' ? { balance: accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0), currency: accounts[0]?.currency || 'USD' } : accounts.find(a => a.id === selectedAccountId) || null, [accounts, selectedAccountId]);

  const weekSections = [
    { id: 1, days: 'segunda-terca-quarta-quinta-sexta', label: 'semana 1 %' },
    { id: 2, days: 'segunda-terca-quarta-quinta-sexta', label: 'semana 2 %' },
    { id: 3, days: 'segunda-terca-quarta-quinta-sexta', label: 'semana 3 %' },
    { id: 4, days: 'segunda-terca-quarta-quinta-sexta', label: 'semana 4 %' },
  ];

  const handleCreateAccount = async (accountData) => {
    try {
      const { data, error } = await supabase.from('accounts').insert([{ user_id: user.id, name: accountData.name, balance: accountData.accountBalance, broker: accountData.broker || '', currency: accountData.currency || 'USD', color: accountData.color || '#10b981' }]);
      if (error) {
        console.error('createAccount error', error);
        toast.error('Erro ao criar conta: ' + (error.message || 'desconhecido'));
        return;
      }
      toast.success('Conta criada!');
      refetchAccounts();
      setShowAccountForm(false);
    } catch (e) {
      console.error('createAccount exception', e);
      toast.error('Erro ao criar conta');
    }
  };

  const handleCreateTrade = async (tradeData) => {
    try {
      const insertObj = {
        user_id: user.id,
        account_id: tradeData.accountId,
        pair: tradeData.ativo,
        direction: (tradeData.direction || '').toLowerCase(),
        lot: tradeData.lotSize,
        entry_price: tradeData.entryPrice,
        exit_price: tradeData.exitPrice,
        profit: tradeData.resultado,
        result: (tradeData.tipo || '').toLowerCase(),
        trade_date: tradeData.tradeDate,
        notes: tradeData.notes || ''
      };

      const { data, error } = await supabase.from('trades').insert([insertObj]).select().single();
      if (error) {
        console.error('createTrade error', error);
        toast.error('Erro ao salvar trade: ' + (error.message || 'desconhecido'));
        return;
      }
      toast.success('Trade adicionado!');
      refetchTrades();
      setShowTradeForm(false);
    } catch (e) {
      console.error('createTrade exception', e);
      toast.error('Erro ao salvar trade');
    }
  };

  if (accountsLoading || tradesLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header principal removido (duplicado). Abaixo está o header único usado pela UI. */}
<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
  <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-emerald-600 shadow-lg shadow-emerald-500/20">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Trading Journal</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        
        {/* Email do usuário logado */}
        {user && (
          <div className="text-slate-300 text-sm font-medium">
            {user.email}
          </div>
        )}

        {/* Botão Logout */}
        <Button
          size="sm"
          variant="destructive"
          className="flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>


              <Suspense fallback={<div className="w-48 h-10 bg-slate-900/40 rounded-md" />}> 
                <AccountSelector accounts={accounts} selectedAccountId={selectedAccountId} onSelect={setSelectedAccountId} />
              </Suspense>
              <Button
                size="sm"
                className="flex items-center gap-2 bg-gradient-to-br from-slate-800/80 to-slate-800/60 border border-slate-700 text-emerald-300 hover:from-slate-700 hover:to-slate-700 px-3 py-2 rounded-md shadow-sm"
                onClick={() => setShowAccountForm(true)}
              >
                <Plus className="w-4 h-4" />
                Adicionar Conta
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { setEditingTrade(null); setShowTradeForm(true); }}><Plus className="w-4 h-4 mr-2" /> Novo Trade</Button>
              <Button size="sm" className="bg-slate-700 text-slate-200 hover:bg-slate-600" onClick={() => {
                // Exportar filteredTrades para CSV e forçar download no navegador
                try {
                  const rows = filteredTrades || [];
                  if (!rows.length) { toast('Nenhum trade para exportar'); return; }
                  const keys = Object.keys(rows[0]);
                  const csv = [keys.join(',')].concat(rows.map(r => keys.map(k => `"${(r[k]===null||r[k]===undefined)?'':String(r[k]).replace(/"/g,'""')}"`).join(','))).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const link = document.createElement('a');
                  const url = URL.createObjectURL(blob);
                  link.setAttribute('href', url);
                  link.setAttribute('download', `trades-export-${new Date().toISOString().replace(/[:.]/g,'-')}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                } catch (e) {
                  console.error(e);
                  toast.error('Erro ao exportar trades');
                }
              }}>
                Exportar CSV
              </Button>
            </div>
          </div>

          <div className="bg-slate-800/60 border-t border-slate-700">
            <div className="container mx-auto px-4 py-3 flex items-center gap-4">
              <TabsList className="flex gap-6 bg-transparent border-0 p-0">
                <TabsTrigger value="dashboard" className="flex items-center gap-2 text-slate-200 hover:text-white"><LayoutDashboard className="w-4 h-4" />Dashboard</TabsTrigger>
                <TabsTrigger value="charts" className="flex items-center gap-2 text-slate-200 hover:text-white"><LineChart className="w-4 h-4" />Gráficos</TabsTrigger>
                <TabsTrigger value="trades" className="flex items-center gap-2 text-slate-200 hover:text-white"><ListOrdered className="w-4 h-4" />Trades</TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2 text-slate-200 hover:text-white"><BarChart3 className="w-4 h-4" />Analytics</TabsTrigger>
              </TabsList>

              <div className="ml-4 flex-1 flex items-center">
                <input
                  aria-label="Buscar trades"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por par, sessão ou estratégia..."
                  className="w-full max-w-lg h-10 px-3 bg-slate-900/40 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="date" value={viewStartDate} onChange={(e) => setViewStartDate(e.target.value)} className="h-10 px-2 bg-slate-900/40 border border-slate-700 rounded-md text-slate-200" />
                <input type="date" value={viewEndDate} onChange={(e) => setViewEndDate(e.target.value)} className="h-10 px-2 bg-slate-900/40 border border-slate-700 rounded-md text-slate-200" />
                <Button size="sm" className="bg-slate-700 text-slate-200" onClick={() => { if (!viewStartDate || !viewEndDate) { toast.error('Escolha início e fim do período'); return; } toast.success('Período aplicado'); }}>
                  Aplicar
                </Button>
                <Button size="sm" className="bg-slate-700 text-slate-200" onClick={() => { setViewStartDate(''); setViewEndDate(''); toast('Período removido'); }}>
                  Limpar
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <TabsContent value="dashboard" className="space-y-6">
                {/* Seções semanais maiores, agora no topo do conteúdo */}
                <div className="mb-6">
                  <div className="flex flex-col gap-4">
                      {weekSections.map(ws => (
                        <div key={ws.id} className="w-full rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-slate-300 text-sm">{ws.days}</div>
                          <div className="text-emerald-400 font-extrabold text-sm">{ws.label}</div>
                        </div>

                        <div className="grid grid-cols-5 gap-3">
                          {['segunda','terca','quarta','quinta','sexta'].map((d, idx) => {
                            const ref = viewEndDate ? new Date(viewEndDate) : new Date();
                            const dayOfWeek = ref.getDay();
                            const diffToFriday = (5 - dayOfWeek + 7) % 7;
                            const thisFriday = new Date(ref);
                            thisFriday.setDate(ref.getDate() + diffToFriday - (ws.id - 1) * 7);
                            const cellDate = new Date(thisFriday);
                            cellDate.setDate(thisFriday.getDate() - (4 - idx));
                            const iso = cellDate.toISOString().split('T')[0];

                            const dayTrades = filteredTrades.filter(t => ((t.tradeDate || t.trade_date || '').toString().startsWith(iso)));
                            const sum = dayTrades.reduce((s, t) => s + (Number(t.resultado ?? t.profit ?? 0) || 0), 0);
                            const bg = dayTrades.length === 0 ? 'bg-slate-800' : (sum > 0 ? 'bg-emerald-600' : (sum < 0 ? 'bg-red-600' : 'bg-amber-600'));

                            return (
                              <div key={d} className="relative w-full">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button onClick={() => { setEditingTrade({ tradeDate: iso }); setShowTradeForm(true); }} title={iso} className={`${bg} text-white rounded-xl px-4 py-4 text-base h-24 flex flex-col items-center justify-center w-full`}>
                                      <div className="font-semibold">{d.slice(0,3)}</div>
                                      <div className="text-xs mt-1">{iso}</div>
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-72">
                                    <div className="text-sm text-slate-200 font-medium">{d.charAt(0).toUpperCase() + d.slice(1)} — {iso}</div>
                                    <div className="mt-1 text-xs text-slate-400">Trades: {dayTrades.length} • P&L: {(sum>=0?'+':'') + sum.toFixed(2)}</div>

                                    <div className="mt-3">
                                      {dayTrades.length === 0 ? (
                                        <div className="text-sm text-slate-400">Nenhum trade neste dia.</div>
                                      ) : (
                                        <ul className="space-y-2 max-h-36 overflow-auto">
                                          {dayTrades.slice(0,3).map((t, i) => {
                                            const profit = Number(t.resultado ?? t.profit ?? 0) || 0;
                                            const colorClass = profit > 0 ? 'bg-emerald-600' : (profit < 0 ? 'bg-red-600' : 'bg-amber-600');
                                            const initials = ((t.ativo || t.pair || '') + '').toString().split(/\W+/)[0]?.slice(0,2).toUpperCase();
                                            return (
                                              <li key={i} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-3">
                                                  <Avatar className="h-8 w-8">
                                                    <AvatarFallback className={`${colorClass} text-white`}>{initials || '—'}</AvatarFallback>
                                                  </Avatar>
                                                  <div className="flex flex-col">
                                                    <span className="font-medium text-slate-200">{(t.ativo || t.pair || '—')}</span>
                                                    <span className="text-xs text-slate-400">{(t.strategy || t.session || '')}</span>
                                                  </div>
                                                </div>
                                                <div className={(profit >= 0 ? 'text-emerald-400' : 'text-red-400') + ' text-sm font-semibold'}>
                                                  {(profit >= 0 ? '+' : '') + profit.toFixed(2)}
                                                </div>
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      )}
                                    </div>

                                    <div className="mt-3 flex gap-2">
                                      <Button size="sm" className="bg-slate-700 text-slate-200" onClick={() => { setActiveTab('trades'); setViewStartDate(iso); setViewEndDate(iso); }}>
                                        Ver todos ({dayTrades.length})
                                      </Button>
                                      <Button size="sm" className="bg-emerald-600" onClick={() => { setEditingTrade({ tradeDate: iso }); setShowTradeForm(true); }}>
                                        Adicionar
                                      </Button>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Suspense fallback={<div className="text-center text-slate-400 py-6">Carregando métricas...</div>}>
                  <MetricsGrid trades={filteredTrades} settings={selectedAccount} />
                </Suspense>

              
          </TabsContent>
          <TabsContent value="charts" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700"><CardHeader><CardTitle className="text-white">Equity Curve</CardTitle></CardHeader><CardContent><Suspense fallback={<div className="text-slate-400">Carregando...</div>}><EquityCurve trades={filteredTrades} initialBalance={selectedAccount?.balance || 0} /></Suspense></CardContent></Card>
              <Card className="bg-slate-800/50 border-slate-700"><CardHeader><CardTitle className="text-white">Distribuição W/L</CardTitle></CardHeader><CardContent><Suspense fallback={<div className="text-slate-400">Carregando...</div>}><WinsLossesChart trades={filteredTrades} /></Suspense></CardContent></Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700"><CardHeader><CardTitle className="text-white">P&L por Dia</CardTitle></CardHeader><CardContent><Suspense fallback={<div className="text-slate-400">Carregando...</div>}><PLByDay trades={filteredTrades} /></Suspense></CardContent></Card>
              <Card className="bg-slate-800/50 border-slate-700"><CardHeader><CardTitle className="text-white">Análise por Sessão</CardTitle></CardHeader><CardContent><Suspense fallback={<div className="text-slate-400">Carregando...</div>}><SessionAnalysis trades={filteredTrades} /></Suspense></CardContent></Card>
            </div>
          </TabsContent>
          <TabsContent value="trades" className="space-y-6"><Card className="bg-slate-800/50 border-slate-700"><CardContent className="p-0"><Suspense fallback={<div className="text-slate-400 p-6 text-center">Carregando trades...</div>}><TradesList trades={filteredTrades} onEdit={setEditingTrade} accounts={accounts} onDelete={() => {}} /></Suspense></CardContent></Card></TabsContent>
          <TabsContent value="analytics" className="space-y-6"><div className="grid lg:grid-cols-2 gap-6"><Suspense fallback={<div className="text-slate-400">Carregando analytics...</div>}><PairAnalysis trades={filteredTrades} /><StrategyAnalysis trades={filteredTrades} /></Suspense></div></TabsContent>
          
        </main>
      </Tabs>
      {showTradeForm && (
        <Suspense fallback={<div className="text-slate-400 p-6">Carregando formulário...</div>}>
          <TradeForm open={showTradeForm} onOpenChange={setShowTradeForm} onSubmit={handleCreateTrade} editTrade={editingTrade} accounts={accounts} settings={{ defaultLotSize: 0.01 }} />
        </Suspense>
      )}
      {showAccountForm && (
        <Suspense fallback={<div className="text-slate-400 p-6">Carregando formulário...</div>}>
          <AccountForm open={showAccountForm} onOpenChange={setShowAccountForm} onSubmit={handleCreateAccount} editAccount={editingAccount} />
        </Suspense>
      )}
    </div>
  );
}
