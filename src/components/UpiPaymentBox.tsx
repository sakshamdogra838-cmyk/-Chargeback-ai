import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Copy, 
  Check, 
  Smartphone, 
  ExternalLink, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Building2,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PlanTier } from '../types';
import { PLANS } from '../lib/plans';

interface UpiPaymentBoxProps {
  selectedPlan: PlanTier;
  billingInterval: 'monthly' | 'annual';
  onSuccess: (invoice: any) => void;
  customUpiId?: string;
  usdAmount?: number;
}

export const UpiPaymentBox: React.FC<UpiPaymentBoxProps> = ({
  selectedPlan,
  billingInterval,
  onSuccess,
  customUpiId = 'billing@chargebackai.io',
  usdAmount
}) => {
  const { currentOrg, upgradePlan, recordAuditLog } = useApp();
  const planConfig = PLANS[selectedPlan];
  
  const finalUsd = usdAmount ?? (
    billingInterval === 'annual' 
      ? planConfig.priceAnnualMonthly * 12 
      : planConfig.priceMonthly
  );
  
  // Standard conversion 1 USD = 84 INR (or standard nominal rate)
  const amountInr = Math.round(finalUsd * 84);
  
  const payeeUpi = customUpiId || 'billing@chargebackai.io';
  const payeeName = 'ChargebackAI Enterprise Treasury';
  const transactionNote = `ChargebackAI ${planConfig.name} Plan`;

  const upiDeepLink = `upi://pay?pa=${payeeUpi}&pn=${encodeURIComponent(payeeName)}&am=${amountInr}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Generate QR code data URL
  useEffect(() => {
    QRCode.toDataURL(upiDeepLink, {
      width: 280,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate UPI QR:', err));
  }, [upiDeepLink]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(payeeUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleCopyDeepLink = () => {
    navigator.clipboard.writeText(upiDeepLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleFillTestUtr = () => {
    const randomUtr = `42${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    setUtrNumber(randomUtr);
  };

  const handleVerifyPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.trim().length < 6) {
      setErrorMsg('Please enter the 12-digit UPI UTR or Transaction Ref number from your UPI app receipt.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/billing/process-upi-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: currentOrg?.id || 'org-active',
          planId: selectedPlan,
          billingInterval,
          upiId: payeeUpi,
          utrNumber: utrNumber.trim(),
          amountInr,
          customerEmail: currentOrg?.ownerId || 'customer@example.com'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'UPI verification failed');
      }

      await upgradePlan(selectedPlan);
      recordAuditLog(
        'PAYMENT_PROCESSED', 
        'Billing', 
        data.invoice.id, 
        `Paid ₹${amountInr} ($${finalUsd}) via UPI ${payeeUpi} (UTR: ${utrNumber})`
      );

      onSuccess(data.invoice);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please check your UTR number.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4 text-slate-200">
      {/* Payee Info Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
            Direct UPI & QR Payout Account
          </span>
          <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
            <span>{payeeUpi}</span>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full font-semibold">
              FamX / Bank
            </span>
          </div>
          <span className="text-xs text-slate-400">Recipient: ChargebackAI Enterprise Treasury</span>
        </div>

        <button
          type="button"
          onClick={handleCopyUpi}
          className="px-3.5 py-2 bg-slate-900 border border-slate-700 hover:border-emerald-500/60 text-xs font-semibold text-slate-200 hover:text-white rounded-xl flex items-center gap-1.5 transition self-start sm:self-auto shrink-0"
        >
          {copiedUpi ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied UPI ID!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Copy ID: {payeeUpi}</span>
            </>
          )}
        </button>
      </div>

      {/* QR Code + Instructions Container */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6">
        {/* Scannable QR Code */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative p-3 bg-white rounded-2xl shadow-xl shadow-cyan-950/40 border-2 border-cyan-500/30">
            {qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt={`Scan to pay ${payeeUpi}`} 
                className="w-48 h-48 rounded-xl object-contain"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                Generating QR...
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-amber-400/90 border-2 border-slate-900 flex items-center justify-center shadow-lg">
                <span className="text-slate-950 font-black text-xs">Fam</span>
              </div>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 font-medium flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5 text-cyan-400" />
            Scan with Google Pay, PhonePe, FamPay, Paytm
          </span>
        </div>

        {/* Pricing Details & App Triggers */}
        <div className="flex-1 space-y-3.5 w-full">
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Selected Plan:</span>
              <span className="text-xs font-bold text-white">{planConfig.name}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Total in INR:</span>
              <span className="text-lg font-black text-emerald-400 font-mono">₹{amountInr.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-baseline text-[11px] text-slate-500">
              <span>Equivalent:</span>
              <span>${finalUsd} USD</span>
            </div>
          </div>

          {/* Quick Pay Buttons on Mobile */}
          <div className="space-y-2">
            <a
              href={upiDeepLink}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
            >
              <Smartphone className="w-4 h-4" />
              Pay via UPI App (GPay / PhonePe / FamX)
            </a>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyDeepLink}
                className="flex-1 py-1.5 px-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-[11px] rounded-lg flex items-center justify-center gap-1 transition"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy Payment URI
              </button>
              <button
                type="button"
                onClick={handleFillTestUtr}
                className="py-1.5 px-3 bg-cyan-950/40 border border-cyan-800/40 hover:bg-cyan-950 text-cyan-300 text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1 transition"
              >
                Auto-fill Test UTR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Form */}
      <form onSubmit={handleVerifyPayment} className="space-y-3 pt-2">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Enter 12-Digit UPI Reference Number (UTR / Ref ID):
          </label>
          <input
            type="text"
            required
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value)}
            placeholder="e.g. 428910293812 or bank transaction ID"
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono tracking-wider focus:outline-none focus:border-cyan-500 transition"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            Found on your Google Pay, PhonePe, Paytm, or FamPay transaction confirmation screen.
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isVerifying}
          className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-950/50 transition flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Verifying UPI Transaction with Receiver ({payeeUpi})...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Verify UTR & Activate {planConfig.name} Plan Now
            </>
          )}
        </button>
      </form>
    </div>
  );
};
