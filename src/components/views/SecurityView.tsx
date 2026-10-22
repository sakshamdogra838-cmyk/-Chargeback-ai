import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  ShieldCheck, 
  Download, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Key, 
  History, 
  Database,
  FileText,
  AlertCircle
} from 'lucide-react';

export const SecurityView: React.FC = () => {
  const { currentOrg, auditLogs, disputes, members, deleteOrganization, currentRole } = useApp();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isOwner = currentRole === 'owner';

  // GDPR Data Export
  const handleExportGdpr = () => {
    const fullOrgPayload = {
      organization: currentOrg,
      exportTimestamp: new Date().toISOString(),
      disputes,
      members,
      auditLogs
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullOrgPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `chargeback-gdpr-export-${currentOrg?.id}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleConfirmDelete = async () => {
    if (confirmInput !== currentOrg?.name) return;
    try {
      if (currentOrg) {
        await deleteOrganization(currentOrg.id);
      }
    } catch (e: any) {
      setDeleteError(e.message || 'Failed to delete organization');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Security, Audit Trail & Privacy</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
              ABAC Zero-Trust
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tenant isolation validation, immutable audit records, and GDPR data portability controls for <strong className="text-slate-300">{currentOrg?.name}</strong>.
          </p>
        </div>

        <button
          onClick={handleExportGdpr}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl transition shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          Export All Data (GDPR JSON)
        </button>
      </div>

      {/* Security Architecture Posture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400">
            <Database className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase text-white">Tenant Isolation</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All database queries enforce <code className="text-cyan-300 font-mono">organizationId</code> scoping. Firestore rules strictly verify current authenticated membership before permitting reads or writes.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <Key className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase text-white">Server Secret Protection</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gemini AI keys, Stripe secret keys, and webhook signing secrets reside strictly in the server runtime. Browser clients never access confidential credentials.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase text-white">AI Data Minimization</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Credit card numbers and CVV codes are stripped from notes before forwarding to Gemini. Merchant records are treated strictly as untrusted data.
          </p>
        </div>
      </div>

      {/* Immutable Audit Trail Log */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              Immutable Operational Audit Log
            </h3>
            <p className="text-xs text-slate-400">
              Append-only security log recording sensitive operations, actor identity, and timestamps.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">{auditLogs.length} Events Logged</span>
        </div>

        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px] tracking-wider font-semibold sticky top-0 bg-slate-900">
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Actor Identity</th>
                <th className="py-2 px-3">Action Type</th>
                <th className="py-2 px-3">Resource</th>
                <th className="py-2 px-3">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No security events recorded yet this session.
                  </td>
                </tr>
              ) : (
                auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/30 font-mono text-[11px]">
                    <td className="py-2 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2 px-3 text-cyan-300 truncate max-w-[140px] font-sans">
                      {log.userEmail}
                    </td>
                    <td className="py-2 px-3 font-semibold text-white font-sans">
                      {log.action}
                    </td>
                    <td className="py-2 px-3 text-slate-400">
                      {log.resourceType}:{log.resourceId}
                    </td>
                    <td className="py-2 px-3 text-slate-300 font-sans max-w-xs truncate">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Danger Zone: Workspace Purge / Account Deletion */}
      {isOwner && (
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-3">
          <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Danger Zone: Workspace Deletion & Cascading Purge
          </h3>
          <p className="text-xs text-rose-300/80">
            Permanently delete this organization workspace, including all chargeback cases, evidence checklists, AI analyses, and team memberships. This action cannot be undone.
          </p>

          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Workspace {currentOrg?.name}
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Confirm Workspace Purge
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              To confirm deletion of <strong>{currentOrg?.name}</strong>, type the exact workspace name below:
            </p>

            <input
              type="text"
              placeholder={currentOrg?.name}
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
            />

            {deleteError && (
              <p className="text-xs text-rose-400">{deleteError}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={confirmInput !== currentOrg?.name}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
