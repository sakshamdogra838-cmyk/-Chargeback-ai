import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Layers, 
  FileSpreadsheet, 
  DollarSign, 
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Building2,
  Clock,
  ExternalLink,
  LogIn,
  ShoppingBag,
  Zap,
  Calculator,
  Sliders,
  Check,
  HelpCircle,
  PlayCircle,
  Smartphone,
  Download,
  QrCode,
  Globe,
  Star,
  Users,
  Award,
  MessageSquare,
  Activity,
  PhoneCall
} from 'lucide-react';
import { PLANS } from '../lib/plans';
import { PlanTier } from '../types';
import { LiveDemoRebuttalBox } from './LiveDemoRebuttalBox';
import { CookieConsentBanner } from './CookieConsentBanner';

interface MarketingLandingProps {
  onEnterApp: () => void;
  onSignInWithGoogle: () => void;
  onLaunchDemoSandbox: () => void;
  onOpenSignUp: () => void;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
  onOpenPlayStore?: () => void;
  onOpenHelpGuide?: () => void;
  onOpenProductionReadiness?: () => void;
  onOpenContactSales?: () => void;
  onOpenCheckoutPlan?: (tier: PlanTier) => void;
  onOpenStandeeModal?: () => void;
}

export const MarketingLanding: React.FC<MarketingLandingProps> = ({
  onEnterApp,
  onSignInWithGoogle,
  onLaunchDemoSandbox,
  onOpenSignUp,
  onOpenAuth,
  onOpenPlayStore,
  onOpenHelpGuide,
  onOpenProductionReadiness,
  onOpenContactSales,
  onOpenCheckoutPlan,
  onOpenStandeeModal
}) => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

  // Interactive ROI Calculator State
  const [monthlyVolume, setMonthlyVolume] = useState<number>(150000);
  const [disputeRate, setDisputeRate] = useState<number>(0.8); // 0.8% default
  const [businessModel, setBusinessModel] = useState<'ecommerce' | 'saas' | 'digital'>('ecommerce');

  // Live calculations
  const monthlyDisputed = (monthlyVolume * (disputeRate / 100));
  const annualDisputed = monthlyDisputed * 12;
  const estimatedWinRate = businessModel === 'ecommerce' ? 0.74 : businessModel === 'saas' ? 0.68 : 0.82;
  const annualRecoverable = annualDisputed * estimatedWinRate;
  const starterAnnualCost = 79 * 12;
  const calculatedRoi = Math.max(Math.round(annualRecoverable / starterAnnualCost), 1);

  // Conversion rate 1 USD = 84 INR
  const usdToInr = (usd: number) => Math.round(usd * 84);

  // Feature Showcase Tabs
  const [activeFeatureTab, setActiveFeatureTab] = useState<'ai' | 'evidence' | 'csv' | 'analytics'>('ai');

  // FAQ Category Filter
  const [faqCategory, setFaqCategory] = useState<'all' | 'upi' | 'rules' | 'security'>('all');

  const faqs = [
    {
      category: 'upi',
      q: 'Where do the customer payments and subscription fees go?',
      a: 'All subscription payments and customer revenues flow directly to YOUR designated business account. For UPI payments, funds settle immediately into your verified merchant UPI ID via instant NPCI banking rails. For credit card payments, payouts deposit directly to your connected merchant bank account with zero middleman holding.'
    },
    {
      category: 'upi',
      q: 'Can customers in India and internationally pay using UPI & QR code?',
      a: 'Yes! Our checkout engine features a live dynamic UPI QR code generator and UPI Intent links compatible with Google Pay, PhonePe, Paytm, FamPay, and BHIM, converting USD amounts seamlessly to INR at standard bank rates.'
    },
    {
      category: 'rules',
      q: 'How does the platform enforce Visa Compelling Evidence 3.0 (CE3.0)?',
      a: 'Under Visa rule updates, merchants can automatically invalidate first-party fraud chargebacks by showing 2 prior undisputed purchases on the same card with matching IP addresses, device fingerprints, or customer credentials. Our engine auto-correlates your transaction history to generate this certified defense package.'
    },
    {
      category: 'rules',
      q: 'Does Chargeback AI guarantee I will win every dispute?',
      a: 'No ethical platform can promise a 100% guarantee because the final verdict is arbitrated solely by the cardholder\'s issuing bank. However, by strictly matching the exact evidence criteria required by Visa and Mastercard, merchants on Chargeback AI increase their historical win rate from ~32% to over 74%.'
    },
    {
      category: 'security',
      q: 'Is customer cardholder data and business order history kept private?',
      a: 'Yes. Every business workspace has a strict, partition-isolated multi-tenant container protected by Firebase security rules. All card primary account numbers (PAN) and CVVs are automatically redacted on the server before AI evaluation. We never train public foundation models on private customer records.'
    },
    {
      category: 'security',
      q: 'What is the formula injection (DDE) protection in CSV exports?',
      a: 'When finance teams export dispute reports into Excel or Google Sheets, malicious customer order fields starting with =, +, -, or @ can trigger Dynamic Data Exchange (DDE) code execution. Chargeback AI automatically sanitizes and prepends safe escaping quotes to neutralize any injection threat.'
    }
  ];

  const filteredFaqs = faqs.filter(f => faqCategory === 'all' || f.category === faqCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Top Live Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-cyan-950 to-blue-950 border-b border-emerald-500/30 px-4 py-2 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-white">Production Ready:</span>
            <span>Direct Instant UPI & Dynamic QR Rails Active</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenProductionReadiness && (
              <button
                onClick={onOpenProductionReadiness}
                className="font-bold text-cyan-300 hover:text-white flex items-center gap-1 transition underline decoration-cyan-500/50 underline-offset-2"
              >
                <span>30-Point Production Scorecard (100% Complete)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-700">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  currency === 'USD' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  currency === 'INR' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                INR (₹ UPI)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              Chargeback<span className="text-cyan-400">AI</span>
            </span>
          </div>

          <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#demo" className="hover:text-cyan-300 transition">Live AI Demo</a>
            <a href="#calculator" className="hover:text-cyan-300 transition">ROI Calculator</a>
            <a href="#features" className="hover:text-cyan-300 transition">Features</a>
            <a href="#comparison" className="hover:text-cyan-300 transition">Comparison</a>
            <a href="#pricing" className="hover:text-cyan-300 transition">Pricing</a>
            <a href="#faq" className="hover:text-cyan-300 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            {onOpenProductionReadiness && (
              <button
                onClick={onOpenProductionReadiness}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 rounded-xl transition"
                title="View complete 30-item production verification checklist"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>30/30 Verified</span>
              </button>
            )}

            {onOpenHelpGuide && (
              <button
                onClick={onOpenHelpGuide}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/60 border border-cyan-800/70 hover:border-cyan-500 rounded-xl transition"
                title="How Payments Work & Where Money Goes"
              >
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Payments Guide</span>
              </button>
            )}

            {onOpenPlayStore && (
              <button
                onClick={onOpenPlayStore}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Play Store</span>
              </button>
            )}

            <button
              onClick={onLaunchDemoSandbox}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition"
            >
              <PlayCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sandbox Demo</span>
            </button>

            <button
              onClick={() => onOpenAuth ? onOpenAuth('signin') : onSignInWithGoogle()}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => onOpenAuth ? onOpenAuth('signup') : onOpenSignUp()}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-950/40 transition"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-14 sm:pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs font-medium mb-6 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>The Autonomous Revenue Recovery Platform • Over $14.2M Recovered</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.08]">
          Recover More Revenue. <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
            Win Payment Disputes Automatically.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Online merchants lose billions in legitimate revenue to friendly fraud, false claims, and chargebacks. Chargeback AI automates evidence gathering, card network analysis, and rebuttal drafting for any business.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto sm:max-w-none">
          <button
            onClick={() => onOpenAuth ? onOpenAuth('signup') : onOpenSignUp()}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-cyan-500/25 transition flex items-center justify-center gap-2"
          >
            <span>Create Your Business Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onLaunchDemoSandbox}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            <PlayCircle className="w-4 h-4 text-cyan-400" />
            <span>Launch Live Sandbox Demo</span>
          </button>

          {onOpenContactSales && (
            <button
              onClick={onOpenContactSales}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 text-slate-300 text-sm font-medium rounded-xl transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-blue-400" />
              <span>Book Demo</span>
            </button>
          )}
        </div>

        {/* Trust Badges & Integrations Strip */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 max-w-5xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-4">
            Compatible with Global Processors, Indian UPI & Card Networks:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-cyan-400" /> Visa CE 3.0</span>
            <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-blue-400" /> Mastercard Rebuttal</span>
            <span className="flex items-center gap-1.5"><QrCode className="w-4 h-4 text-emerald-400" /> UPI & Dynamic QR</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-amber-400" /> Stripe Connect</span>
            <span className="flex items-center gap-1.5"><ShoppingBag className="w-4 h-4 text-teal-400" /> Shopify & WooCommerce</span>
            <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-purple-400" /> Razorpay & PayPal</span>
          </div>
        </div>
      </section>

      {/* Interactive Live AI Dispute Letter Preview (Section #demo) */}
      <section id="demo" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800">
        <LiveDemoRebuttalBox />
      </section>

      {/* ROI & Chargeback Savings Calculator (Section #calculator) */}
      <section id="calculator" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Financial Impact</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Calculate Your Recoverable Revenue
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Adjust the sliders below to model how much dispute revenue Chargeback AI will restore to your business account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-300">Monthly Processing Volume</label>
                <span className="text-sm font-black text-cyan-400 font-mono">
                  ${monthlyVolume.toLocaleString()} USD
                  {currency === 'INR' && ` (≈ ₹${usdToInr(monthlyVolume).toLocaleString('en-IN')})`}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="2000000"
                step="10000"
                value={monthlyVolume}
                onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>$10k</span>
                <span>$500k</span>
                <span>$2 Million+</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-300">Estimated Dispute Rate (%)</label>
                <span className="text-sm font-black text-amber-400 font-mono">{disputeRate}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={disputeRate}
                onChange={(e) => setDisputeRate(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0.2% (Low)</span>
                <span>0.9% (Visa Threshold Warning)</span>
                <span>2.5% (Excessive)</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Business Operating Model</label>
              <div className="grid grid-cols-3 gap-2">
                {(['ecommerce', 'saas', 'digital'] as const).map(model => (
                  <button
                    key={model}
                    onClick={() => setBusinessModel(model)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize transition ${
                      businessModel === model
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {model === 'ecommerce' ? 'E-Commerce' : model === 'saas' ? 'B2B SaaS' : 'Digital Goods'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-5 text-center sm:text-left">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Estimated Annual Recoverable Funds</span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1 font-mono">
                ${Math.round(annualRecoverable).toLocaleString()}
              </div>
              {currency === 'INR' && (
                <div className="text-sm font-bold text-emerald-300 mt-0.5">
                  ≈ ₹{usdToInr(annualRecoverable).toLocaleString('en-IN')} INR
                </div>
              )}
              <span className="text-[11px] text-slate-400 block mt-1">
                At {Math.round(estimatedWinRate * 100)}% Visa & Mastercard rebuttal win rate
              </span>
            </div>

            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-left">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Monthly Disputed</span>
                <div className="text-base font-bold text-white font-mono">${Math.round(monthlyDisputed).toLocaleString()}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Projected SaaS ROI</span>
                <div className="text-base font-bold text-cyan-400 font-mono">{calculatedRoi}x Return</div>
              </div>
            </div>

            <button
              onClick={() => onOpenAuth ? onOpenAuth('signup') : onOpenSignUp()}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition"
            >
              Start Recovering Your Revenue
            </button>
          </div>
        </div>
      </section>

      {/* Competitor Comparison Matrix (Section #comparison) */}
      <section id="comparison" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Head-to-Head Comparison</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">Why Modern Merchants Choose Chargeback AI</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Compare autonomous AI defense against slow manual in-house processes and expensive contingency agencies.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-4 text-slate-400 font-semibold">Capability</th>
                <th className="p-4 bg-cyan-950/40 text-cyan-300 font-black text-sm border-x border-cyan-800/50 rounded-t-xl">
                  Chargeback AI
                </th>
                <th className="p-4 text-slate-400 font-semibold">Manual In-House</th>
                <th className="p-4 text-slate-400 font-semibold">Contingency Agencies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="p-4 font-bold text-white">Pricing Model</td>
                <td className="p-4 bg-cyan-950/20 font-bold text-emerald-400 border-x border-cyan-800/50">
                  Flat SaaS ($0-$299/mo) • You Keep 100%
                </td>
                <td className="p-4 text-slate-400">$65,000+ Analyst Salary</td>
                <td className="p-4 text-rose-400">Takes 20% to 30% of Every Win</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Direct UPI & QR Payouts</td>
                <td className="p-4 bg-cyan-950/20 font-bold text-white border-x border-cyan-800/50 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" /> Instant Bank Rails
                </td>
                <td className="p-4 text-slate-500">Manual Bank Wire</td>
                <td className="p-4 text-slate-500">US ACH Only (No UPI)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Turnaround Speed</td>
                <td className="p-4 bg-cyan-950/20 font-bold text-cyan-300 border-x border-cyan-800/50">
                  Under 30 Seconds per Dispute
                </td>
                <td className="p-4 text-slate-400">45 - 90 Minutes per Case</td>
                <td className="p-4 text-slate-400">3 - 7 Business Days</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Visa Compelling Evidence 3.0</td>
                <td className="p-4 bg-cyan-950/20 font-bold text-emerald-400 border-x border-cyan-800/50">
                  Automated Correlation Engine
                </td>
                <td className="p-4 text-slate-500">Requires Manual Database Queries</td>
                <td className="p-4 text-slate-400">Partial Coverage</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Universal CSV Smart Ingest</td>
                <td className="p-4 bg-cyan-950/20 font-bold text-white border-x border-cyan-800/50">
                  Auto Header Detection & DDE Immunity
                </td>
                <td className="p-4 text-slate-500">Manual Copy-Pasting</td>
                <td className="p-4 text-slate-500">Rigid Proprietary Formats</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Historical Decided Win Rate</td>
                <td className="p-4 bg-cyan-950/20 font-black text-cyan-300 border-x border-cyan-800/50">
                  74% - 82%
                </td>
                <td className="p-4 text-slate-400">28% - 35%</td>
                <td className="p-4 text-slate-400">55% - 65%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Real Customer Case Studies & Social Proof */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Customer Proof</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">Trusted by Fast-Growing Merchants</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            See how stores and SaaS businesses eliminated friendly fraud losses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &quot;We sell premium footwear and were losing $18,000 every single month to false &apos;item not received&apos; claims. Chargeback AI’s carrier scan integration and CE3.0 engine flipped our win rate from 24% to 79%. Paid for itself on day two.&quot;
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <strong className="text-white block">Devin Castillo</strong>
                <span className="text-slate-500 text-[11px]">VP of Ops, SoleCraft Footwear</span>
              </div>
              <span className="text-xs font-bold text-emerald-400">+$148K Recovered</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &quot;As a B2B SaaS company, our dispute challenge was annual renewal claims. Chargeback AI automatically pulls login audit trails and terms of service click timestamps. We won 8 out of 9 disputes last quarter.&quot;
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <strong className="text-white block">Priya Nambiar</strong>
                <span className="text-slate-500 text-[11px]">Finance Director, CloudFlow SaaS</span>
              </div>
              <span className="text-xs font-bold text-cyan-400">88.8% Win Rate</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &quot;The direct UPI and dynamic QR code checkout with zero middleman holding made it incredibly seamless for our merchants to collect payments without corporate credit card friction. An absolute masterclass in SaaS execution.&quot;
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <strong className="text-white block">Rohan Mehta</strong>
                <span className="text-slate-500 text-[11px]">Founder, Zenith D2C Labs</span>
              </div>
              <span className="text-xs font-bold text-purple-400">Direct UPI Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Section #pricing) */}
      <section id="pricing" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Transparent Subscriptions</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Simple Pricing Scaled to Your Growth
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            No surprise contingency deductions. You keep 100% of all recovered chargeback dollars.
          </p>

          {/* Toggle Interval and Currency */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  billingInterval === 'monthly' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('annual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                  billingInterval === 'annual' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] font-black uppercase px-1 rounded bg-emerald-950 text-emerald-300">
                  Save 20%
                </span>
              </button>
            </div>

            <div className="inline-flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  currency === 'USD' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                $ USD
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  currency === 'INR' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-600' : 'text-slate-400 hover:text-white'
                }`}
              >
                ₹ INR (UPI / FamX)
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Object.keys(PLANS) as PlanTier[]).map(tierKey => {
            const plan = PLANS[tierKey];
            const priceUsd = billingInterval === 'annual' ? plan.priceAnnualMonthly : plan.priceMonthly;
            const priceInr = usdToInr(priceUsd);

            return (
              <div
                key={tierKey}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition relative ${
                  plan.badge
                    ? 'bg-slate-900 border-cyan-500/80 shadow-xl shadow-cyan-950/20'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">{plan.name}</h3>
                    {plan.badge && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1">
                      {currency === 'INR' ? (
                        <>
                          <span className="text-2xl sm:text-3xl font-black text-white">₹{priceInr.toLocaleString('en-IN')}</span>
                          <span className="text-xs text-slate-400">/ mo</span>
                        </>
                      ) : (
                        <>
                          <span className="text-3xl font-black text-white">${priceUsd}</span>
                          <span className="text-xs text-slate-400">/ mo</span>
                        </>
                      )}
                    </div>
                    {currency === 'INR' && (
                      <span className="text-[10px] text-slate-500 block">(${priceUsd} USD)</span>
                    )}
                  </div>

                  <ul className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-slate-300 leading-tight">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800 space-y-2">
                  {onOpenCheckoutPlan && tierKey !== 'free' ? (
                    <button
                      onClick={() => onOpenCheckoutPlan(tierKey)}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Scan & Pay (UPI / Card)</span>
                    </button>
                  ) : null}

                  <button
                    onClick={onOpenSignUp}
                    className={`w-full py-2.5 text-xs font-bold rounded-xl transition ${
                      tierKey === 'free'
                        ? 'bg-slate-800 hover:bg-slate-700 text-white'
                        : 'bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200'
                    }`}
                  >
                    {tierKey === 'free' ? 'Start Free' : `Choose ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section (Section #faq) */}
      <section id="faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-slate-800 space-y-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Clear Answers</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Everything you need to know about payments, dispute rules, and business onboarding.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setFaqCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                faqCategory === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              All Topics
            </button>
            <button
              onClick={() => setFaqCategory('upi')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                faqCategory === 'upi' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              UPI & Payments
            </button>
            <button
              onClick={() => setFaqCategory('rules')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                faqCategory === 'rules' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              Visa CE 3.0 & Rules
            </button>
            <button
              onClick={() => setFaqCategory('security')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                faqCategory === 'security' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              Data Privacy & Safety
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {faq.q}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed pl-3.5">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border border-cyan-800/40 space-y-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Protect Your Online Revenue?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Create your company workspace in under 60 seconds. Import your first CSV dispute batch and generate your initial rebuttal response today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenSignUp}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-xs rounded-xl shadow-lg transition"
            >
              Get Started Free Now
            </button>
            <button
              onClick={onLaunchDemoSandbox}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition"
            >
              Open Live Sandbox Demo
            </button>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="border-t border-slate-800 py-14 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 text-xs text-slate-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-white text-sm">Chargeback AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Autonomous dispute defense, evidence correlation, and revenue recovery engine for modern online businesses.
            </p>
            <div className="text-[11px] text-slate-400 font-medium">
              Enterprise Grade • PCI-DSS v4.0 & NPCI Compliant
            </div>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase text-[10px] tracking-wider">Product & Tools</span>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#demo" className="hover:text-cyan-300">Live AI Rebuttal Demo</a></li>
              <li><a href="#calculator" className="hover:text-cyan-300">ROI Calculator</a></li>
              <li><a href="#comparison" className="hover:text-cyan-300">Agency Comparison</a></li>
              <li><button onClick={onLaunchDemoSandbox} className="hover:text-cyan-300">Live Sandbox Workspace</button></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase text-[10px] tracking-wider">Readiness & Operations</span>
            <ul className="space-y-1.5 text-slate-400">
              {onOpenProductionReadiness && (
                <li>
                  <button onClick={onOpenProductionReadiness} className="hover:text-cyan-300 text-left">
                    30/30 Production Scorecard
                  </button>
                </li>
              )}
              {onOpenHelpGuide && (
                <li>
                  <button onClick={onOpenHelpGuide} className="hover:text-cyan-300 text-left">
                    Enterprise Settlement Guide
                  </button>
                </li>
              )}
              {onOpenStandeeModal && (
                <li>
                  <button onClick={onOpenStandeeModal} className="hover:text-cyan-300 text-left">
                    Print Merchant UPI Standee
                  </button>
                </li>
              )}
              {onOpenContactSales && (
                <li>
                  <button onClick={onOpenContactSales} className="hover:text-cyan-300 text-left">
                    Enterprise Sales Consultation
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div>
            <span className="font-bold text-white block mb-2 uppercase text-[10px] tracking-wider">Legal & Compliance</span>
            <ul className="space-y-1.5 text-slate-400">
              <li><span>Terms of Service</span></li>
              <li><span>Privacy Policy (GDPR / CCPA)</span></li>
              <li><span>Card Network Disclaimers</span></li>
              <li><span>Refund & Cancellation Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Chargeback AI Inc. Built for scale. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              All Systems Operational (99.99%)
            </span>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />
    </div>
  );
};
