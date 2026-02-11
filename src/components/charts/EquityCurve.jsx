import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { format } from "date-fns";

export default function EquityCurve({ trades = [], initialBalance = 0, resetToZero = false }) {

  const data = useMemo(() => {

    if (!trades.length) return [];

    // Normalize trades and sort by date
    const normalized = trades
      .map(t => {
        const dateStr = t.tradeDate || t.trade_date || t.trade_date_local || t.tradeDateString || '';
        const d = new Date(dateStr);
        const profit = Number(t.profit ?? t.resultado ?? t._profit ?? 0) || 0;
        return { date: d, profit };
      })
      .filter(x => x.date instanceof Date && !isNaN(x.date.getTime()))
      .sort((a,b) => a.date.getTime() - b.date.getTime());

    if (!normalized.length) return [];

    // Compute running balance
    let running = Number(initialBalance) || 0;
    const out = normalized.map((item) => {
      running += item.profit;
      return { date: item.date, balance: running };
    });

    if (resetToZero) {
      const offset = out[0].balance || 0;
      return out.map(o => ({ date: o.date, balance: Number((o.balance - offset).toFixed(2)) }));
    }

    return out;

  }, [trades, initialBalance]);

  const tickFormatter = (value) => {
    try {
      if (!value) return "";
      const d = new Date(value);
        if (isNaN(d.getTime())) return "";
      return format(d, "dd/MM");
    } catch {
      return "";
    }
  };

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

          <XAxis
            dataKey="date"
            tickFormatter={tickFormatter}
            stroke="#94a3b8"
          />

          <YAxis stroke="#94a3b8" />

          <Tooltip
            labelFormatter={(value) => tickFormatter(value)}
          />

          <Line
            type="monotone"
            dataKey="balance"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
