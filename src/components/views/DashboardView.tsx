import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileSpreadsheet, 
  Sparkles, 
  ArrowUpRight, 
  HelpCircle, 
  Calendar,
  Filter,
  Layers,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Dispute } from '../../types';

interface DashboardViewProps {
  onSelectCase: (caseId: string) => void;
  onOpenNewDispute: () => void;
  onNavigateToImports: () => void;
  onNavigateToAi: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectCase,
  onOpenNewDispute,
  onNavigateToImports,
  onNavigateToAi
}) => {
  const { currentOrg, disputes, loadSampleData } = useApp();
  const [dateFilter, setDateFilter] = useState<'30d' | '90d' | 'all'>('all');

  const currency = currentOrg?.currency || 'USD';

  // Real metric computations from authoritative dispute records
  const totalDisputes = disputes.length;
  const openDisputes = disputes.filter(d => !['won', 'lost', 'closed'].includes(d.status));
  const disputedValue = disputes.reduce((sum, d) => sum + (Number(d.disputeAmount) || 0), 0);
  const submittedValue = disputes
    .filter(d => ['submitted', 'won', 'lost'].includes(d.status))
    .reduce((sum, d) => sum + (Number(d.disputeAmount) || 0), 0);

  const wonCases = disputes.filter(d => d.winStatus === 'won' || d.status === 'won');
  const lostCases = disputes.filter(d => d.winStatus === 'lost' || d.status === 'lost');
  const pendingCases = disputes.filter(d => d.winStatus === 'pending' && !['won', 'lost', 'closed'].includes(d.status));

  const confirmedRecoveredAmount = wonCases.reduce((sum, d) => sum + (Number(d.recoveredAmount) || Number(d.disputeAmount) || 0), 0);
  
  // Potentially recoverable: Open cases with reasonable evidence or not marked lost
  const potentiallyRecoverableAmount = openDisputes.reduce((sum, d) => sum + (Number(d.disputeAmount) || 0), 0);

  // Honest Win Rate Calculation: only known resolved outcomes
  const resolvedOutcomesCount = wonCases.length + lostCases.length;
  const winRatePercent = resolvedOutcomesCount > 0 
    ? Math.round((wonCases.length / resolvedOutcomesCount) * 100) 
    : null;

  // Urgent deadlines: less than 7 days away
  const now = new Date().getTime();
  const urgentCases = openDisputes.filter(d => {
    if (!d.submissionDeadline) return false;
    const deadline = new Date(d.submissionDeadline).getTime();
    const diffDays = (deadline - now) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 7;
  }).sort((a, b) => new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime());

  // Reason code distribution
  const reasonBreakdown = disputes.reduce((acc: Record<string, { count: number; value: number }>, d) => {
    const cat = d.disputeReasonCategory || 'Other';
    if (!acc[cat]) acc[cat] = { count: 0, value: 0 };
    acc[cat].count += 1;
    acc[cat].value += Number(d.disputeAmount) || 0;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Dispute & Recovery Operations</h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              Live Tenant Data
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative chargeback management, AI evidence compilation, and recovery analytics for <span className="font-semibold text-slate-300">{currentOrg?.name}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToImports}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 rounded-xl transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            Import CSV
          </button>
          <button
            onClick={onNavigateToAi}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-950/40 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Analyst
          </button>
        </div>
      </div>

      {/* Urgent Deadlines Notification Banner */}
      {urgentCases.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{urgentCases.length} Dispute{urgentCases.length > 1 ? 's' : ''} Approaching Final Submission Deadline</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500 text-slate-950">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cases expire within 7 days. Submitting evidence before deadline is critical to prevent automatic loss.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectCase(urgentCases[0].id)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
          >
            Review Most Urgent Case
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Disputed Exposure */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Total Dispute Value</span>
            <DollarSign className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-white">
              ${disputedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-400">{currency}</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>{totalDisputes} total cases</span>
            <span className="text-slate-300 font-semibold">{openDisputes.length} active</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-500" />
        </div>

        {/* Confirmed Recovered Amount */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Confirmed Recovered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-emerald-400">
              ${confirmedRecoveredAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-emerald-500/80">{currency}</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>{wonCases.length} disputes won</span>
            <span className="text-emerald-400 font-medium">Funds deposited</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* Potentially Recoverable Funds */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Potentially Recoverable</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-cyan-300">
              ${potentiallyRecoverableAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-cyan-400/80">{currency}</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Across open disputes</span>
            <span className="text-cyan-400 font-medium">Under review</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500" />
        </div>

        {/* Honest Win Rate */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <div className="flex items-center gap-1.5" title="Win Rate = Won / (Won + Lost). Only evaluated on final decided cases.">
              <span className="font-medium">Dispute Win Rate</span>
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-white">
              {winRatePercent !== null ? `${winRatePercent}%` : 'N/A'}
            </span>
            {winRatePercent !== null && (
              <span className="text-xs text-emerald-400 font-semibold">
                {wonCases.length} won vs {lostCases.length} lost
              </span>
            )}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {resolvedOutcomesCount > 0 ? (
              <span>Calculated on {resolvedOutcomesCount} resolved cases</span>
            ) : (
              <span>Awaiting first processor verdict</span>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
        </div>
      </div>

      {/* Main Analysis Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Urgent Cases Needing Action (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Cases Requiring Immediate Attention</h3>
                <p className="text-xs text-slate-400">Highest priority chargebacks sorted by deadline urgency</p>
              </div>
              <span className="text-xs text-cyan-400 font-medium">
                {openDisputes.length} Open Cases
              </span>
            </div>

            {openDisputes.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-emerald-400/50 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white">Zero Open Disputes</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Your workspace currently has no active chargebacks. Import your transaction data or load a demonstration dataset to test AI features.
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    onClick={loadSampleData}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition"
                  >
                    Load Sample Dataset
                  </button>
                  <button
                    onClick={onOpenNewDispute}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-xl transition"
                  >
                    Add Custom Dispute
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {openDisputes.slice(0, 5).map((dispute) => {
                  const deadline = new Date(dispute.submissionDeadline).getTime();
                  const diffDays = Math.ceil((deadline - now) / (1000 * 3600 * 24));
                  const isUrgent = diffDays <= 7;

                  return (
                    <div
                      key={dispute.id}
                      onClick={() => onSelectCase(dispute.id)}
                      className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-800/40 px-2 -mx-2 rounded-xl cursor-pointer transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white font-mono">{dispute.internalCaseId}</span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            dispute.priority === 'urgent'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                              : dispute.priority === 'high'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {dispute.priority}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {dispute.paymentProcessor}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
                          <span>{dispute.disputeReasonCategory}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{dispute.customerName}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-white">
                          ${dispute.disputeAmount.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">{dispute.currency}</span>
                        </div>
                        <div className={`text-[11px] font-medium flex items-center justify-end gap-1 ${
                          isUrgent ? 'text-amber-400 font-bold' : 'text-slate-400'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{diffDays > 0 ? `${diffDays}d remaining` : 'Deadline passed'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recovery Performance Overview */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Monthly Dispute Resolution Performance</h3>
            <p className="text-xs text-slate-400 mb-4">Historical comparison of disputed amounts versus recovered funds</p>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Cases Submitted</span>
                <div className="text-lg font-black text-white mt-1">
                  {disputes.filter(d => ['submitted', 'won', 'lost'].includes(d.status)).length}
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Total Cases Won</span>
                <div className="text-lg font-black text-emerald-400 mt-1">
                  {wonCases.length}
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-rose-400">Total Cases Lost</span>
                <div className="text-lg font-black text-rose-400 mt-1">
                  {lostCases.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reason Distribution & Quick Actions (1 col) */}
        <div className="space-y-6">
          {/* Dispute Reason Distribution */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Disputes by Category</h3>
            <p className="text-xs text-slate-400 mb-4">Card network chargeback reason distribution</p>

            <div className="space-y-3">
              {Object.entries(reasonBreakdown).map(([category, stats]) => {
                const percent = totalDisputes > 0 ? Math.round((stats.count / totalDisputes) * 100) : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-300 truncate max-w-[160px]">{category}</span>
                      <span className="text-slate-400 font-mono">${stats.value.toFixed(0)} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Dispute Operations Quick Actions</h3>
            
            <button
              onClick={onOpenNewDispute}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition text-left group"
            >
              <div className="flex items-center gap-2.5">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Log New Chargeback Case</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
            </button>

            <button
              onClick={onNavigateToImports}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition text-left group"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                <span>Upload Merchant CSV Export</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
            </button>

            <button
              onClick={loadSampleData}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition text-left group"
            >
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Reset / Load Sample Dataset</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
