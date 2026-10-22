import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  UploadCloud, 
  BarChart3, 
  Users, 
  Layers, 
  CreditCard, 
  Lock, 
  CheckSquare, 
  FileCheck2, 
  Building2, 
  ChevronDown, 
  Plus, 
  Bell, 
  LogOut, 
  LogIn, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Settings,
  Smartphone,
  Download,
  HelpCircle,
  Store,
  QrCode
} from 'lucide-react';
import { PLANS } from '../lib/plans';

interface NavigationProps {
  currentView: string;
  onSelectView: (view: string) => void;
  onOpenNewDispute: () => void;
  onOpenOnboarding: () => void;
  onOpenMarketingLanding?: () => void;
  onOpenAuth?: () => void;
  onOpenPlayStore?: () => void;
  onOpenCompanySettings?: () => void;
  onOpenHelpGuide?: () => void;
  onOpenProductionReadiness?: () => void;
  onOpenStandeeModal?: () => void;
  onLogout?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onSelectView,
  onOpenNewDispute,
  onOpenOnboarding,
  onOpenMarketingLanding,
  onOpenAuth,
  onOpenPlayStore,
  onOpenCompanySettings,
  onOpenHelpGuide,
  onOpenProductionReadiness,
  onOpenStandeeModal,
  onLogout
}) => {
  const { 
    currentUser, 
    organizations, 
    currentOrg, 
    currentRole, 
    switchOrganization, 
    notifications, 
    markNotificationRead,
    signInWithGoogle, 
    signOut,
    dbConnected,
    demoModeActive,
    loginDemoUser
  } = useApp();

  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    try {
      await signOut();
    } finally {
      sessionStorage.removeItem('chargeback_entered_app');
      localStorage.removeItem('chargeback_entered_app');
      if (onLogout) {
        onLogout();
      }
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const currentPlan = currentOrg ? PLANS[currentOrg.plan] : PLANS.free;

  const navItems = [
    { id: 'dashboard', label: 'Financial Overview', icon: LayoutDashboard },
    { id: 'merchants', label: 'Merchant Fleet Operations', icon: Store, badge: `${organizations.length} Stores • 250 Matrix`, highlight: true },
    { id: 'cases', label: 'Dispute Cases', icon: FileText, badge: 'Active' },
    { id: 'ai-analyst', label: 'AI Chargeback Analyst', icon: Sparkles },
    { id: 'imports', label: 'Data Imports & CSV', icon: UploadCloud },
    { id: 'reports', label: 'Recovery Reports', icon: BarChart3 },
    { id: 'team', label: 'Team & RBAC', icon: Users },
    { id: 'integrations', label: 'Payment Integrations', icon: Layers },
    { id: 'billing', label: 'Plans & Entitlements', icon: CreditCard },
    { id: 'security', label: 'Security & Audit Logs', icon: Lock },
    { id: 'tests', label: 'Automated Security Tests', icon: CheckSquare, badge: 'Pass' },
    { id: 'legal', label: 'Compliance & Legal', icon: FileCheck2 },
    { id: 'admin', label: 'Platform Admin', icon: ShieldCheck }
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 z-30 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          {/* Logo & Brand Wordmark */}
          <div 
            onClick={() => onSelectView('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Chargeback<span className="text-cyan-400">AI</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/50">
                  SaaS
                </span>
              </span>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-slate-800 hidden md:block" />

          {/* Multi-Tenant Workspace Selector */}
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition"
              >
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate max-w-[140px] font-semibold">{currentOrg?.name || 'Select Workspace'}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold bg-blue-950/80 text-blue-300 border border-blue-800/50">
                  {currentPlan.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {orgDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Enterprise Merchant Fleet Stores */}
                  <div className="px-3 py-1.5 border-b border-slate-800/80 mb-1 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                        Enterprise Merchant Fleet
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {organizations.length} Connected Stores
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setOrgDropdownOpen(false);
                        onOpenOnboarding();
                      }}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50"
                    >
                      + Add Store
                    </button>
                  </div>

                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {organizations.map((org) => (
                      <button
                        key={org.id}
                        onClick={() => {
                          switchOrganization(org.id);
                          setOrgDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition text-left ${
                          currentOrg?.id === org.id
                            ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/40 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-semibold text-white truncate flex items-center gap-1.5">
                            <span>{org.name}</span>
                            {currentOrg?.id === org.id && (
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {org.businessType} • {org.monthlyVolume} • {org.currency}
                          </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0 gap-0.5">
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                            {org.kycTier ? 'Tier 3' : 'Active'}
                          </span>
                          <span className="text-[8px] text-slate-500">
                            {org.currency} Payouts
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-800/80 space-y-1.5">
                    <button
                      onClick={() => {
                        setOrgDropdownOpen(false);
                        onSelectView('merchants');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition"
                    >
                      <Store className="w-3.5 h-3.5 text-indigo-400" />
                      Manage Fleet ({organizations.length} Stores)
                    </button>
                    <button
                      onClick={() => {
                        setOrgDropdownOpen(false);
                        onOpenOnboarding();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Register New Company Workspace
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Workspace Settings Button */}
            {onOpenCompanySettings && (
              <button
                onClick={onOpenCompanySettings}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition"
                title="Company Profile & Processor Settings"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400 hover:text-cyan-400" />
              </button>
            )}
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile PWA App Button */}
          {onOpenPlayStore && (
            <button
              onClick={onOpenPlayStore}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition"
              title="Google Play Store & Mobile PWA Launcher"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span>Mobile App</span>
            </button>
          )}

          {/* Help Guide */}
          {onOpenHelpGuide && (
            <button
              onClick={onOpenHelpGuide}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition"
              title="Help & User Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}

          {/* Quick Create Dispute Button */}
          <button
            onClick={onOpenNewDispute}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold rounded-xl shadow-md shadow-cyan-950/40 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            New Dispute
          </button>

          {/* Database Connectivity Indicator */}
          <div 
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400"
            title={dbConnected ? 'Cloud Firestore connected securely' : 'Firestore syncing'}
          >
            <span className={`w-2 h-2 rounded-full ${dbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>Firestore</span>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white">Notifications</span>
                  <span className="text-[10px] text-cyan-400">{unreadNotifications.length} unread</span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                          n.read 
                            ? 'bg-slate-950/40 border-slate-800/40 text-slate-400' 
                            : 'bg-cyan-950/20 border-cyan-800/40 text-slate-200'
                        }`}
                      >
                        <div className="font-semibold text-white flex items-center justify-between">
                          <span>{n.title}</span>
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Sign In */}
          <div className="relative">
            {currentUser ? (
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs uppercase">
                  {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                </div>
                <span className="font-medium truncate max-w-[110px]">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 uppercase font-bold rounded bg-slate-800 text-slate-400">
                  {currentRole}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth || signInWithGoogle}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In / Register
              </button>
            )}

            {userDropdownOpen && currentUser && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-800">
                  <div className="text-xs font-bold text-white truncate">{currentUser.displayName || 'Member'}</div>
                  <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 font-semibold uppercase">
                      Role: {currentRole}
                    </span>
                  </div>
                </div>

                <div className="p-1 space-y-1">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onSelectView('team');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl"
                  >
                    Organization Members & RBAC
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onSelectView('security');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl"
                  >
                    Security & GDPR Data Export
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-xl font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* DEDICATED PROPER LOG OUT BUTTON IN TOP HEADER (Always Accessible) */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/50 hover:border-rose-700 text-xs font-semibold text-rose-300 hover:text-rose-200 transition shadow-sm shadow-rose-950/40"
            title={currentUser ? `Log Out (${currentUser.email || currentUser.displayName})` : 'Log Out & Return to Portal'}
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-semibold">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Sidebar Navigation */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-slate-950 border-r border-slate-800/80 p-3 hidden md:flex flex-col justify-between overflow-y-auto z-20">
        <div className="space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Platform Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    item.badge === 'Pass' 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' 
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {item.highlight && !item.badge && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Plan Limit Mini Meter */}
        <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
            <span>{currentPlan.name} Plan</span>
            <button 
              onClick={() => onSelectView('billing')}
              className="text-cyan-400 hover:underline text-[11px]"
            >
              Upgrade
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            {currentPlan.disputeLimit === -1 ? 'Unlimited disputes' : `${currentPlan.disputeLimit} disputes / mo`}
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-2/5 rounded-full" />
          </div>
          <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Server Entitlements Enforced</span>
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
          </div>
        </div>

        {/* Sidebar Log Out Button (Always Accessible) */}
        <div className="pt-2 mt-2 border-t border-slate-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 border border-slate-900 hover:border-rose-900/60 transition font-semibold"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Log Out</span>
            </div>
            <span className="text-[10px] text-slate-500 truncate max-w-[90px]">
              {currentUser?.email ? currentUser.email.split('@')[0] : 'Exit Portal'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
