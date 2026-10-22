import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  RefreshCw,
  Sparkles,
  QrCode,
  Smartphone
} from 'lucide-react';
import { PLANS } from '../lib/plans';
import { PlanTier } from '../types';
import { UpiPaymentBox } from './UpiPaymentBox';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PlanTier;
  billingInterval: 'monthly' | 'annual';
  onSuccess: (newPlan: PlanTier) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  billingInterval,
  onSuccess
}) => {
  const { currentOrg, upgradePlan, recordAuditLog } = useApp();
  const planConfig = PLANS[selectedPlan];

  const priceMonthly = planConfig.priceMonthly;
  const priceAnnualMonthly = planConfig.priceAnnualMonthly;
  const totalAmount = billingInterval === 'annual' ? priceAnnualMonthly * 12 : priceMonthly;

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [cardName, setCardName] = useState('Sarah Jenkins');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expDate, setExpDate] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [zip, setZip] = useState('94107');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedInvoice, setCompletedInvoice] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleFillTestCard = (type: 'visa' | 'mastercard' | 'decline') => {
    if (type === 'visa') {
      setCardNumber('4242 4242 4242 4242');
      setExpDate('12/28');
      setCvc('123');
    } else if (type === 'mastercard') {
      setCardNumber('5555 5555 5555 4444');
      setExpDate('08/29');
      setCvc('456');
    } else {
      setCardNumber('4000 0000 0000 0002');
      setExpDate('05/27');
      setCvc('999');
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expDate || !cvc) {
      setErrorMessage('Please complete all card payment fields');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/billing/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: currentOrg?.id,
          planId: selectedPlan,
          billingInterval,
          cardNumber,
          expDate,
          cvc,
          customerEmail: currentUser?.email || 'billing@chargebackai.io'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      setCompletedInvoice(data.invoice);
      await upgradePlan(selectedPlan);
      recordAuditLog('PAYMENT_PROCESSED', 'Billing', data.invoice.id, `Paid $${totalAmount} for ${planConfig.name} plan`);
      onSuccess(selectedPlan);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 my-8 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Secure Checkout & Activation</h3>
              <p className="text-xs text-slate-400">Workspace: <strong className="text-slate-200">{currentOrg?.name}</strong></p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {completedInvoice ? (
          /* Payment Success & Receipt View */
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Payment Confirmed & Subscription Activated</h4>
              <p className="text-xs text-slate-400 mt-1">
                Your workspace has been upgraded to the <strong>{planConfig.name} Plan</strong>.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Receipt Number:</span>
                <span className="text-white font-bold">{completedInvoice.receiptNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount Paid:</span>
                <span className="text-emerald-400 font-bold">
                  {completedInvoice.amountInr 
                    ? `₹${completedInvoice.amountInr.toLocaleString('en-IN')} ($${completedInvoice.amount} USD)` 
                    : `$${completedInvoice.amount}.00 USD`}
                </span>
              </div>
              {completedInvoice.paymentMethod && (
                <div className="flex justify-between text-slate-400">
                  <span>Payment Channel:</span>
                  <span className="text-cyan-400 font-bold">{completedInvoice.paymentMethod}</span>
                </div>
              )}
              {completedInvoice.utrNumber && (
                <div className="flex justify-between text-slate-400">
                  <span>UPI Ref / UTR:</span>
                  <span className="text-amber-400 font-bold">{completedInvoice.utrNumber}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Billing Cycle:</span>
                <span className="text-slate-200 capitalize">{completedInvoice.billingInterval}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold uppercase">VERIFIED & SETTLED</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Print / Save Receipt
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl shadow-lg transition"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Order Summary Pill */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">{planConfig.name} Plan</span>
                <span className="block text-[11px] text-slate-400 capitalize">
                  {billingInterval} Billing {billingInterval === 'annual' ? '(20% Savings applied)' : ''}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-cyan-400 font-mono">${totalAmount}</span>
                <span className="text-[10px] text-slate-500 block">USD (≈ ₹{(totalAmount * 84).toLocaleString('en-IN')})</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 gap-1">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                  paymentMethod === 'upi'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Instant UPI & QR Code</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                  paymentMethod === 'card'
                    ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit / Debit Card</span>
              </button>
            </div>

            {paymentMethod === 'upi' ? (
              <UpiPaymentBox
                selectedPlan={selectedPlan}
                billingInterval={billingInterval}
                customUpiId={currentOrg?.upiPayoutId || 'settlement.merchant@upi'}
                onSuccess={(invoice) => {
                  setCompletedInvoice(invoice);
                  onSuccess(selectedPlan);
                }}
              />
            ) : (
              /* Credit Card Entry Form */
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Quick Test Cards Selector */}
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Instant Test Cards (Simulation Mode):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleFillTestCard('visa')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 rounded"
                    >
                      Visa 4242 (Pass)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillTestCard('mastercard')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 rounded"
                    >
                      Mastercard 5555 (Pass)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillTestCard('decline')}
                      className="px-2 py-1 bg-rose-950/40 border border-rose-800/40 text-[10px] font-semibold text-rose-300 rounded"
                    >
                      Decline Card (Test 402)
                    </button>
                  </div>
                </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cardholder Full Name</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Card Number</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Expiry</label>
                  <input
                    type="text"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">CVC</label>
                  <input
                    type="text"
                    required
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="94107"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                256-bit TLS Encryption
              </span>
              <span>Cancel anytime</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-950/50 transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Authorizing Payment...
                </>
              ) : (
                <>
                  Pay ${totalAmount}.00 & Activate {planConfig.name}
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}
          </div>
        )}
      </div>
    </div>
  );
};
