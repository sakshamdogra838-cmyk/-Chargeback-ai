import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Copy, 
  Check, 
  Send, 
  CreditCard, 
  Truck, 
  User, 
  ShieldAlert, 
  HelpCircle,
  Plus,
  RefreshCw,
  Share2
} from 'lucide-react';
import { Dispute, DisputeStatus, AiAnalysisResult } from '../../types';

interface CaseDetailViewProps {
  caseId: string;
  onBack: () => void;
}

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({ caseId, onBack }) => {
  const { currentOrg, disputes, updateDispute, aiAnalyses, saveAiAnalysis } = useApp();
  const dispute = disputes.find(d => d.id === caseId);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState(dispute?.notes || '');
  const [status, setStatus] = useState<DisputeStatus>(dispute?.status || 'new');
  const [recoveredAmt, setRecoveredAmt] = useState<number>(dispute?.recoveredAmount || 0);

  // Evidence Checklist State
  const [evidenceItems, setEvidenceItems] = useState(dispute?.evidenceItems || []);
  const [newEvidenceLabel, setNewEvidenceLabel] = useState('');

  // Editable rebuttal draft
  const currentAnalysis: AiAnalysisResult | undefined = dispute ? aiAnalyses[dispute.id] : undefined;
  const [editableRebuttal, setEditableRebuttal] = useState(currentAnalysis?.draftResponse || '');

  if (!dispute) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Case not found or access denied.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs">
          Return to Cases
        </button>
      </div>
    );
  }

  // Toggle evidence collected
  const toggleEvidence = async (id: string) => {
    const updated = evidenceItems.map(item => 
      item.id === id ? { ...item, collected: !item.collected } : item
    );
    setEvidenceItems(updated);
    await updateDispute(dispute.id, { evidenceItems: updated });
  };

  const addCustomEvidence = async () => {
    if (!newEvidenceLabel.trim()) return;
    const newItem = {
      id: `ev-${Date.now()}`,
      type: 'custom',
      label: newEvidenceLabel.trim(),
      description: 'Custom merchant evidentiary documentation',
      required: false,
      collected: true
    };
    const updated = [...evidenceItems, newItem];
    setEvidenceItems(updated);
    setNewEvidenceLabel('');
    await updateDispute(dispute.id, { evidenceItems: updated });
  };

  // Run AI Analysis via Server API
  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    setAiError(null);
    try {
      const res = await fetch('/api/gemini/analyze-dispute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: currentOrg?.id,
          dispute: {
            ...dispute,
            notes
          },
          availableEvidence: evidenceItems
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || json.details || 'Failed to analyze dispute');
      }

      const result: AiAnalysisResult = {
        id: `ai-${Date.now()}`,
        organizationId: currentOrg?.id || '',
        disputeId: dispute.id,
        summary: json.data.summary,
        reasonExplanation: json.data.reasonExplanation,
        missingEvidence: json.data.missingEvidence || [],
        availableEvidence: json.data.availableEvidence || [],
        recommendations: json.data.recommendations || [],
        weaknesses: json.data.weaknesses || [],
        urgency: json.data.urgency || 'medium',
        confidenceScore: json.data.confidenceScore || 75,
        recoverabilityRating: json.data.recoverabilityRating || 'Moderate',
        draftResponse: json.data.draftResponse || '',
        modelUsed: json.data.modelUsed || 'gemini-3.8-flash',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveAiAnalysis(result);
      setEditableRebuttal(result.draftResponse);
    } catch (err: any) {
      console.error('AI Analysis failed:', err);
      setAiError(err.message || 'Error executing AI analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save notes & status
  const handleSaveStatus = async (newStatus: DisputeStatus) => {
    setStatus(newStatus);
    const updates: Partial<Dispute> = { status: newStatus };
    if (newStatus === 'won') {
      updates.winStatus = 'won';
      updates.recoveredAmount = dispute.disputeAmount;
      setRecoveredAmt(dispute.disputeAmount);
    } else if (newStatus === 'lost') {
      updates.winStatus = 'lost';
      updates.recoveredAmount = 0;
      setRecoveredAmt(0);
    }
    await updateDispute(dispute.id, updates);
  };

  const handleSaveNotes = async () => {
    await updateDispute(dispute.id, { notes });
  };

  const copyRebuttal = () => {
    const textToCopy = editableRebuttal || currentAnalysis?.draftResponse || '';
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dispute Cases
        </button>

        {/* Workflow Status Picker */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Workflow Stage:</span>
          {(['under_review', 'evidence_needed', 'ready_for_submission', 'submitted', 'won', 'lost'] as DisputeStatus[]).map(st => (
            <button
              key={st}
              onClick={() => handleSaveStatus(st)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                status === st
                  ? st === 'won'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : st === 'lost'
                    ? 'bg-rose-500 text-white font-black'
                    : 'bg-cyan-500 text-slate-950 font-black'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Case Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xl font-black text-white font-mono">{dispute.internalCaseId}</span>
            <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {dispute.paymentProcessor}
            </span>
            <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/40">
              {dispute.priority} Priority
            </span>
          </div>
          <div className="text-sm font-semibold text-cyan-300">
            {dispute.disputeReasonCategory} <span className="text-slate-500 font-mono font-normal">(Reason Code: {dispute.disputeReasonCode})</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2 pt-1">
            <span>Customer: <strong className="text-slate-200">{dispute.customerName}</strong> ({dispute.customerEmail})</span>
            <span>•</span>
            <span>Order: <strong className="text-slate-200 font-mono">{dispute.orderRef}</strong></span>
          </div>
        </div>

        <div className="text-right md:border-l md:border-slate-800 md:pl-6 shrink-0">
          <div className="text-xs text-slate-400 font-medium">Disputed Amount</div>
          <div className="text-3xl font-black text-white tracking-tight">
            ${Number(dispute.disputeAmount).toFixed(2)}{' '}
            <span className="text-sm font-normal text-slate-400">{dispute.currency}</span>
          </div>
          <div className="mt-1 text-xs text-amber-400 flex items-center justify-end gap-1 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Submission Deadline: {dispute.submissionDeadline}</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Case Data & Evidence (Left) vs AI Assistant & Rebuttal (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Case Metadata & Evidence Checklist */}
        <div className="lg:col-span-5 space-y-6">
          {/* Transaction & Fulfillment Details */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              Transaction & Delivery Records
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Transaction ID</span>
                <span className="font-mono text-slate-200 truncate max-w-[180px]">{dispute.transactionRef}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Transaction Date</span>
                <span className="text-slate-200">{dispute.transactionDate}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Dispute Received Date</span>
                <span className="text-slate-200">{dispute.disputeReceivedDate}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Carrier & Tracking</span>
                <span className="text-slate-200 font-mono">{dispute.carrier || 'N/A'} {dispute.trackingNumber ? `(${dispute.trackingNumber})` : ''}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Refund Status</span>
                <span className="text-slate-200 capitalize">{dispute.refundStatus}</span>
              </div>
            </div>
          </div>

          {/* Evidence Checklist */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Reason-Specific Evidence Checklist
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Requirements based on card network rules for code {dispute.disputeReasonCode}
                </p>
              </div>
              <span className="text-xs text-cyan-400 font-bold">
                {evidenceItems.filter(e => e.collected).length}/{evidenceItems.length} Gathered
              </span>
            </div>

            <div className="space-y-2">
              {evidenceItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleEvidence(item.id)}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    item.collected
                      ? 'bg-cyan-950/20 border-cyan-800/40 text-slate-200'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.collected}
                    onChange={() => {}}
                    className="mt-0.5 text-cyan-500 rounded focus:ring-0 cursor-pointer"
                  />
                  <div className="space-y-0.5 flex-1">
                    <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.required && (
                        <span className="text-[9px] uppercase font-bold text-amber-400">Required</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Evidence Row */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder="Add custom evidence item..."
                value={newEvidenceLabel}
                onChange={(e) => setNewEvidenceLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomEvidence()}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={addCustomEvidence}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Internal Case Notes</h3>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleSaveNotes}
              placeholder="Add investigator notes, customer call transcripts, or operational context..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
            <button
              onClick={handleSaveNotes}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 rounded-xl transition"
            >
              Save Notes
            </button>
          </div>
        </div>

        {/* Right Column (7 cols): AI Chargeback Analyst & Rebuttal Letter */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Gemini AI Chargeback Analyst
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                      gemini-3.8-flash
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Card brand rule analysis & rebuttal response generation</p>
                </div>
              </div>

              <button
                onClick={runAiAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-950/50 transition"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Analyzing Network Rules...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    {currentAnalysis ? 'Regenerate Analysis' : 'Run Gemini Analysis'}
                  </>
                )}
              </button>
            </div>

            {aiError && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            {/* AI Analysis Structured Findings */}
            {currentAnalysis ? (
              <div className="space-y-4">
                {/* Score & Urgency Pill */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Recoverability</span>
                    <div className={`text-base font-black mt-0.5 ${
                      currentAnalysis.recoverabilityRating === 'High' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {currentAnalysis.recoverabilityRating} Rating
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">AI Confidence</span>
                    <div className="text-base font-black text-cyan-400 mt-0.5">
                      {currentAnalysis.confidenceScore}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Urgency</span>
                    <div className="text-base font-black text-white mt-0.5 capitalize">
                      {currentAnalysis.urgency}
                    </div>
                  </div>
                </div>

                {/* Case Summary */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <h4 className="text-xs font-bold text-cyan-400 mb-1">Analyst Case Summary</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{currentAnalysis.summary}</p>
                </div>

                {/* Reason Explanation */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <h4 className="text-xs font-bold text-slate-300 mb-1">Acquiring Network Guidelines</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{currentAnalysis.reasonExplanation}</p>
                </div>

                {/* Strengths vs Missing Proof */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1.5">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Compelling Proof Available
                    </span>
                    <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                      {currentAnalysis.availableEvidence.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-1.5">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Missing or Weak Evidence
                    </span>
                    <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                      {currentAnalysis.missingEvidence.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Editable Formal Rebuttal Letter */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        Dispute Rebuttal Letter (Draft for Issuer Submission)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Formal letter formatted for Stripe, Shopify, or acquiring bank submission.
                      </p>
                    </div>

                    <button
                      onClick={copyRebuttal}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied to Clipboard' : 'Copy Letter'}
                    </button>
                  </div>

                  <textarea
                    rows={12}
                    value={editableRebuttal || currentAnalysis.draftResponse}
                    onChange={(e) => setEditableRebuttal(e.target.value)}
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-cyan-500"
                  />

                  {/* Mandatory Human Review Notice per guidelines */}
                  <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded-xl text-[11px] text-blue-300 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Human Review Mandate:</strong> Please review and verify all statements, dates, and order numbers before submitting this rebuttal package to your payment processor. Never submit unverified factual claims.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
                <Sparkles className="w-10 h-10 text-cyan-400/40 mx-auto mb-2 animate-bounce" />
                <h4 className="text-sm font-bold text-white">No AI Analysis Yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Click the <strong>Run Gemini Analysis</strong> button above to analyze code {dispute.disputeReasonCode} against Visa/Mastercard network rules and generate an authoritative dispute response.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
