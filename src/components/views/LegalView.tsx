import React, { useState } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  Lock, 
  HelpCircle, 
  FileText,
  Mail
} from 'lucide-react';

export const LegalView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'ai' | 'dpa'>('privacy');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Legal & Compliance Documentation</h1>
        <p className="text-xs text-slate-400 mt-1">
          Regulatory privacy notices, Terms of Service, and AI data processing disclosures.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'privacy', label: 'Privacy Policy' },
          { id: 'terms', label: 'Terms of Service' },
          { id: 'ai', label: 'AI Usage & Governance Notice' },
          { id: 'dpa', label: 'Data Processing Addendum (DPA)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Card */}
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-slate-300 text-xs leading-relaxed">
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Privacy Policy for Chargeback AI</h2>
            <p className="text-slate-400 text-[11px]">Last Updated: October 2026</p>
            
            <h3 className="text-sm font-bold text-slate-200 pt-2">1. Scope and Information Collected</h3>
            <p>
              Chargeback AI (&quot;we&quot;, &quot;our&quot;, or &quot;the Service&quot;) collects only information necessary to help businesses analyze payment dispute exposure, manage case evidence, and generate response letters. We collect user email addresses, tenant organization details, uploaded CSV dispute logs (e.g. order numbers, transaction amounts, carrier tracking numbers), and operational audit events.
            </p>

            <h3 className="text-sm font-bold text-slate-200 pt-2">2. Sensitive Payment Credentials Prohibited</h3>
            <p>
              We do not store primary credit card numbers (PANs) or card verification values (CVVs). Any full credit card numbers detected in free-text notes are programmatically redacted before storage or processing.
            </p>

            <h3 className="text-sm font-bold text-slate-200 pt-2">3. Multi-Tenant Data Isolation</h3>
            <p>
              Every tenant customer workspace is logically isolated. Customer data is strictly partition-scoped and protected by Firestore Security Rules. No customer organization can read, query, or mutate another organization&apos;s records.
            </p>

            <h3 className="text-sm font-bold text-slate-200 pt-2">4. Data Subject Rights & GDPR Compliance</h3>
            <p>
              Customers retain full ownership of their dispute records. You may export your entire dataset in standardized JSON format at any time from the Security tab or execute a permanent workspace purge.
            </p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Terms of Service</h2>
            <p className="text-slate-400 text-[11px]">Effective Date: October 2026</p>

            <h3 className="text-sm font-bold text-slate-200 pt-2">1. No Guarantee of Dispute Outcome</h3>
            <p className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-amber-200">
              <strong>Crucial Operational Disclaimer:</strong> Chargeback AI provides evidence organization, automated analysis, and rebuttal drafting tools. We do not guarantee that any payment dispute will be won, reversed, or that disputed funds will be recovered. The final decision on any chargeback rests solely with the cardholder&apos;s issuing bank and relevant card networks (Visa, Mastercard, American Express).
            </p>

            <h3 className="text-sm font-bold text-slate-200 pt-2">2. Mandatory Human Review of Submissions</h3>
            <p>
              Users agree that all AI-generated response letters and evidence packages must undergo human review by the merchant prior to submission to any payment processor or acquiring institution. Users are strictly responsible for the accuracy of all submitted factual claims.
            </p>

            <h3 className="text-sm font-bold text-slate-200 pt-2">3. Subscription Billing & Entitlements</h3>
            <p>
              Paid subscription plans are billed in advance on a recurring monthly or annual basis. Access to features and monthly dispute/AI quotas is dictated by the active plan level verified by server-side payment webhooks.
            </p>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">AI Usage & Governance Disclosure</h2>
            <p className="text-slate-400 text-[11px]">Gemini 3.8 Flash Integration Model</p>

            <h3 className="text-sm font-bold text-slate-200 pt-2">1. Server-Side Execution Model</h3>
            <p>
              All AI capabilities in Chargeback AI are executed server-side via the modern Google Gen AI TypeScript SDK (<code className="text-cyan-300">@google/genai</code>) using model <code className="text-cyan-300 font-mono">gemini-3.8-flash</code>. API keys are strictly kept on the server and never exposed to the client browser.
            </p>

            <h3 className="text-sm font-bold text-slate-200 pt-2">2. Prompt Injection Defense</h3>
            <p>
              Customer order descriptions, dispute notes, and customer support messages are treated strictly as untrusted data wrapped in structured data schemas. Model system instructions strictly command the AI to ignore any malicious attempts to override system boundaries or leak tenant records.
            </p>

            <h3 className="text-sm font-bold text-slate-200 pt-2">3. No Training on Private Customer Records</h3>
            <p>
              Customer dispute payloads passed to the Gemini API are not used to train or refine public foundation models by default.
            </p>
          </div>
        )}

        {activeTab === 'dpa' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Data Processing Addendum (DPA)</h2>
            <p className="text-slate-400 text-[11px]">Standard Contractual Clauses Integration</p>

            <p>
              This Data Processing Addendum governs the processing of customer personal data by Chargeback AI in connection with the SaaS services provided. We maintain industry standard technical and organizational security measures to protect customer data against unauthorized access, loss, or alteration.
            </p>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="font-semibold text-white">Subprocessors:</span>
              <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                <li>Google Cloud Platform (Hosting, Cloud Firestore Database)</li>
                <li>Google Gemini API (Dispute Reasoning and Rebuttal Drafting)</li>
                <li>Stripe (Subscription Payment Processing)</li>
              </ul>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-slate-800 text-slate-500 text-[11px] flex items-center justify-between">
          <span>Chargeback AI Inc. • Legal & Compliance Office</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Mail className="w-3.5 h-3.5" />
            legal@chargebackai.example.com
          </span>
        </div>
      </div>
    </div>
  );
};
