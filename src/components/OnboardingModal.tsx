import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Globe, 
  DollarSign, 
  CreditCard, 
  Upload, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  X,
  FileSpreadsheet
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { createOrganization, loadSampleData } = useApp();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('Ecommerce & DTC');
  const [website, setWebsite] = useState('');
  const [monthlyVolume, setMonthlyVolume] = useState('$50,000 - $150,000 / mo');
  const [currency, setCurrency] = useState('USD');
  const [processor, setProcessor] = useState('Shopify Payments (Stripe)');
  const [loadSample, setLoadSample] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleComplete = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await createOrganization({
        name,
        businessType,
        website,
        monthlyVolume,
        currency
      });
      if (loadSample) {
        await loadSampleData();
      }
      onClose();
    } catch (e) {
      console.error('Failed to create organization:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Progress Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Workspace Setup</span>
            <h2 className="text-lg font-bold text-white">Create Business Workspace</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Step {step} of 3</span>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="w-full bg-slate-800 h-1">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Business or Company Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Commerce Inc."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Business Model
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Ecommerce & DTC">Ecommerce & Direct-to-Consumer</option>
                  <option value="SaaS & Subscription">SaaS & Digital Subscriptions</option>
                  <option value="Digital Goods">Digital Products & Courses</option>
                  <option value="Marketplace">Online Marketplace</option>
                  <option value="Services">Professional Agency / Services</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Store or Company Website
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Approximate Monthly Processing Volume
                </label>
                <select
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Under $25,000 / mo">Under $25,000 / mo</option>
                  <option value="$25,000 - $100,000 / mo">$25,000 - $100,000 / mo</option>
                  <option value="$100,000 - $500,000 / mo">$100,000 - $500,000 / mo</option>
                  <option value="$500,000 - $2,000,000 / mo">$500,000 - $2,000,000 / mo</option>
                  <option value="$2,000,000+ / mo">$2,000,000+ / mo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Base Reporting Currency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SGD'].map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => setCurrency(curr)}
                      className={`py-2 px-3 rounded-xl border text-sm font-medium transition ${
                        currency === curr
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Primary Payment Gateway / Processor
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <select
                    value={processor}
                    onChange={(e) => setProcessor(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Shopify Payments (Stripe)">Shopify Payments (Stripe)</option>
                    <option value="Stripe Direct">Stripe Direct</option>
                    <option value="PayPal">PayPal Commerce</option>
                    <option value="Adyen">Adyen</option>
                    <option value="Square">Square</option>
                    <option value="Authorize.Net">Authorize.Net</option>
                    <option value="Manual CSV">Manual CSV Import</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Initial Dataset Setup</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Choose whether to populate your workspace with a starter demonstration dataset of realistic disputes or begin with an empty workspace.
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                    <input
                      type="radio"
                      name="sampleDataOption"
                      checked={loadSample}
                      onChange={() => setLoadSample(true)}
                      className="text-cyan-500 focus:ring-0"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-200">Preload 5 Realistic Chargeback Cases</span>
                      <p className="text-xs text-slate-400">Includes active deadlines, tracking numbers, and evidence requirements.</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                    <input
                      type="radio"
                      name="sampleDataOption"
                      checked={!loadSample}
                      onChange={() => setLoadSample(false)}
                      className="text-cyan-500 focus:ring-0"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-200">Start with Empty Workspace</span>
                      <p className="text-xs text-slate-400">You will upload your own dispute CSV file immediately.</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded-xl text-xs text-blue-300">
                <span className="font-semibold text-blue-200">Multi-Tenant Isolation Notice:</span> This workspace will have a strictly separated organization identifier. Only members you explicitly invite will have access to its records.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              disabled={step === 1 && !name.trim()}
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-950/40 transition"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleComplete}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-950/50 transition"
            >
              {isSubmitting ? 'Creating Workspace...' : 'Launch Workspace'}
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
