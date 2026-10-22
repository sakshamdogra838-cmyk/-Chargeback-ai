import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Check, Settings, ChevronRight } from 'lucide-react';

export const CookieConsentBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    analytics: true,
    functional: true,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('chargeback_cookie_consent');
    if (!consent) {
      // Delay display slightly for smooth page entrance
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('chargeback_cookie_consent', JSON.stringify({
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setIsOpen(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('chargeback_cookie_consent', JSON.stringify({
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setIsOpen(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('chargeback_cookie_consent', JSON.stringify({
      ...preferences,
      essential: true,
      timestamp: new Date().toISOString()
    }));
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 text-slate-200 space-y-4 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Privacy & Cookie Preferences</h4>
              <p className="text-[11px] text-slate-400">GDPR & CCPA Compliant</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          We use strictly essential authentication cookies and privacy-preserving analytics to power dispute rebuttal automation. No private financial transaction data is ever sold or shared with external ad brokers.
        </p>

        {showPreferences && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Strictly Necessary</span>
                <p className="text-[10px] text-slate-400">Session auth & workspace tenant isolation</p>
              </div>
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                Always Active
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div>
                <span className="font-bold text-white">Performance & Analytics</span>
                <p className="text-[10px] text-slate-400">Aggregated win rate benchmarking</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div>
                <span className="font-bold text-white">Functional Preferences</span>
                <p className="text-[10px] text-slate-400">Remember currency & interval choices</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          {showPreferences ? (
            <button
              onClick={handleSavePreferences}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Save Custom Choices
            </button>
          ) : (
            <>
              <button
                onClick={handleAcceptAll}
                className="w-full sm:flex-1 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Accept All
              </button>
              <button
                onClick={handleAcceptEssential}
                className="w-full sm:flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
              >
                Essential Only
              </button>
              <button
                onClick={() => setShowPreferences(true)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                title="Customize preferences"
              >
                <Settings className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
