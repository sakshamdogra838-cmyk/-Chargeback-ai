import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Send,
  Layers,
  FileText,
  Lock,
  RefreshCw
} from 'lucide-react';
import { Dispute } from '../../types';

interface AiAnalystViewProps {
  onSelectCase: (caseId: string) => void;
}

export const AiAnalystView: React.FC<AiAnalystViewProps> = ({ onSelectCase }) => {
  const { currentOrg, disputes } = useApp();
  const [activeTab, setActiveTab] = useState<'prioritization' | 'generator'>('prioritization');
  const [customAngle, setCustomAngle] = useState('');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(disputes[0]?.id || '');
  const [rebuttalOutput, setRebuttalOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const openDisputes = disputes.filter(d => !['won', 'lost', 'closed'].includes(d.status));
  const now = new Date().getTime();

  // Recovery Prioritization Algorithm:
  // Score based on:
  // 1. Evidence completeness (collected / total) (weight: 40%)
  // 2. Deadline urgency (closer deadlines get higher priority up to deadline) (weight: 30%)
  // 3. Dispute amount (higher value = higher priority) (weight: 30%)
  const prioritizedDisputes = openDisputes.map(d => {
    const totalEvidence = d.evidenceItems.length || 1;
    const collected = d.evidenceItems.filter(e => e.collected).length;
    const evidenceScore = (collected / totalEvidence) * 40;

    const deadlineMs = new Date(d.submissionDeadline).getTime();
    const diffDays = (deadlineMs - now) / (1000 * 3600 * 24);
    let deadlineScore = 0;
    if (diffDays > 0 && diffDays <= 3) deadlineScore = 30;
    else if (diffDays > 3 && diffDays <= 7) deadlineScore = 25;
    else if (diffDays > 7 && diffDays <= 14) deadlineScore = 15;
    else deadlineScore = 5;

    const amountScore = Math.min((d.disputeAmount / 500) * 30, 30);
    const totalScore = Math.round(evidenceScore + deadlineScore + amountScore);

    return {
      dispute: d,
      score: totalScore,
      evidenceRatio: `${collected}/${totalEvidence}`,
      daysLeft: Math.ceil(diffDays)
    };
  }).sort((a, b) => b.score - a.score);

  const handleGenerateCustomRebuttal = async () => {
    const target = disputes.find(d => d.id === selectedDisputeId);
    if (!target) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-rebuttal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: currentOrg?.id,
          dispute: target,
          merchantAngle: customAngle
        })
      });

      const json = await res.json();
      if (res.ok && json.rebuttalText) {
        setRebuttalOutput(json.rebuttalText);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">AI Chargeback Analyst</h1>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              Gemini 3.8 Flash
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic recovery ranking, network rule compliance, and automated rebuttal drafting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('prioritization')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'prioritization'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Recovery Prioritization Matrix
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'generator'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Rebuttal Studio
          </button>
        </div>
      </div>

      {/* Model Transparency & Safety Callout */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-200">Zero AI Training & PII Protection:</span> Dispute notes, card numbers, and order records are never used to train public foundation models. All credit cards and CVVs are automatically redacted on the server before model evaluation.
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px] shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Server-Side Isolated</span>
        </div>
      </div>

      {activeTab === 'prioritization' ? (
        <div className="space-y-6">
          {/* Prioritization Algorithm Explanation */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Dispute Action Prioritization Ranking</h3>
                <p className="text-xs text-slate-400">
                  Cases ranked by weighted factors: Evidence Completeness (40%), Deadline Urgency (30%), Disputed Value (30%).
                </p>
              </div>
              <span className="text-xs font-bold text-cyan-400">
                {prioritizedDisputes.length} Cases Scored
              </span>
            </div>

            <div className="divide-y divide-slate-800/80 mt-2">
              {prioritizedDisputes.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500">
                  No active disputes to prioritize. All current cases are resolved!
                </div>
              ) : (
                prioritizedDisputes.map(({ dispute, score, evidenceRatio, daysLeft }) => (
                  <div
                    key={dispute.id}
                    onClick={() => onSelectCase(dispute.id)}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 px-3 -mx-3 rounded-xl cursor-pointer transition"
                  >
                    <div className="flex items-center gap-4">
                      {/* Priority Score Ring */}
                      <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center shrink-0">
                        <span className={`text-base font-black ${
                          score >= 70 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          {score}
                        </span>
                        <span className="text-[8px] font-bold uppercase text-slate-500">Score</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white font-mono">{dispute.internalCaseId}</span>
                          <span className="text-xs text-slate-400">• {dispute.paymentProcessor}</span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {dispute.disputeReasonCategory}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-3">
                          <span>Evidence: <strong className="text-slate-200">{evidenceRatio}</strong></span>
                          <span>•</span>
                          <span>Order: <strong className="text-slate-200">{dispute.orderRef}</strong></span>
                          <span>•</span>
                          <span>Customer: <strong className="text-slate-200">{dispute.customerName}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                      <div className="text-right">
                        <div className="text-base font-black text-white">
                          ${dispute.disputeAmount.toFixed(2)} <span className="text-xs font-normal text-slate-400">{dispute.currency}</span>
                        </div>
                        <div className={`text-xs font-semibold flex items-center justify-end gap-1 ${
                          daysLeft <= 3 ? 'text-rose-400' : daysLeft <= 7 ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{daysLeft > 0 ? `${daysLeft} days remaining` : 'Expired'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectCase(dispute.id)}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 transition"
                      >
                        Action
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Custom Rebuttal Studio Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Ad-Hoc Rebuttal Generator</h3>
            <p className="text-xs text-slate-400">
              Provide a specific defense hypothesis or merchant angle to draft a custom rebuttal letter.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Dispute</label>
              <select
                value={selectedDisputeId}
                onChange={(e) => setSelectedDisputeId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {disputes.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.internalCaseId} - {d.disputeReasonCategory} (${d.disputeAmount})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Specific Defense Angle</label>
              <textarea
                rows={4}
                value={customAngle}
                onChange={(e) => setCustomAngle(e.target.value)}
                placeholder="e.g. Cardholder logged into subscription 5 times after renewal date. Signed proof of delivery at front door."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <button
              onClick={handleGenerateCustomRebuttal}
              disabled={isGenerating || !selectedDisputeId}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 transition"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Drafting with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Custom Rebuttal Letter
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Generated Rebuttal Output</h3>
            <textarea
              rows={16}
              readOnly
              value={rebuttalOutput || 'Click "Generate Custom Rebuttal Letter" to view response...'}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 leading-relaxed focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
