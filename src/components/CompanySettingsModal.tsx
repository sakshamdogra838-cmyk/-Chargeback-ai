import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Globe, 
  DollarSign, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  X, 
  Key, 
  Layers, 
  ShoppingBag,
  ShieldAlert,
  AlertTriangle,
  Trash2,
  QrCode,
  Printer
} from 'lucide-react';

interface CompanySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStandeeModal?: () => void;
}

export const CompanySettingsModal: React.FC<CompanySettingsModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenStandeeModal 
}) => {
  const { currentOrg, updateOrganization, deleteOrganization, isOwnerOrAdmin } = useApp();

  const [name, setName] = useState(currentOrg?.name || '');
  const [businessType, setBusinessType] = useState(currentOrg?.businessType || 'Ecommerce & DTC');
  const [website, setWebsite] = useState(currentOrg?.website || '');
  const [currency, setCurrency] = useState(currentOrg?.currency || 'USD');
  const [monthlyVolume, setMonthlyVolume] = useState(currentOrg?.monthlyVolume || '$50,000 / mo');

  // Gateway Keys & Payouts
  const [upiPayoutId, setUpiPayoutId] = useState(currentOrg?.upiPayoutId || currentOrg?.gatewaySettings?.upiPayoutId || 'merchant.settlement@icici');
  const [stripePublishableKey, setStripePublishableKey] = useState(currentOrg?.gatewaySettings?.stripePublishableKey || '');
  const [shopifyStoreDomain, setShopifyStoreDomain] = useState(currentOrg?.gatewaySettings?.shopifyStoreDomain || '');
  const [paypalClientId, setPaypalClientId] = useState(currentOrg?.gatewaySettings?.paypalClientId || '');

  const [activeTab, setActiveTab] = useState<'profile' | 'gateways' | 'danger'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  if (!isOpen || !currentOrg) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateOrganization({
        name,
        businessType,
        website,
        currency,
        monthlyVolume,
        upiPayoutId,
        gatewaySettings: {
          upiPayoutId,
          stripePublishableKey,
          shopifyStoreDomain,
          paypalClientId,
          stripeConnected: !!stripePublishableKey,
          shopifyConnected: !!shopifyStoreDomain,
          paypalConnected: !!paypalClientId
        }
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    try {
      await deleteOrganization(currentOrg.id);
      onClose();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 my-8 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Company & Workspace Settings</h3>
              <p className="text-xs text-slate-400">Workspace ID: <code className="text-cyan-400">{currentOrg.id}</code></p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 rounded-lg transition ${activeTab === 'profile' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Company Profile
          </button>
          <button
            onClick={() => setActiveTab('gateways')}
            className={`flex-1 py-1.5 rounded-lg transition ${activeTab === 'gateways' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Processor Keys
          </button>
          <button
            onClick={() => setActiveTab('danger')}
            className={`flex-1 py-1.5 rounded-lg transition ${activeTab === 'danger' ? 'bg-rose-950/40 text-rose-300 border border-rose-800/40' : 'text-slate-400 hover:text-rose-400'}`}
          >
            Danger Zone
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Workspace settings updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {activeTab === 'profile' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company / Store Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Business Category</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Ecommerce & DTC">Ecommerce & DTC</option>
                    <option value="B2B SaaS / Subscription">B2B SaaS</option>
                    <option value="Digital Goods">Digital Products</option>
                    <option value="Marketplace">Marketplace</option>
                    <option value="Professional Services">Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Operating Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹) - Direct UPI / FamX</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Store / Website URL</label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="url"
                    placeholder="https://yourbrand.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Monthly Card Volume Tier</label>
                <input
                  type="text"
                  placeholder="$100,000 / mo"
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'gateways' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
                <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  Configure public and test API identifiers for automatic dispute webhooks. Never paste private server secret keys into the browser.
                </span>
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Direct UPI & QR Payout Receiver ID:
                  </span>
                  <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                    FamX / Bank Active
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="settlements@apexcommerce.bank"
                  value={upiPayoutId}
                  onChange={(e) => setUpiPayoutId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-emerald-500/40 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  All customer UPI payments and QR scans will be deposited directly to this designated settlement VPA.
                </p>

                {onOpenStandeeModal && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenStandeeModal();
                      }}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-emerald-500 text-[11px] font-semibold text-emerald-300 rounded-lg flex items-center gap-1.5 transition"
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Print / Display Merchant UPI QR Standee</span>
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                  Stripe Publishable Key (pk_test_... or pk_live_...)
                </label>
                <input
                  type="text"
                  placeholder="pk_test_51Mz..."
                  value={stripePublishableKey}
                  onChange={(e) => setStripePublishableKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                  Shopify Store Domain
                </label>
                <input
                  type="text"
                  placeholder="my-brand.myshopify.com"
                  value={shopifyStoreDomain}
                  onChange={(e) => setShopifyStoreDomain(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  PayPal Client ID
                </label>
                <input
                  type="text"
                  placeholder="A21AAJ..."
                  value={paypalClientId}
                  onChange={(e) => setPaypalClientId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-4 p-4 rounded-xl bg-rose-950/20 border border-rose-800/40">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-300">Delete Workspace & Scoped Dispute Data</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    This permanently removes the workspace &ldquo;{currentOrg.name}&rdquo; and all associated disputes and AI analyses. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deleteConfirm ? 'Are you sure? Click again to delete' : 'Delete Workspace'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab !== 'danger' && (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Plan: <strong className="text-white capitalize">{currentOrg.plan}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
