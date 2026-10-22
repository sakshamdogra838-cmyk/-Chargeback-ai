import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  Clock, 
  Sparkles, 
  ArrowUpDown, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText,
  Trash2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Dispute, DisputeStatus, DisputePriority } from '../../types';

interface CasesViewProps {
  onSelectCase: (caseId: string) => void;
  onOpenNewDispute: () => void;
}

export const CasesView: React.FC<CasesViewProps> = ({ onSelectCase, onOpenNewDispute }) => {
  const { disputes, deleteDispute, currentRole, currentOrg } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [processorFilter, setProcessorFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'amount' | 'date'>('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const now = new Date().getTime();

  // Filtered and sorted disputes
  const filteredDisputes = useMemo(() => {
    return disputes.filter(d => {
      // Search
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        !search ||
        d.internalCaseId.toLowerCase().includes(search) ||
        d.orderRef.toLowerCase().includes(search) ||
        d.customerName.toLowerCase().includes(search) ||
        d.customerEmail.toLowerCase().includes(search) ||
        d.disputeReasonCode.toLowerCase().includes(search) ||
        d.disputeReasonCategory.toLowerCase().includes(search);

      // Status
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter;

      // Priority
      const matchesPriority = priorityFilter === 'all' || d.priority === priorityFilter;

      // Processor
      const matchesProcessor = processorFilter === 'all' || d.paymentProcessor.includes(processorFilter);

      return matchesSearch && matchesStatus && matchesPriority && matchesProcessor;
    }).sort((a, b) => {
      let diff = 0;
      if (sortBy === 'deadline') {
        const dateA = new Date(a.submissionDeadline).getTime() || 0;
        const dateB = new Date(b.submissionDeadline).getTime() || 0;
        diff = dateA - dateB;
      } else if (sortBy === 'amount') {
        diff = (Number(b.disputeAmount) || 0) - (Number(a.disputeAmount) || 0);
      } else if (sortBy === 'date') {
        const dateA = new Date(a.disputeReceivedDate).getTime() || 0;
        const dateB = new Date(b.disputeReceivedDate).getTime() || 0;
        diff = dateB - dateA;
      }
      return sortOrder === 'asc' ? diff : -diff;
    });
  }, [disputes, searchTerm, statusFilter, priorityFilter, processorFilter, sortBy, sortOrder]);

  const statusTabs: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Cases', count: disputes.length },
    { id: 'new', label: 'New', count: disputes.filter(d => d.status === 'new').length },
    { id: 'under_review', label: 'Under Review', count: disputes.filter(d => d.status === 'under_review').length },
    { id: 'evidence_needed', label: 'Evidence Needed', count: disputes.filter(d => d.status === 'evidence_needed').length },
    { id: 'ready_for_submission', label: 'Ready', count: disputes.filter(d => d.status === 'ready_for_submission').length },
    { id: 'submitted', label: 'Submitted', count: disputes.filter(d => d.status === 'submitted').length },
    { id: 'won', label: 'Won', count: disputes.filter(d => d.status === 'won').length },
    { id: 'lost', label: 'Lost', count: disputes.filter(d => d.status === 'lost').length }
  ];

  const getStatusBadge = (status: DisputeStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/40">New</span>;
      case 'under_review':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/40">Under Review</span>;
      case 'evidence_needed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/40">Evidence Needed</span>;
      case 'ready_for_submission':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">Ready to Submit</span>;
      case 'submitted':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/40">Submitted</span>;
      case 'won':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">Won</span>;
      case 'lost':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800/40">Lost</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: DisputePriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[10px] font-black uppercase text-rose-400 bg-rose-950/80 border border-rose-800/40 px-1.5 py-0.5 rounded">Urgent</span>;
      case 'high':
        return <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950/80 border border-amber-800/40 px-1.5 py-0.5 rounded">High</span>;
      case 'medium':
        return <span className="text-[10px] font-semibold uppercase text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.5 rounded">Medium</span>;
      case 'low':
        return <span className="text-[10px] font-semibold uppercase text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">Low</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Chargeback Case Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Active Storefront: <span className="font-semibold text-slate-200">{currentOrg?.name}</span> • <span className="text-slate-400">{disputes.length} Total Disputes</span> • <span className="text-amber-400 font-medium">{disputes.filter(d => !['won', 'lost', 'closed'].includes(d.status)).length} Requiring Action</span>
          </p>
        </div>

        <button
          onClick={onOpenNewDispute}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-950/40 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Dispute Case
        </button>
      </div>

      {/* Status Workflow Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {statusTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
              statusFilter === tab.id
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800/60 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-bold">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by case ID, order, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Processor Filter */}
        <div>
          <select
            value={processorFilter}
            onChange={(e) => setProcessorFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Payment Processors</option>
            <option value="Stripe">Stripe</option>
            <option value="Shopify">Shopify Payments</option>
            <option value="PayPal">PayPal</option>
            <option value="Adyen">Adyen</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-1.5">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="deadline">Sort by Deadline</option>
            <option value="amount">Sort by Dispute Amount</option>
            <option value="date">Sort by Received Date</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Case & Order</th>
                <th className="py-3 px-4">Reason & Category</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Processor</th>
                <th className="py-3 px-4">Workflow Status</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs text-slate-300">
              {filteredDisputes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No chargeback cases found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredDisputes.map(dispute => {
                  const deadlineMs = new Date(dispute.submissionDeadline).getTime();
                  const diffDays = Math.ceil((deadlineMs - now) / (1000 * 3600 * 24));
                  const isPast = diffDays < 0;
                  const isExpiringSoon = diffDays >= 0 && diffDays <= 5 && !['won', 'lost', 'closed'].includes(dispute.status);

                  return (
                    <tr
                      key={dispute.id}
                      onClick={() => onSelectCase(dispute.id)}
                      className="hover:bg-slate-800/40 cursor-pointer transition group"
                    >
                      {/* Case & Order */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white font-mono">{dispute.internalCaseId}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span>{dispute.orderRef}</span>
                          <span>•</span>
                          <span className="truncate max-w-[120px]">{dispute.customerName}</span>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">{dispute.disputeReasonCategory}</div>
                        <div className="text-[11px] text-slate-500 font-mono">Code {dispute.disputeReasonCode}</div>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                        ${Number(dispute.disputeAmount).toFixed(2)}{' '}
                        <span className="text-[10px] font-normal text-slate-400">{dispute.currency}</span>
                      </td>

                      {/* Processor */}
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        {dispute.paymentProcessor}
                      </td>

                      {/* Workflow Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getStatusBadge(dispute.status)}
                      </td>

                      {/* Deadline */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className={`flex items-center gap-1 font-medium ${
                          isExpiringSoon ? 'text-amber-400 font-bold' : isPast ? 'text-slate-500' : 'text-slate-300'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>
                            {isPast 
                              ? 'Expired' 
                              : diffDays === 0 
                              ? 'Due Today' 
                              : `${diffDays}d left`}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">{dispute.submissionDeadline}</div>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getPriorityBadge(dispute.priority)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectCase(dispute.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Open Case Details"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          {currentRole === 'owner' && (
                            <button
                              onClick={() => deleteDispute(dispute.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition"
                              title="Delete Case"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="py-3 px-4 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Showing {filteredDisputes.length} of {disputes.length} dispute records</span>
          <span className="font-medium text-slate-300">
            Total Displayed: ${filteredDisputes.reduce((sum, d) => sum + (Number(d.disputeAmount) || 0), 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
