import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Printer, 
  Download, 
  X, 
  QrCode, 
  Check, 
  Copy, 
  Sparkles, 
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MerchantQrStandeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  upiId?: string;
}

export const MerchantQrStandeeModal: React.FC<MerchantQrStandeeModalProps> = ({
  isOpen,
  onClose,
  upiId
}) => {
  const { currentOrg } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const payeeUpi = upiId || currentOrg?.upiPayoutId || 'settlements@apexcommerce.bank';
  const payeeName = currentOrg?.name || 'Apex Global Commerce';
  const genericUpiUri = `upi://pay?pa=${payeeUpi}&pn=${encodeURIComponent(payeeName)}&cu=INR`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(genericUpiUri, {
        width: 380,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error(err));
    }
  }, [isOpen, genericUpiUri]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(payeeUpi);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 my-8 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Official Merchant UPI QR Display</h3>
              <p className="text-[11px] text-slate-400">For retail counter, invoices, or storefront</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Printable QR Standee */}
        <div 
          id="merchant-qr-standee" 
          className="bg-white text-slate-950 rounded-2xl p-6 border-4 border-slate-950 shadow-2xl flex flex-col items-center text-center space-y-4"
        >
          {/* Header on Standee */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-black text-sm">
              AI
            </div>
            <div className="text-left">
              <div className="text-sm font-black tracking-tight text-slate-950">Chargeback AI</div>
              <div className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">Accepted Here</div>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-800">
            Scan & Pay with Any UPI App
          </div>

          {/* QR Code Container */}
          <div className="relative p-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl shadow-inner">
            {qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt={`Scan to pay ${payeeUpi}`} 
                className="w-56 h-56 rounded-xl object-contain"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-xs text-slate-400">
                Generating QR...
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-[10px]">UPI</span>
              </div>
            </div>
          </div>

          {/* Payee UPI ID display */}
          <div className="w-full bg-slate-100 p-2.5 rounded-xl border border-slate-300">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">UPI ID / VPA</div>
            <div className="text-sm font-black font-mono text-slate-950">{payeeUpi}</div>
            <div className="text-[10px] text-slate-600 font-medium">Beneficiary: {payeeName}</div>
          </div>

          {/* Supported UPI Apps Row */}
          <div className="flex items-center justify-center gap-2 pt-1 border-t border-slate-200 w-full text-[10px] text-slate-600 font-bold">
            <span className="px-1.5 py-0.5 rounded bg-slate-100">GPay</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100">PhonePe</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100">FamPay</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100">Paytm</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100">BHIM</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 pt-2">
          <button
            onClick={handleCopyUpi}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copied ? 'Copied!' : 'Copy UPI ID'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Standee</span>
          </button>
        </div>
      </div>
    </div>
  );
};
