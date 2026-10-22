import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink, 
  Lock, 
  Copy, 
  Check, 
  CreditCard,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { CompanySettingsModal } from '../CompanySettingsModal';

export const IntegrationsView: React.FC = () => {
  const { currentOrg } = useApp();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState<Record<string, 'healthy' | 'checking' | 'idle'>>({
    shopify: 'healthy',
    stripe: 'healthy',
    paypal: 'idle',
    adyen: 'idle'
  });

  const webhookEndpoint = `${window.location.origin}/api/billing/webhook`;

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookEndpoint);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const testConnection = (id: string) => {
    setHealthStatus(prev => ({ ...prev, [id]: 'checking' }));
    setTimeout(() => {
      setHealthStatus(prev => ({ ...prev, [id]: 'healthy' }));
    }, 800);
  };

  const connectors = [
    {
      id: 'shopify',
      name: 'Shopify Payments',
      category: 'Ecommerce Storefront',
      icon: ShoppingBag,
      status: 'connected',
      mode: 'live',
      lastSync: '12 minutes ago',
      events: ['orders/dispute/created', 'orders/dispute/won', 'orders/dispute/lost'],
      description: 'Automatically pulls Shopify chargebacks, order items, and shipping carrier fulfillment details.'
    },
    {
      id: 'stripe',
      name: 'Stripe Direct Connect',
      category: 'Payment Gateway',
      icon: CreditCard,
      status: 'connected',
      mode: 'test',
      lastSync: '25 minutes ago',
      events: ['charge.dispute.created', 'charge.dispute.updated', 'charge.dispute.closed'],
      description: 'Listens for dispute events, authorization AVS/CVV matching, and customer invoice records.'
    },
    {
      id: 'paypal',
      name: 'PayPal Commerce',
      category: 'Digital Wallet',
      icon: Layers,
      status: 'available',
      mode: 'unconfigured',
      lastSync: 'Never',
      events: ['CUSTOMER.DISPUTE.CREATED', 'CUSTOMER.DISPUTE.RESOLVED'],
      description: 'Sync claims, buyer communication messages, and tracking numbers directly via PayPal REST API.'
    },
    {
      id: 'adyen',
      name: 'Adyen Global',
      category: 'Omnichannel Gateway',
      icon: Zap,
      status: 'available',
      mode: 'unconfigured',
      lastSync: 'Never',
      events: ['NOTIFICATION_REQUEST_FOR_INFORMATION', 'NOTIFICATION_CHARGEBACK'],
      description: 'Enterprise webhook ingestion for international acquiring networks and scheme arbitration.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Payment Processor Integrations</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
              Live Webhooks Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Connect payment gateways to automatically ingest disputes and synchronize evidence for <strong className="text-slate-300">{currentOrg?.name}</strong>.
          </p>
        </div>
      </div>

      {/* Secret Management Security Callout */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-200">Server-Side Secret Isolation:</span> API keys and webhook secrets are stored exclusively in the server environment. Browser clients never receive or hold raw processor API secrets.
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px] shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Secure</span>
        </div>
      </div>

      {/* Global Webhook Endpoint Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Organization Webhook Receiver Endpoint
          </h3>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800/40">
            Listening for Signed Payloads
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Configure this HTTPS callback URL in your Stripe or Shopify Webhook Settings to automatically pipe new dispute events.
        </p>

        <div className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl">
          <span className="text-xs font-mono text-cyan-300 truncate flex-1">{webhookEndpoint}</span>
          <button
            onClick={copyWebhook}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition shrink-0"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedUrl ? 'Copied' : 'Copy URL'}
          </button>
        </div>
      </div>

      {/* Connector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connectors.map(connector => {
          const Icon = connector.icon;
          const isConnected = connector.status === 'connected';
          const health = healthStatus[connector.id];

          return (
            <div
              key={connector.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{connector.name}</h4>
                      <span className="text-[11px] text-slate-400">{connector.category}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    isConnected
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isConnected ? 'Active & Synced' : 'Ready to Connect'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {connector.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Sync Status</span>
                    <span className="text-slate-300 font-medium">{connector.lastSync}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supported Events</span>
                    <span className="text-slate-400">{connector.events.length} Webhook Topics</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => testConnection(connector.id)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${health === 'checking' ? 'animate-spin text-cyan-400' : ''}`} />
                  {health === 'checking' ? 'Testing Health...' : 'Health Check'}
                </button>

                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isConnected
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-md'
                  }`}
                >
                  {isConnected ? 'Configure Credentials' : 'Connect Gateway'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <CompanySettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};
