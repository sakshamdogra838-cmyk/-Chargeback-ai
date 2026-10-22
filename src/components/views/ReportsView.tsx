import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  XCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { currentOrg, disputes } = useApp();
  const [isExporting, setIsExporting] = useState(false);

  const totalDisputes = disputes.length;
  const wonCases = disputes.filter(d => d.winStatus === 'won' || d.status === 'won');
  const lostCases = disputes.filter(d => d.winStatus === 'lost' || d.status === 'lost');
  const totalDecided = wonCases.length + lostCases.length;

  const totalDisputedVal = disputes.reduce((acc, d) => acc + (Number(d.disputeAmount) || 0), 0);
  const totalRecoveredVal = wonCases.reduce((acc, d) => acc + (Number(d.recoveredAmount) || Number(d.disputeAmount) || 0), 0);

  // Win rate by reason code
  const reasonStats = disputes.reduce((acc: Record<string, { total: number; won: number; lost: number; value: number }>, d) => {
    const reason = d.disputeReasonCategory || 'General';
    if (!acc[reason]) acc[reason] = { total: 0, won: 0, lost: 0, value: 0 };
    acc[reason].total += 1;
    acc[reason].value += Number(d.disputeAmount) || 0;
    if (d.winStatus === 'won' || d.status === 'won') acc[reason].won += 1;
    if (d.winStatus === 'lost' || d.status === 'lost') acc[reason].lost += 1;
    return acc;
  }, {});

  // Processor stats
  const processorStats = disputes.reduce((acc: Record<string, { total: number; won: number; value: number }>, d) => {
    const proc = d.paymentProcessor || 'Other';
    if (!acc[proc]) acc[proc] = { total: 0, won: 0, value: 0 };
    acc[proc].total += 1;
    acc[proc].value += Number(d.disputeAmount) || 0;
    if (d.winStatus === 'won' || d.status === 'won') acc[proc].won += 1;
    return acc;
  }, {});

  // Handle server-side sanitized CSV export
  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/export/csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: currentOrg?.id,
          disputes
        })
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chargeback-report-${currentOrg?.id || 'export'}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error('Export error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dispute & Recovery Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Empirical win-rates by reason code, processor metrics, and revenue recovery performance.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={isExporting || disputes.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-950/40 transition shrink-0"
        >
          {isExporting ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          Export Sanitized Report (CSV)
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Total Decided Disputes</span>
          <div className="text-2xl font-black text-white mt-1">
            {totalDecided}{' '}
            <span className="text-xs font-normal text-slate-500">of {totalDisputes} cases</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Net Won Cases</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {wonCases.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Decided Win Rate</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {totalDecided > 0 ? `${Math.round((wonCases.length / totalDecided) * 100)}%` : 'N/A'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Confirmed Recovered Funds</span>
          <div className="text-2xl font-black text-white mt-1">
            ${totalRecoveredVal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Reason Code Breakdown Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Win Rate Performance by Reason Category</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Dispute Category</th>
                <th className="py-2.5 px-3">Cases</th>
                <th className="py-2.5 px-3">Disputed Value</th>
                <th className="py-2.5 px-3">Won</th>
                <th className="py-2.5 px-3">Lost</th>
                <th className="py-2.5 px-3">Win Rate (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {Object.entries(reasonStats).map(([reason, stats]) => {
                const resolved = stats.won + stats.lost;
                const winPct = resolved > 0 ? Math.round((stats.won / resolved) * 100) : null;
                return (
                  <tr key={reason}>
                    <td className="py-2.5 px-3 font-medium text-white">{reason}</td>
                    <td className="py-2.5 px-3">{stats.total}</td>
                    <td className="py-2.5 px-3 font-mono">${stats.value.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{stats.won}</td>
                    <td className="py-2.5 px-3 text-rose-400">{stats.lost}</td>
                    <td className="py-2.5 px-3 font-bold text-cyan-300">
                      {winPct !== null ? `${winPct}%` : 'Pending Decisions'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Processor Breakdown */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Disputes by Payment Processor</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(processorStats).map(([proc, stats]) => (
            <div key={proc} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white truncate">{proc}</div>
              <div className="text-lg font-black text-cyan-400">${stats.value.toFixed(2)}</div>
              <div className="text-[11px] text-slate-400 flex justify-between">
                <span>{stats.total} Total Cases</span>
                <span className="text-emerald-400 font-semibold">{stats.won} Won</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
