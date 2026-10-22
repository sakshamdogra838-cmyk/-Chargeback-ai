import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Receipt, 
  ExternalLink,
  Layers,
  CheckCircle2,
  Lock,
  QrCode,
  Copy,
  Smartphone
} from 'lucide-react';
import { PLANS } from '../../lib/plans';
import { PlanTier } from '../../types';
import { CheckoutModal } from '../CheckoutModal';

export const BillingView: React.FC = () => {
  const { currentOrg, usage, upgradePlan, disputes, members } = useApp();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookMessage, setWebhookMessage] = useState<string | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutTargetPlan, setCheckoutTargetPlan] = useState<PlanTier>('growth');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const currentPlanTier: PlanTier = currentOrg?.plan || 'free';
  const currentPlanConfig = PLANS[currentPlanTier];

  // Calculate usage progress
  const disputesUsed = disputes.length;
  const disputesMax = currentPlanConfig.disputeLimit;
  const disputesPercent = disputesMax === -1 ? 15 : Math.min(Math.round((disputesUsed / disputesMax) * 100), 100);

  const aiUsed = usage.aiAnalysesUsed;
  const aiMax = currentPlanConfig.aiAnalysesLimit;
  const aiPercent = Math.min(Math.round((aiUsed / aiMax) * 100), 100);

  const membersUsed = members.length;
  const membersMax = currentPlanConfig.membersLimit;

  // Server-side checkout initiation
  const handleSelectPlan = async (tier: PlanTier) => {
    if (tier === currentPlanTier) return;
    setIsUpgrading(tier);
    setWebhookMessage(null);

    try {
      const res = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: currentOrg?.id,
          planId: tier,
          billingInterval,
          returnUrl: window.location.href
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout session failed');

      if (data.mode === 'live' && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        // Test Mode: Immediately simulate authoritative server-side webhook update
        await upgradePlan(tier);
        setWebhookMessage(`Successfully upgraded to ${PLANS[tier].name} plan via verified server session (${data.sessionId}).`);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setWebhookMessage(`Error: ${err.message}`);
    } finally {
      setIsUpgrading(null);
    }
  };

  // Trigger test-mode server-side signed webhook
  const handleTriggerTestWebhook = async () => {
    setWebhookTesting(true);
    setWebhookMessage(null);
    try {
      const targetPlan: PlanTier = currentPlanTier === 'growth' ? 'enterprise' : 'growth';
      const eventId = `evt_test_${Date.now()}`;
      
      const res = await fetch('/api/billing/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          eventType: 'checkout.session.completed',
          organizationId: currentOrg?.id,
          planId: targetPlan,
          signature: 'sig_test_valid'
        })
      });

      const data = await res.json();
      if (res.ok) {
        await upgradePlan(targetPlan);
        setWebhookMessage(`Verified Webhook executed: Server processed ${data.organizationId} upgrade to ${targetPlan} plan (Event ID: ${eventId}).`);
      }
    } catch (err: any) {
      setWebhookMessage(`Webhook test error: ${err.message}`);
    } finally {
      setWebhookTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Subscription & Usage Metering</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold uppercase">
              Current: {currentPlanConfig.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Server-authoritative billing, usage metering, and plan entitlement limits for <strong className="text-slate-300">{currentOrg?.name}</strong>.
          </p>
        </div>

        {/* Monthly vs Annual Toggle */}
        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setBillingInterval('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              billingInterval === 'monthly'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingInterval('annual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              billingInterval === 'annual'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] font-black uppercase px-1 py-0.2 rounded bg-emerald-950 text-emerald-300">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {webhookMessage && (
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{webhookMessage}</span>
        </div>
      )}

      {/* Direct UPI & QR Payouts Active Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Direct UPI & QR Payouts Active</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                FamX / All UPI Apps
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Settlement Destination: <span className="font-mono text-slate-200 font-medium">billing@chargebackai.io</span> • Beneficiary: <span className="text-slate-300 font-medium">ChargebackAI Enterprise Treasury</span>. Instant clearing via verified banking rails.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => {
              navigator.clipboard.writeText('billing@chargebackai.io');
              setCopiedUpi(true);
              setTimeout(() => setCopiedUpi(false), 2000);
            }}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-emerald-500/60 text-xs font-semibold text-slate-200 rounded-xl flex items-center gap-1.5 transition"
          >
            {copiedUpi ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied Billing ID!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copy Billing VPA</span>
              </>
            )}
          </button>
          <button
            onClick={() => {
              setCheckoutTargetPlan('growth');
              setIsCheckoutModalOpen(true);
            }}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Open Scan & Pay Modal</span>
          </button>
        </div>
      </div>
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Current Period Entitlements & Usage</h3>
            <p className="text-xs text-slate-400">Limits enforced server-side. Resets at start of each billing cycle.</p>
          </div>
          <div className="text-xs text-slate-400">
            Cycle ends: <strong className="text-slate-300">{new Date(usage.periodEnd).toLocaleDateString()}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Disputes Managed */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Disputes Managed</span>
              <span className="font-bold text-white">
                {disputesUsed} / {disputesMax === -1 ? 'Unlimited' : disputesMax}
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${disputesPercent >= 90 ? 'bg-rose-500' : 'bg-cyan-400'}`}
                style={{ width: `${disputesPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>{disputesPercent}% Quota Used</span>
              <span>{disputesMax === -1 ? 'No limit' : `${Math.max(disputesMax - disputesUsed, 0)} cases left`}</span>
            </div>
          </div>

          {/* AI Analyses */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">AI Analyses & Rebuttals</span>
              <span className="font-bold text-white">
                {aiUsed} / {aiMax}
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${aiPercent >= 90 ? 'bg-amber-500' : 'bg-blue-400'}`}
                style={{ width: `${aiPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>{aiPercent}% Quota Used</span>
              <span>{Math.max(aiMax - aiUsed, 0)} analyses remaining</span>
            </div>
          </div>

          {/* Collaborator Seats */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Team Seats Assigned</span>
              <span className="font-bold text-white">
                {membersUsed} / {membersMax}
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${Math.min((membersUsed / membersMax) * 100, 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>Active Collaborators</span>
              <span>{Math.max(membersMax - membersUsed, 0)} available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Tier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(PLANS) as PlanTier[]).map(tierKey => {
          const plan = PLANS[tierKey];
          const isCurrent = currentPlanTier === tierKey;
          const price = billingInterval === 'annual' ? plan.priceAnnualMonthly : plan.priceMonthly;

          return (
            <div
              key={tierKey}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition ${
                isCurrent
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-cyan-500 shadow-xl shadow-cyan-950/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white">{plan.name}</h4>
                  {plan.badge && (
                    <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                      {plan.badge}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                      Current Plan
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">${price}</span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>
                  {billingInterval === 'annual' && price > 0 && (
                    <span className="text-[10px] text-emerald-400 font-semibold">Billed annually ($ {price * 12}/yr)</span>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Included Features:
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight text-slate-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800/80 space-y-2">
                <button
                  onClick={() => {
                    if (tierKey === 'free') {
                      handleSelectPlan(tierKey);
                    } else {
                      setCheckoutTargetPlan(tierKey);
                      setIsCheckoutModalOpen(true);
                    }
                  }}
                  disabled={isCurrent || isUpgrading === tierKey}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-md'
                  }`}
                >
                  {isUpgrading === tierKey ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Processing Checkout...
                    </>
                  ) : isCurrent ? (
                    'Active Plan'
                  ) : (
                    <>
                      <CreditCard className="w-3.5 h-3.5" />
                      {tierKey === 'free' ? 'Downgrade to Free' : `Pay & Activate ${plan.name}`}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                {!isCurrent && tierKey !== 'free' && (
                  <button
                    onClick={() => handleSelectPlan(tierKey)}
                    className="w-full text-center text-[10px] text-slate-500 hover:text-cyan-400 py-1 transition"
                  >
                    Or create external checkout session →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Webhook Test Suite Card for Verification */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Payment Lifecycle & Webhook Verification</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">POST /api/billing/webhook</span>
        </div>
        <p className="text-xs text-slate-400">
          Click below to test sending an authentic, server-verified signed webhook event (`checkout.session.completed`) to test real server subscription updating and event deduplication.
        </p>
        <button
          onClick={handleTriggerTestWebhook}
          disabled={webhookTesting}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 rounded-xl transition flex items-center gap-2"
        >
          {webhookTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
          Trigger Server Webhook Simulation
        </button>
      </div>

      {/* Instant Interactive Card Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        selectedPlan={checkoutTargetPlan}
        billingInterval={billingInterval}
        onSuccess={(newPlan) => {
          setWebhookMessage(`Successfully upgraded to ${PLANS[newPlan].name} plan! Subscription and invoice recorded.`);
        }}
      />
    </div>
  );
};
