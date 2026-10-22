import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  User, 
  DollarSign, 
  CheckCircle2, 
  X, 
  Send, 
  Sparkles,
  Phone,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ContactSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactSalesModal: React.FC<ContactSalesModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [monthlyVolume, setMonthlyVolume] = useState('$100,000 - $500,000');
  const [primaryGateway, setPrimaryGateway] = useState('Stripe & Shopify');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save lead to localStorage
    const lead = {
      fullName,
      email,
      companyName,
      monthlyVolume,
      primaryGateway,
      notes,
      createdAt: new Date().toISOString()
    };

    const existingLeads = JSON.parse(localStorage.getItem('chargeback_sales_leads') || '[]');
    existingLeads.push(lead);
    localStorage.setItem('chargeback_sales_leads', JSON.stringify(existingLeads));

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 my-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Book Enterprise Demo & Consultation</h3>
              <p className="text-xs text-slate-400">Custom volume discounts & tailored API integrations</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Inquiry Received Successfully!</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                Thank you, <strong>{fullName}</strong>. A Chargeback AI solution architect will reach out to <strong>{email}</strong> within 4 business hours with your custom revenue recovery plan.
              </p>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400 max-w-sm mx-auto">
              For urgent onboarding, you can also start immediately via self-serve or scan our direct UPI QR code.
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold rounded-xl shadow transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Work Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company / Store Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Apex Apparel Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Monthly Card Volume</label>
                <select
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="$25,000 - $100,000">$25,000 - $100,000 / mo</option>
                  <option value="$100,000 - $500,000">$100,000 - $500,000 / mo</option>
                  <option value="$500,000 - $2,000,000">$500,000 - $2,000,000 / mo</option>
                  <option value="$2,000,000+">$2,000,000+ / mo (Enterprise)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Payment Gateway / Processor</label>
              <select
                value={primaryGateway}
                onChange={(e) => setPrimaryGateway(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Stripe & Shopify">Stripe & Shopify</option>
                <option value="Razorpay & UPI">Razorpay & UPI (India)</option>
                <option value="PayPal & Braintree">PayPal & Braintree</option>
                <option value="Adyen & Checkout.com">Adyen & Checkout.com</option>
                <option value="Custom Merchant Account">Custom Merchant Bank / Other</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Specific Dispute Challenges or Goals (Optional)</label>
              <textarea
                rows={3}
                placeholder="e.g. Dealing with a surge in 10.4 friendly fraud disputes or need custom ERP webhook sync..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Sending Consultation Request...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Consultation Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
