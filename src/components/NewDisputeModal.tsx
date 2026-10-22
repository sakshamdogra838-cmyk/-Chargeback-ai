import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  FileText, 
  DollarSign, 
  Calendar, 
  CreditCard, 
  Truck, 
  User, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { DisputePriority, DisputeStatus } from '../types';

interface NewDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (caseId: string) => void;
}

export const NewDisputeModal: React.FC<NewDisputeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { currentOrg, addDispute } = useApp();

  const [internalCaseId, setInternalCaseId] = useState(`DISP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [orderRef, setOrderRef] = useState(`ORD-${Math.floor(10000 + Math.random() * 90000)}`);
  const [transactionRef, setTransactionRef] = useState(`ch_${Math.random().toString(36).substring(2, 14)}`);
  const [paymentProcessor, setPaymentProcessor] = useState('Shopify Payments (Stripe)');
  const [disputeReasonCode, setDisputeReasonCode] = useState('13.1');
  const [disputeReasonCategory, setDisputeReasonCategory] = useState('Merchandise Not Received');
  const [disputeAmount, setDisputeAmount] = useState('199.00');
  const [currency, setCurrency] = useState(currentOrg?.currency || 'USD');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('UPS Ground');
  const [submissionDeadline, setSubmissionDeadline] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [priority, setPriority] = useState<DisputePriority>('high');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !disputeAmount) {
      setError('Please provide customer name and valid dispute amount.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const created = await addDispute({
        internalCaseId,
        orderRef,
        transactionRef,
        paymentProcessor,
        disputeReasonCode,
        disputeReasonCategory,
        disputeAmount: parseFloat(disputeAmount) || 0,
        currency,
        transactionDate: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
        disputeReceivedDate: new Date().toISOString().split('T')[0],
        submissionDeadline,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || `${customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        trackingNumber: trackingNumber.trim() || undefined,
        carrier: carrier.trim() || undefined,
        refundStatus: 'none',
        status: 'new',
        priority,
        winStatus: 'pending',
        recoveredAmount: 0,
        notes: notes.trim(),
        evidenceItems: [
          { id: 'ev-1', type: 'order', label: 'Order Confirmation', description: 'Itemized invoice matching billing address', required: true, collected: true },
          { id: 'ev-2', type: 'delivery', label: 'Carrier Proof of Delivery', description: 'GPS or signature scan from carrier', required: true, collected: !!trackingNumber.trim() }
        ]
      });

      onSuccess(created.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create dispute case');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 my-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Log New Chargeback Dispute
            </h3>
            <p className="text-xs text-slate-400">
              Workspace: <strong className="text-slate-200">{currentOrg?.name}</strong>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Internal Case ID *</label>
              <input
                type="text"
                required
                value={internalCaseId}
                onChange={(e) => setInternalCaseId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Order Reference *</label>
              <input
                type="text"
                required
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Dispute Amount *</label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="number"
                  step="0.01"
                  required
                  value={disputeAmount}
                  onChange={(e) => setDisputeAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Submission Deadline *</label>
              <input
                type="date"
                required
                value={submissionDeadline}
                onChange={(e) => setSubmissionDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Dispute Reason Category</label>
              <select
                value={disputeReasonCategory}
                onChange={(e) => {
                  setDisputeReasonCategory(e.target.value);
                  if (e.target.value === 'Merchandise Not Received') setDisputeReasonCode('13.1');
                  else if (e.target.value === 'Fraudulent - Card Absent') setDisputeReasonCode('10.4');
                  else if (e.target.value === 'Not as Described') setDisputeReasonCode('13.3');
                  else if (e.target.value === 'Cancelled Recurring') setDisputeReasonCode('13.7');
                  else if (e.target.value === 'Credit Not Processed') setDisputeReasonCode('13.6');
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Merchandise Not Received">Merchandise Not Received (13.1)</option>
                <option value="Fraudulent - Card Absent">Fraudulent - Card Absent (10.4)</option>
                <option value="Not as Described">Not as Described (13.3)</option>
                <option value="Cancelled Recurring">Cancelled Recurring Transaction (13.7)</option>
                <option value="Credit Not Processed">Credit Not Processed (13.6)</option>
                <option value="Duplicate Charge">Duplicate Processing (12.6)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Payment Gateway / Processor</label>
              <select
                value={paymentProcessor}
                onChange={(e) => setPaymentProcessor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Shopify Payments (Stripe)">Shopify Payments (Stripe)</option>
                <option value="Stripe">Stripe</option>
                <option value="PayPal">PayPal Commerce</option>
                <option value="Adyen">Adyen</option>
                <option value="Square">Square</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Customer Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Jonathan Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Customer Email</label>
              <input
                type="email"
                placeholder="j.doe@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tracking Number</label>
              <input
                type="text"
                placeholder="e.g. 1Z9999999999999999"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Case Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as DisputePriority)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="urgent">Urgent (&lt; 48 hours or &gt; $500)</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Investigator Notes</label>
            <textarea
              rows={2}
              placeholder="Initial context, order items, customer communication..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              {isSubmitting ? 'Creating Case...' : 'Save Dispute Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
