import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Copy, 
  Check, 
  FileText, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Zap,
  ArrowRight
} from 'lucide-react';

interface DemoCase {
  id: string;
  network: 'Visa' | 'Mastercard' | 'UPI' | 'Amex';
  reasonCode: string;
  reasonTitle: string;
  amount: string;
  amountInr: string;
  customerName: string;
  claim: string;
  evidenceItems: string[];
  rebuttalLetter: string;
}

const DEMO_CASES: DemoCase[] = [
  {
    id: 'DEMO-13.1',
    network: 'Visa',
    reasonCode: '13.1',
    reasonTitle: 'Merchandise / Services Not Received',
    amount: '$249.00',
    amountInr: '₹20,916',
    customerName: 'Marcus Vance',
    claim: 'Cardholder states ordered package was never delivered to their physical residence.',
    evidenceItems: [
      'FedEx Signed Proof of Delivery (Signature matching cardholder last name)',
      'GPS delivery geo-coordinates timestamped at recipient front porch',
      'Matching AVS (Address Verification Service) Full Match code: Y',
      'Customer IP address matches order placement and courier delivery metro area'
    ],
    rebuttalLetter: `FORMAL DISPUTE REBUTTAL STATEMENT
To: Issuing Bank Dispute Resolution Department
Case ID: DEMO-13.1 | Reason: Visa 13.1 (Merchandise Not Received)
Disputed Amount: $249.00 USD (INR Equivalent ₹20,916)
Merchant: Chargeback AI Merchant Workspace

SUMMARY OF DISPUTE REBUTTAL:
We respectfully rebut the cardholder's claim of non-receipt. Pursuant to Visa Core Rules Section 5.4.1 (Compelling Evidence 3.0), the merchant provides definitive proof of physical delivery to the cardholder's verified billing address.

DOCUMENTED EVIDENCE ATTACHED:
1. Proof of Delivery: FedEx Tracking #748920192842 was successfully delivered on Sept 28, 2026 at 14:22 EST. Signature captured: "M. Vance".
2. Carrier GPS Coordinates: Latitude 40.7128° N, Longitude 74.0060° W, matching the street address on file.
3. AVS Verification: Full street and 5-digit postal code matched (AVS Code "Y").
4. Fraud Preclusion: IP address at checkout (172.56.21.90) originates from the exact same residential ISP.

CONCLUSION:
Because all condition requirements under Visa Compelling Evidence standards have been satisfied, we request the immediate reversal of this chargeback and credit restoration to merchant.`
  },
  {
    id: 'DEMO-10.4',
    network: 'Visa',
    reasonCode: '10.4',
    reasonTitle: 'Other Fraud - Card-Absent Environment',
    amount: '$580.00',
    amountInr: '₹48,720',
    customerName: 'Elena Rostova',
    claim: 'Cardholder claims transaction was unauthorized friendly fraud.',
    evidenceItems: [
      'Visa Compelling Evidence 3.0: 2 previous undisputed transactions on same card',
      'Device Fingerprint ID matches prior login from same iPhone 15 Pro Max',
      'Cardholder logged in and streamed 18 hours of video content after purchase',
      'Email address and mobile phone match 2-factor OTP verification log'
    ],
    rebuttalLetter: `FORMAL DISPUTE REBUTTAL UNDER VISA COMPELLING EVIDENCE 3.0
To: Dispute Processing Unit
Case Reference: DEMO-10.4 | Reason: Visa 10.4 (Card-Absent Fraud)
Disputed Amount: $580.00 USD (₹48,720 INR)

AFFIRMATIVE DEFENSE CITING VISA CE 3.0 MANDATE:
Under Visa Rules revised for Compelling Evidence 3.0, a fraud dispute MUST be invalidated if the merchant proves at least two previous undisputed transactions within the prior 365 days sharing the same device fingerprint and IP address.

EVIDENCE SUBMITTED:
- Historical Transaction #1: Transacted 120 days prior ($120.00) - Undisputed, Device ID: #dev_88fa12
- Historical Transaction #2: Transacted 65 days prior ($240.00) - Undisputed, Device ID: #dev_88fa12
- Current Disputed Transaction: Initiated from identical Device ID #dev_88fa12 and ISP subnet.
- Service Consumption Log: User account actively accessed digital entitlements over 18 cumulative sessions.

DECISION REQUEST:
Under Visa rulebook guidelines, this qualifies for immediate remedy without merchant liability. Please close dispute in merchant favor.`
  },
  {
    id: 'DEMO-UPI-01',
    network: 'UPI',
    reasonCode: 'UPI-U1',
    reasonTitle: 'UPI Chargeback / Transaction Reversal Claim',
    amount: '$99.00',
    amountInr: '₹8,316',
    customerName: 'Aditya Sharma',
    claim: 'Payer claims payment to merchant settlement VPA was unauthorized or accidental.',
    evidenceItems: [
      'NPCI 12-Digit UTR Bank Reference successfully settled to verified merchant account',
      'Explicit UPI Intent approval authorized via user biometric/MPIN token',
      'Immediate in-app software license delivery timestamped within 4 seconds of settlement',
      'User completed multi-factor onboarding session with authenticated email'
    ],
    rebuttalLetter: `UPI TRANSACTION DISPUTE REBUTTAL DOSSIER
NPCI / Payment Aggregator Dispute Operations
Payee UPI ID: merchant.clearing@icici (ChargebackAI Verified Merchant)
Disputed Value: INR ₹8,316 ($99.00 USD)

AUTHENTICATED PAYMENT PROOF:
1. Two-Factor MPIN Authorization: Transaction executed via PSP (PhonePe / GPay / Paytm) requiring payer's confidential hardware-protected MPIN.
2. NPCI UTR Clearance: Bank Ref #429810294827 settled conclusively into verified merchant account.
3. Digital Fulfilment Confirmation: Full SaaS software entitlement was provisioned instantly to customer's account upon settlement.

VERDICT REQUEST:
As this is a fully verified 2FA authenticated transaction with instant digital receipt and service consumption, claim is unfounded. Reverse dispute hold immediately.`
  }
];

export const LiveDemoRebuttalBox: React.FC = () => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeLetter, setActiveLetter] = useState(DEMO_CASES[0].rebuttalLetter);

  const currentCase = DEMO_CASES[selectedCaseIndex];

  const handleSelectCase = (index: number) => {
    setSelectedCaseIndex(index);
    setIsGenerating(true);
    setTimeout(() => {
      setActiveLetter(DEMO_CASES[index].rebuttalLetter);
      setIsGenerating(false);
    }, 400);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Interactive Live Demonstration</span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              Gemini 3.8 Flash
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
            Watch AI Assemble a Winning Evidence Rebuttal
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select any simulated chargeback scenario below to observe how the AI compiles evidence and legal rebuttal arguments.
          </p>
        </div>

        {/* Case Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          {DEMO_CASES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => handleSelectCase(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                selectedCaseIndex === i 
                  ? 'bg-cyan-500 text-slate-950 shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-[10px] font-mono opacity-80">{c.network}</span>
              <span>{c.reasonCode}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Case Details Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500">Dispute Reason</span>
          <div className="text-sm font-bold text-white mt-0.5">{currentCase.reasonTitle}</div>
          <span className="text-[11px] text-cyan-400 font-mono">Code: {currentCase.reasonCode} ({currentCase.network})</span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500">Disputed Amount</span>
          <div className="text-base font-black text-emerald-400 mt-0.5">{currentCase.amount}</div>
          <span className="text-[11px] text-slate-400">≈ {currentCase.amountInr} (Direct UPI / Card)</span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500">Cardholder Claim</span>
          <div className="text-xs text-slate-300 mt-0.5 italic">&quot;{currentCase.claim}&quot;</div>
        </div>
      </div>

      {/* Evidence Checklist + Generated Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Evidence items */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Auto-Assembled Evidence Items:
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
              4/4 Required Proofs Present
            </span>
          </div>

          <div className="space-y-2">
            {currentCase.evidenceItems.map((item, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
              <Zap className="w-3.5 h-3.5" />
              <span>Automated Visa CE3.0 / NPCI Rule Matching</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Issuing bank arbiters follow precise rule specifications. The AI structures proof into the mandated format so agents approve reversal without reading lengthy paragraphs.
            </p>
          </div>
        </div>

        {/* AI Output Rebuttal Letter Box */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3 relative font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-sans">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white">Generated Counter-Evidence Submission</span>
            </div>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-slate-900 border border-slate-700 hover:border-cyan-500 text-[11px] font-semibold text-slate-300 hover:text-white rounded-lg flex items-center gap-1 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-cyan-400" />
                  <span>Copy Letter</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            {isGenerating ? (
              <div className="h-64 flex flex-col items-center justify-center space-y-2 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                <span className="text-xs font-sans">Reasoning dispute evidence & compiling citation...</span>
              </div>
            ) : (
              <pre className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto pr-1">
                {activeLetter}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
