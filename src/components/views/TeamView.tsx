import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Trash2, 
  Check, 
  X, 
  AlertCircle,
  Lock,
  ChevronDown
} from 'lucide-react';
import { UserRole } from '../../types';

export const TeamView: React.FC = () => {
  const { 
    currentOrg, 
    members, 
    currentRole, 
    inviteMember, 
    updateMemberRole, 
    removeMember 
  } = useApp();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('analyst');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isOwner = currentRole === 'owner';

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setErrorMessage(null);

    try {
      await inviteMember(inviteEmail.trim(), inviteRole);
      setInviteEmail('');
      setInviteModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to invite member');
    }
  };

  const handleRemove = async (id: string) => {
    setErrorMessage(null);
    try {
      await removeMember(id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to remove member');
    }
  };

  const permissionsMatrix = [
    { permission: 'View Dashboards & Financial Metrics', owner: true, admin: true, analyst: true, viewer: true },
    { permission: 'Review Dispute Cases & Evidence Details', owner: true, admin: true, analyst: true, viewer: true },
    { permission: 'Import CSV Transaction & Dispute Data', owner: true, admin: true, analyst: true, viewer: false },
    { permission: 'Trigger Gemini AI Case Analysis & Drafts', owner: true, admin: true, analyst: true, viewer: false },
    { permission: 'Export Sanitized Reports & CSVs', owner: true, admin: true, analyst: false, viewer: false },
    { permission: 'Invite & Manage Team Member Roles', owner: true, admin: true, analyst: false, viewer: false },
    { permission: 'Manage Subscriptions, Billing & Invoices', owner: true, admin: false, analyst: false, viewer: false },
    { permission: 'Configure Payment Gateways & Webhooks', owner: true, admin: false, analyst: false, viewer: false },
    { permission: 'Export Organization GDPR Data or Purge Workspace', owner: true, admin: false, analyst: false, viewer: false }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Team & Access Control (RBAC)</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              Tenant Scoped
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage organization collaborators and role-based operational permissions for <strong className="text-slate-300">{currentOrg?.name}</strong>.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setInviteModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-950/40 transition shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Invite Collaborator
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Members Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            Active Organization Members ({members.length})
          </h3>
          <span className="text-xs text-slate-400">
            Current User Role: <strong className="text-cyan-400 uppercase">{currentRole}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-2.5 px-3">Collaborator</th>
                <th className="py-2.5 px-3">Email Address</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Joined Date</th>
                {isOwner && <th className="py-2.5 px-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {members.map(member => (
                <tr key={member.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-semibold text-white flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold flex items-center justify-center text-xs uppercase">
                      {member.userDisplayName ? member.userDisplayName[0] : 'U'}
                    </div>
                    <span>{member.userDisplayName}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono">{member.userEmail}</td>
                  <td className="py-3 px-3">
                    {isOwner && member.role !== 'owner' ? (
                      <select
                        value={member.role}
                        onChange={(e) => updateMemberRole(member.id, e.target.value as UserRole)}
                        className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="admin">Admin</option>
                        <option value="analyst">Analyst</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    ) : (
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        member.role === 'owner'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                          : member.role === 'admin'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {member.role}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  {isOwner && (
                    <td className="py-3 px-3 text-right">
                      {member.role !== 'owner' && (
                        <button
                          onClick={() => handleRemove(member.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                          title="Remove Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Matrix */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Role Permission Capabilities Matrix
        </h3>
        <p className="text-xs text-slate-400">
          Enforced server-side on every API endpoint and database security rule.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-2.5 px-3">System Permission</th>
                <th className="py-2.5 px-3 text-center">Owner</th>
                <th className="py-2.5 px-3 text-center">Admin</th>
                <th className="py-2.5 px-3 text-center">Analyst</th>
                <th className="py-2.5 px-3 text-center">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20">
                  <td className="py-2.5 px-3 font-medium text-slate-200">{item.permission}</td>
                  <td className="py-2.5 px-3 text-center">
                    {item.owner ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.admin ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.analyst ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.viewer ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Collaborator Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-cyan-400" />
                Invite Team Member
              </h3>
              <button onClick={() => setInviteModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Collaborator Email *</label>
                <input
                  type="email"
                  required
                  placeholder="analyst@yourcompany.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assign Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="admin">Admin - Team & Operations Management</option>
                  <option value="analyst">Analyst - Case Review & Rebuttal Drafting</option>
                  <option value="viewer">Viewer - Read-Only Access</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold rounded-xl shadow-lg transition"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
