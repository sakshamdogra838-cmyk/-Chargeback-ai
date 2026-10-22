import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/views/DashboardView';
import { CasesView } from './components/views/CasesView';
import { CaseDetailView } from './components/views/CaseDetailView';
import { AiAnalystView } from './components/views/AiAnalystView';
import { ImportsView } from './components/views/ImportsView';
import { ReportsView } from './components/views/ReportsView';
import { TeamView } from './components/views/TeamView';
import { IntegrationsView } from './components/views/IntegrationsView';
import { BillingView } from './components/views/BillingView';
import { SecurityView } from './components/views/SecurityView';
import { SecurityTestsView } from './components/views/SecurityTestsView';
import { LegalView } from './components/views/LegalView';
import { AdminView } from './components/views/AdminView';
import { MerchantsView } from './components/views/MerchantsView';
import { MarketingLanding } from './components/MarketingLanding';
import { NewDisputeModal } from './components/NewDisputeModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { PlayStoreModal } from './components/PlayStoreModal';
import { CompanySettingsModal } from './components/CompanySettingsModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import { ProductionReadinessModal } from './components/ProductionReadinessModal';
import { ContactSalesModal } from './components/ContactSalesModal';
import { MerchantQrStandeeModal } from './components/MerchantQrStandeeModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Building2, Sparkles, Plus, ArrowLeft, Settings, Smartphone, HelpCircle, QrCode } from 'lucide-react';
import { PlanTier } from './types';

const AppContent: React.FC = () => {
  const { currentOrg, signInWithGoogle, signOut, currentUser } = useApp();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isNewDisputeModalOpen, setIsNewDisputeModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);
  const [isCompanySettingsModalOpen, setIsCompanySettingsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const [isContactSalesModalOpen, setIsContactSalesModalOpen] = useState(false);
  const [isStandeeModalOpen, setIsStandeeModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutTargetPlan, setCheckoutTargetPlan] = useState<PlanTier>('growth');
  
  // Default to public marketing landing page for all web visitors unless they already entered
  const [showMarketingLanding, setShowMarketingLanding] = useState<boolean>(() => {
    return !sessionStorage.getItem('chargeback_entered_app') && !currentUser;
  });

  const handleEnterApp = () => {
    sessionStorage.setItem('chargeback_entered_app', 'true');
    setShowMarketingLanding(false);
  };

  const handleLaunchDemoSandbox = () => {
    sessionStorage.setItem('chargeback_entered_app', 'true');
    setShowMarketingLanding(false);
  };

  const handleOpenSignUp = () => {
    sessionStorage.setItem('chargeback_entered_app', 'true');
    setShowMarketingLanding(false);
    setIsOnboardingModalOpen(true);
  };

  const handleOpenAuth = (mode?: 'signin' | 'signup') => {
    setAuthInitialMode(mode || 'signin');
    setIsAuthModalOpen(true);
  };

  // If marketing landing is toggled or visitor is on public site
  if (showMarketingLanding) {
    return (
      <>
        <OfflineIndicator />
        <MarketingLanding
          onEnterApp={handleEnterApp}
          onLaunchDemoSandbox={handleLaunchDemoSandbox}
          onOpenSignUp={handleOpenSignUp}
          onOpenAuth={handleOpenAuth}
          onOpenPlayStore={() => setIsPlayStoreModalOpen(true)}
          onOpenHelpGuide={() => setIsHelpModalOpen(true)}
          onOpenProductionReadiness={() => setIsProductionModalOpen(true)}
          onOpenContactSales={() => setIsContactSalesModalOpen(true)}
          onOpenStandeeModal={() => setIsStandeeModalOpen(true)}
          onOpenCheckoutPlan={(tier) => {
            setCheckoutTargetPlan(tier);
            setIsCheckoutModalOpen(true);
          }}
          onSignInWithGoogle={async () => {
            try {
              await signInWithGoogle();
              sessionStorage.setItem('chargeback_entered_app', 'true');
              setShowMarketingLanding(false);
            } catch (e) {
              console.error(e);
            }
          }}
        />
        {/* Modals accessible from marketing site as well */}
        <OnboardingModal
          isOpen={isOnboardingModalOpen}
          onClose={() => setIsOnboardingModalOpen(false)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authInitialMode}
          onClose={() => {
            setIsAuthModalOpen(false);
            if (currentUser) {
              sessionStorage.setItem('chargeback_entered_app', 'true');
              setShowMarketingLanding(false);
            }
          }}
        />
        <PlayStoreModal
          isOpen={isPlayStoreModalOpen}
          onClose={() => setIsPlayStoreModalOpen(false)}
        />
        <HelpGuideModal
          isOpen={isHelpModalOpen}
          onClose={() => setIsHelpModalOpen(false)}
          onOpenPlayStore={() => {
            setIsHelpModalOpen(false);
            setIsPlayStoreModalOpen(true);
          }}
          onOpenBilling={() => {
            setIsHelpModalOpen(false);
            handleEnterApp();
            setCurrentView('billing');
          }}
        />
        <ProductionReadinessModal
          isOpen={isProductionModalOpen}
          onClose={() => setIsProductionModalOpen(false)}
          onOpenCheckout={() => {
            setCheckoutTargetPlan('growth');
            setIsCheckoutModalOpen(true);
          }}
          onOpenHelpGuide={() => {
            setIsProductionModalOpen(false);
            setIsHelpModalOpen(true);
          }}
        />
        <ContactSalesModal
          isOpen={isContactSalesModalOpen}
          onClose={() => setIsContactSalesModalOpen(false)}
        />
        <MerchantQrStandeeModal
          isOpen={isStandeeModalOpen}
          onClose={() => setIsStandeeModalOpen(false)}
          upiId={currentOrg?.upiPayoutId || 'settlements@apexcommerce.bank'}
        />
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          selectedPlan={checkoutTargetPlan}
          billingInterval="monthly"
          onSuccess={() => {
            handleEnterApp();
            setCurrentView('billing');
          }}
        />
      </>
    );
  }

  const isDemoOrg = currentOrg?.id === 'org-apex-dtc' || currentOrg?.id === 'org-cloudsync-saas';

  const renderActiveView = () => {
    if (selectedCaseId) {
      return (
        <CaseDetailView
          caseId={selectedCaseId}
          onBack={() => setSelectedCaseId(null)}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            onSelectCase={(id) => setSelectedCaseId(id)}
            onOpenNewDispute={() => setIsNewDisputeModalOpen(true)}
            onNavigateToImports={() => setCurrentView('imports')}
            onNavigateToAi={() => setCurrentView('ai-analyst')}
          />
        );
      case 'merchants':
        return <MerchantsView />;
      case 'cases':
        return (
          <CasesView
            onSelectCase={(id) => setSelectedCaseId(id)}
            onOpenNewDispute={() => setIsNewDisputeModalOpen(true)}
          />
        );
      case 'ai-analyst':
        return (
          <AiAnalystView
            onSelectCase={(id) => setSelectedCaseId(id)}
          />
        );
      case 'imports':
        return <ImportsView />;
      case 'reports':
        return <ReportsView />;
      case 'team':
        return <TeamView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'billing':
        return <BillingView />;
      case 'security':
        return <SecurityView />;
      case 'tests':
        return <SecurityTestsView />;
      case 'legal':
        return <LegalView />;
      case 'admin':
        return <AdminView />;
      default:
        return (
          <DashboardView
            onSelectCase={(id) => setSelectedCaseId(id)}
            onOpenNewDispute={() => setIsNewDisputeModalOpen(true)}
            onNavigateToImports={() => setCurrentView('imports')}
            onNavigateToAi={() => setCurrentView('ai-analyst')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <OfflineIndicator />

      <Navigation
        currentView={currentView}
        onSelectView={(view) => {
          setSelectedCaseId(null);
          setCurrentView(view);
        }}
        onOpenNewDispute={() => setIsNewDisputeModalOpen(true)}
        onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
        onOpenMarketingLanding={() => setShowMarketingLanding(true)}
        onOpenAuth={() => handleOpenAuth('signin')}
        onOpenPlayStore={() => setIsPlayStoreModalOpen(true)}
        onOpenCompanySettings={() => setIsCompanySettingsModalOpen(true)}
        onOpenHelpGuide={() => setIsHelpModalOpen(true)}
        onOpenProductionReadiness={() => setIsProductionModalOpen(true)}
        onLogout={async () => {
          try {
            await signOut();
          } catch (e) {
            console.warn('Sign out processed locally', e);
          }
          sessionStorage.removeItem('chargeback_entered_app');
          localStorage.removeItem('chargeback_entered_app');
          setSelectedCaseId(null);
          setCurrentView('dashboard');
          setShowMarketingLanding(true);
        }}
      />

      {/* Main Content Area (offset by header & sidebar) */}
      <main className="pt-20 md:pl-64 flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
        {renderActiveView()}
      </main>

      {/* Modals */}
      <NewDisputeModal
        isOpen={isNewDisputeModalOpen}
        onClose={() => setIsNewDisputeModalOpen(false)}
        onSuccess={(newCaseId) => setSelectedCaseId(newCaseId)}
      />

      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authInitialMode}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <PlayStoreModal
        isOpen={isPlayStoreModalOpen}
        onClose={() => setIsPlayStoreModalOpen(false)}
      />

      <CompanySettingsModal
        isOpen={isCompanySettingsModalOpen}
        onClose={() => setIsCompanySettingsModalOpen(false)}
        onOpenStandeeModal={() => setIsStandeeModalOpen(true)}
      />

      <HelpGuideModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onOpenPlayStore={() => {
          setIsHelpModalOpen(false);
          setIsPlayStoreModalOpen(true);
        }}
        onOpenBilling={() => {
          setIsHelpModalOpen(false);
          setSelectedCaseId(null);
          setCurrentView('billing');
        }}
        onOpenSettings={() => {
          setIsHelpModalOpen(false);
          setIsCompanySettingsModalOpen(true);
        }}
      />

      <ProductionReadinessModal
        isOpen={isProductionModalOpen}
        onClose={() => setIsProductionModalOpen(false)}
        onOpenCheckout={() => {
          setCheckoutTargetPlan('growth');
          setIsCheckoutModalOpen(true);
        }}
        onOpenHelpGuide={() => {
          setIsProductionModalOpen(false);
          setIsHelpModalOpen(true);
        }}
      />

      <ContactSalesModal
        isOpen={isContactSalesModalOpen}
        onClose={() => setIsContactSalesModalOpen(false)}
      />

      <MerchantQrStandeeModal
        isOpen={isStandeeModalOpen}
        onClose={() => setIsStandeeModalOpen(false)}
        upiId={currentOrg?.upiPayoutId || 'settlements@apexcommerce.bank'}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        selectedPlan={checkoutTargetPlan}
        billingInterval="monthly"
        onSuccess={() => {
          setCurrentView('billing');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
