import React, { useState } from 'react';
import { 
  HelpCircle, 
  X, 
  CreditCard, 
  Globe, 
  Zap, 
  Smartphone, 
  Copy, 
  Check, 
  ArrowRight, 
  DollarSign, 
  Building2, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Landmark
} from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBilling?: () => void;
  onOpenPlayStore?: () => void;
  onOpenSettings?: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenBilling,
  onOpenPlayStore,
  onOpenSettings
}) => {
  const [activeTab, setActiveTab] = useState<'payments' | 'link' | 'limits' | 'playstore'>('payments');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const appUrl = window.location.origin || 'https://ais-pre-7mkbsrk7gt3yzl6oikmkc4-186749597303.asia-southeast1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Merchant Operations & Launch Guide
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Comprehensive
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Clear answers to how payments work, where your money goes, links, and limits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-4 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'payments'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Where Do Payments Go?
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'link'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            Your Live Link
          </button>
          <button
            onClick={() => setActiveTab('limits')}
            className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'limits'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            Traffic & Limits
          </button>
          <button
            onClick={() => setActiveTab('playstore')}
            className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'playstore'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Play Store Launch
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* TAB 1: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">All Money Goes Directly to YOUR Bank Account</h3>
                    <p className="text-xs text-slate-400">
                      Nobody takes a cut of your earnings. Payments from your users go straight to your Stripe or merchant account.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Flow Diagram */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  How The Money Flows (Step-by-Step):
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
                  <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
                    <div className="text-cyan-400 font-bold text-xs mb-1">1. Customer Subscribes</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      A business visits your website, picks a plan (e.g. $299/mo), and enters their credit card.
                    </p>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
                    <div className="text-cyan-400 font-bold text-xs mb-1">2. Stripe Processes It</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Stripe securely handles the charge, checks fraud protection, and marks the invoice paid.
                    </p>
                  </div>

                  <div className="bg-slate-900/90 border border-emerald-500/40 p-3.5 rounded-xl bg-emerald-950/10">
                    <div className="text-emerald-400 font-bold text-xs mb-1">3. Direct Deposit to You</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Stripe automatically transfers the funds to your connected personal or business checking account.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct UPI & QR Payments Callout */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Direct UPI & QR Payouts Active (India & Global)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                    FamX / Any UPI App
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The verified settlement account is configured as <strong className="text-white font-mono">billing@chargebackai.io</strong> (Beneficiary: ChargebackAI Enterprise Treasury). Customers scanning checkout QR codes have payments credited directly and instantly via secure banking rails.
                </p>
              </div>

              {/* Two Ways Money Is Made */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs mb-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    Way 1: SaaS Monthly Subscriptions
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Merchants pay you a recurring subscription ($99 to $799/month) to access your AI chargeback defense software.
                  </p>
                  {onOpenBilling && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenBilling();
                      }}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      View Pricing Plans <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs mb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Way 2: Dispute Recoveries for Stores
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    When the AI wins a credit card chargeback dispute, the merchant keeps their money instead of losing it to banks.
                  </p>
                  {onOpenSettings && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSettings();
                      }}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      Configure Payment Gateway <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE LINK */}
          {activeTab === 'link' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
                <h3 className="text-white font-semibold text-sm mb-1">Your Website is Live Right Now</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  You can share this web address with anyone in the world. It loads instantly on iPhones, Android phones, Mac, and Windows.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 select-all truncate">
                    {appUrl}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs rounded-xl hover:from-cyan-400 hover:to-blue-500 transition shadow-md shrink-0"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Live Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    Custom Domain (.com / .io)
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You can point your own domain (e.g. <code className="text-slate-300 bg-slate-900 px-1 py-0.5 rounded">mycompany.com</code>) anytime via Cloud Run or Google Cloud Domain mappings.
                  </p>
                </div>

                <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    Phone Home Screen
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Visitors opening the link on mobile will see an "Install App" prompt to add it directly to their home screen like a native app.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIMITS */}
          {activeTab === 'limits' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
                <h3 className="text-white font-semibold text-sm mb-1">What Are The Limits?</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Everything is built on Google Cloud serverless architecture. Here is what that means in simple numbers:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
                    <div className="text-xl font-bold text-cyan-400">Unlimited</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-1">Website Visitors</div>
                    <p className="text-[10px] text-slate-500 mt-1">Auto-scales to handle traffic spikes</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
                    <div className="text-xl font-bold text-emerald-400">10,000+</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-1">Disputes per Day</div>
                    <p className="text-[10px] text-slate-500 mt-1">AI generates proof packets in seconds</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
                    <div className="text-xl font-bold text-amber-400">Enterprise</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-1">Cloud Firestore DB</div>
                    <p className="text-[10px] text-slate-500 mt-1">Persistent & securely encrypted</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl">
                <div className="text-xs font-semibold text-slate-200 mb-1">Need higher quotas?</div>
                <p className="text-xs text-slate-400">
                  Because this is running on your Google Cloud environment, you never hit hard artificial limits — you can run millions of requests without rewriting your codebase.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: PLAY STORE */}
          {activeTab === 'playstore' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
                <h3 className="text-white font-semibold text-sm mb-1">Publish to Google Play Store in 3 Steps</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  You don't need to know Java or Kotlin. Your app already includes a valid PWA manifest and service worker.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Generate the Android Package (.aab)</div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Use Microsoft PWABuilder (free tool) or Bubblewrap. Enter your live URL: <code className="text-cyan-300">{appUrl}</code>. It creates your signed Android bundle in 60 seconds.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Create Google Play Console Account</div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Go to <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="text-cyan-400 underline">play.google.com/console</a> and sign in with your Google email ($25 one-time fee to Google).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Upload and Click "Publish"</div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Upload the generated <code className="text-slate-300">.aab</code> package, add your app title and description, and submit for Google review.
                      </p>
                    </div>
                  </div>
                </div>

                {onOpenPlayStore && (
                  <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPlayStore();
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-xs rounded-xl hover:from-emerald-500 hover:to-teal-400 transition flex items-center gap-2"
                    >
                      <Smartphone className="w-4 h-4" />
                      Open Full Play Store Assistant
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Live App Status: Online & Accepting Customers
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            Got It! Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
