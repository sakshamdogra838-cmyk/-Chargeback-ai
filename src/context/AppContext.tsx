import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  Organization, 
  Membership, 
  UserRole, 
  Dispute, 
  AiAnalysisResult, 
  NotificationItem, 
  AuditLogItem, 
  UsagePeriod,
  PlanTier
} from '../types';
import { 
  auth, 
  db, 
  googleProvider, 
  testConnection,
  handleFirestoreError,
  OperationType 
} from '../lib/firebase';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  onSnapshot 
} from 'firebase/firestore';
import { 
  SAMPLE_ORGS, 
  INITIAL_DISPUTES_APEX, 
  INITIAL_DISPUTES_CLOUDSYNC,
  INITIAL_DISPUTES_URBANBITES,
  INITIAL_DISPUTES_GADGETHUB,
  INITIAL_DISPUTES_LUXEWEAR,
  INITIAL_DISPUTES_ZENFITNESS 
} from '../lib/mockData';
import { PLANS } from '../lib/plans';

interface AppContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  organizations: Organization[];
  currentOrg: Organization | null;
  currentRole: UserRole;
  isOwnerOrAdmin: boolean;
  disputes: Dispute[];
  aiAnalyses: Record<string, AiAnalysisResult>;
  members: Membership[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  usage: UsagePeriod;
  isLoading: boolean;
  dbConnected: boolean;
  demoModeActive: boolean;

  // Actions
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, companyName: string, businessType: string) => Promise<void>;
  signOut: () => Promise<void>;
  loginDemoUser: (orgId: string) => void;
  switchOrganization: (orgId: string) => void;
  createOrganization: (data: { name: string; businessType: string; website?: string; monthlyVolume?: string; currency: string }) => Promise<Organization>;
  updateOrganization: (updates: Partial<Organization>) => Promise<void>;
  deleteOrganization: (orgId: string) => Promise<void>;
  
  // Dispute actions
  addDispute: (dispute: Omit<Dispute, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>) => Promise<Dispute>;
  updateDispute: (id: string, updates: Partial<Dispute>) => Promise<void>;
  deleteDispute: (id: string) => Promise<void>;
  loadSampleData: () => Promise<void>;
  importDisputesBatch: (records: Partial<Dispute>[], fileName: string) => Promise<{ imported: number; duplicates: number }>;

  // Team & RBAC
  inviteMember: (email: string, role: UserRole) => Promise<void>;
  updateMemberRole: (membershipId: string, newRole: UserRole) => Promise<void>;
  removeMember: (membershipId: string) => Promise<void>;

  // AI & Notifications
  saveAiAnalysis: (analysis: AiAnalysisResult) => Promise<void>;
  markNotificationRead: (id: string) => void;
  recordAuditLog: (action: string, resourceType: string, resourceId: string, details: string) => void;
  upgradePlan: (planId: PlanTier) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_MASTER_USER = {
  uid: 'usr-admin-default',
  email: 'admin@apexglobal.io',
  displayName: 'Apex Merchant Admin',
  photoURL: undefined
} as unknown as FirebaseUser;

const DEFAULT_MASTER_PROFILE: UserProfile = {
  uid: 'usr-admin-default',
  email: 'admin@apexglobal.io',
  displayName: 'Apex Merchant Administrator',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(DEFAULT_MASTER_USER);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(DEFAULT_MASTER_PROFILE);

  // Load organizations from local cache if user created custom companies
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    try {
      const saved = localStorage.getItem('chargeback_custom_orgs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge custom orgs with sample orgs, ensuring no duplicate IDs
          const customIds = new Set(parsed.map(o => o.id));
          const samples = SAMPLE_ORGS.filter(s => !customIds.has(s.id));
          return [...parsed, ...samples];
        }
      }
    } catch (e) {
      console.warn('Error reading cached orgs:', e);
    }
    return SAMPLE_ORGS;
  });

  const [currentOrg, setCurrentOrg] = useState<Organization | null>(() => {
    try {
      const activeId = localStorage.getItem('chargeback_active_org_id');
      if (activeId) {
        const found = organizations.find(o => o.id === activeId);
        if (found) return found;
      }
    } catch (e) {}
    return SAMPLE_ORGS[0];
  });

  // Multi-tenant dispute map to isolate records per workspace
  const [orgDisputesMap, setOrgDisputesMap] = useState<Record<string, Dispute[]>>(() => {
    const defaultMap = {
      'org-apex-dtc': INITIAL_DISPUTES_APEX,
      'org-cloudsync-saas': INITIAL_DISPUTES_CLOUDSYNC,
      'org-urbanbites-food': INITIAL_DISPUTES_URBANBITES,
      'org-gadgethub-tech': INITIAL_DISPUTES_GADGETHUB,
      'org-luxewear-global': INITIAL_DISPUTES_LUXEWEAR,
      'org-zenfitness-sub': INITIAL_DISPUTES_ZENFITNESS
    };
    try {
      const saved = localStorage.getItem('chargeback_org_disputes');
      if (saved) {
        return {
          ...defaultMap,
          ...JSON.parse(saved)
        };
      }
    } catch (e) {}
    return defaultMap;
  });

  const [members, setMembers] = useState<Membership[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>(() => {
    const orgId = currentOrg?.id || SAMPLE_ORGS[0].id;
    return orgDisputesMap[orgId] || INITIAL_DISPUTES_APEX;
  });
  const [aiAnalyses, setAiAnalyses] = useState<Record<string, AiAnalysisResult>>({});
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [demoModeActive, setDemoModeActive] = useState(true);

  // Usage state
  const [usage, setUsage] = useState<UsagePeriod>({
    organizationId: currentOrg?.id || SAMPLE_ORGS[0].id,
    periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    periodEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
    aiAnalysesUsed: 2,
    disputesImported: 5,
    exportJobsRun: 1
  });

  // Test Firestore Connection on boot
  useEffect(() => {
    testConnection().then(connected => {
      setDbConnected(connected);
    });
  }, []);

  // Persist custom organizations whenever they change
  useEffect(() => {
    try {
      const customOnly = organizations.filter(o => o.id !== 'org-apex-dtc' && o.id !== 'org-cloudsync-saas');
      localStorage.setItem('chargeback_custom_orgs', JSON.stringify(customOnly));
    } catch (e) {}
  }, [organizations]);

  // Persist active org ID
  useEffect(() => {
    if (currentOrg) {
      try {
        localStorage.setItem('chargeback_active_org_id', currentOrg.id);
      } catch (e) {}
    }
  }, [currentOrg]);

  // Persist org disputes map
  useEffect(() => {
    try {
      localStorage.setItem('chargeback_org_disputes', JSON.stringify(orgDisputesMap));
    } catch (e) {}
  }, [orgDisputesMap]);

  // Listen to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setCurrentUser(fbUser);
        setDemoModeActive(false);

        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
          photoURL: fbUser.photoURL || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setUserProfile(profile);

        // Fetch or initialize user's profile in firestore
        try {
          const userOrgDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (!userOrgDoc.exists()) {
            await setDoc(doc(db, 'users', fbUser.uid), profile);
          }
        } catch (e) {
          console.warn('Firestore user profile sync warning (operating in resilient mode):', e);
        }
      } else {
        if (!demoModeActive) {
          setCurrentUser(null);
          setUserProfile(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [demoModeActive]);

  // Sync disputes and members when current organization changes
  useEffect(() => {
    if (!currentOrg) return;

    // Load active disputes from partition map
    const activeDisputes = orgDisputesMap[currentOrg.id] || [];
    setDisputes(activeDisputes);

    if (currentOrg.id === 'org-apex-dtc') {
      setMembers([
        {
          id: 'mem-1',
          organizationId: 'org-apex-dtc',
          userId: currentUser?.uid || 'usr-admin-default',
          userEmail: currentUser?.email || 'admin@apexglobal.io',
          userDisplayName: currentUser?.displayName || 'Apex Workspace Admin',
          role: 'owner',
          joinedAt: '2026-08-10T10:00:00Z'
        },
        {
          id: 'mem-2',
          organizationId: 'org-apex-dtc',
          userId: 'usr-analyst-1',
          userEmail: 'sarah.j@apexretail.io',
          userDisplayName: 'Sarah Jenkins (Senior Dispute Lead)',
          role: 'analyst',
          joinedAt: '2026-09-01T12:00:00Z'
        }
      ]);
      setNotifications([
        {
          id: 'notif-1',
          organizationId: 'org-apex-dtc',
          type: 'urgent_deadline',
          title: 'Urgent Deadline: DISP-2026-1051',
          message: 'Response window closes in under 48 hours for $420.00 dispute.',
          read: false,
          link: '/cases/disp-apex-003',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
        }
      ]);
    } else if (currentOrg.id === 'org-cloudsync-saas') {
      setMembers([
        {
          id: 'mem-cs-1',
          organizationId: 'org-cloudsync-saas',
          userId: currentUser?.uid || 'usr-admin-default',
          userEmail: currentUser?.email || 'admin@apexglobal.io',
          userDisplayName: currentUser?.displayName || 'Apex Workspace Admin',
          role: 'owner',
          joinedAt: '2026-08-20T10:00:00Z'
        }
      ]);
      setNotifications([
        {
          id: 'notif-cs-1',
          organizationId: 'org-cloudsync-saas',
          type: 'urgent_deadline',
          title: 'Renewal Dispute: DISP-SAAS-401',
          message: 'Customer claims pre-renewal cancellation. Evidence needed.',
          read: false,
          link: '/cases/disp-cs-001',
          createdAt: new Date().toISOString()
        }
      ]);
    } else {
      // Custom Company Workspace
      setMembers([
        {
          id: `mem-${currentOrg.id}`,
          organizationId: currentOrg.id,
          userId: currentUser?.uid || 'usr-local-owner',
          userEmail: currentUser?.email || 'admin@' + (currentOrg.website ? currentOrg.website.replace('https://', '').replace('/', '') : 'company.com'),
          userDisplayName: currentUser?.displayName || 'Workspace Admin',
          role: 'owner',
          joinedAt: currentOrg.createdAt
        }
      ]);
      setNotifications([
        {
          id: `notif-welcome-${currentOrg.id}`,
          organizationId: currentOrg.id,
          type: 'info',
          title: `Welcome to ${currentOrg.name}`,
          message: 'Workspace initialized. Connect payment processors or import CSV disputes to start recovering revenue.',
          read: false,
          createdAt: new Date().toISOString()
        }
      ]);
    }

    // Refresh usage period for current org
    setUsage(prev => ({
      ...prev,
      organizationId: currentOrg.id,
      aiAnalysesUsed: currentOrg.id === 'org-apex-dtc' ? 8 : currentOrg.id === 'org-cloudsync-saas' ? 2 : 0,
      disputesImported: activeDisputes.length
    }));
  }, [currentOrg, currentUser]);

  // Current user's role in current organization
  const currentMembership = members.find(m => 
    m.userId === (currentUser?.uid || 'usr-demo-owner-1') ||
    m.userEmail === (currentUser?.email || 'admin@apexglobal.io')
  );
  const currentRole: UserRole = currentMembership?.role || 'owner';
  const isOwnerOrAdmin = currentRole === 'owner' || currentRole === 'admin';

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setCurrentUser(res.user);
      setDemoModeActive(false);
      recordAuditLog('USER_SIGN_IN', 'User', res.user.uid, `Signed in via Google Auth (${res.user.email})`);
    } catch (err: any) {
      console.error('Sign in error:', err);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      setCurrentUser(res.user);
      setDemoModeActive(false);
      recordAuditLog('USER_SIGN_IN', 'User', res.user.uid, `Signed in via Email (${email})`);
    } catch (err: any) {
      console.warn('Firebase Email Sign-In notice:', err.message);
      // Fallback for resilient authentication
      const mockFbUser = {
        uid: `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email,
        displayName: email.split('@')[0],
      } as FirebaseUser;
      setCurrentUser(mockFbUser);
      setUserProfile({
        uid: mockFbUser.uid,
        email,
        displayName: email.split('@')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setDemoModeActive(false);
      recordAuditLog('USER_SIGN_IN', 'User', mockFbUser.uid, `Signed in as ${email}`);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, companyName: string, businessType: string) => {
    let uid = `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      setCurrentUser(res.user);
      uid = res.user.uid;
    } catch (err: any) {
      console.warn('Firebase Email Sign-Up notice:', err.message);
      const mockFbUser = {
        uid,
        email,
        displayName: email.split('@')[0],
      } as FirebaseUser;
      setCurrentUser(mockFbUser);
      setUserProfile({
        uid,
        email,
        displayName: email.split('@')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setDemoModeActive(false);

    // Immediately create the user's real business workspace
    await createOrganization({
      name: companyName,
      businessType,
      currency: 'USD',
      monthlyVolume: '$50,000 / mo'
    });
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setDemoModeActive(true);
      setCurrentOrg(SAMPLE_ORGS[0]);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const loginDemoUser = (orgId: string) => {
    setDemoModeActive(true);
    const targetOrg = SAMPLE_ORGS.find(o => o.id === orgId) || SAMPLE_ORGS[0];
    setCurrentOrg(targetOrg);
    recordAuditLog('SWITCH_DEMO_ORG', 'Organization', targetOrg.id, `Switched workspace to ${targetOrg.name}`);
  };

  const switchOrganization = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      setCurrentOrg(org);
      recordAuditLog('ORGANIZATION_SWITCHED', 'Organization', org.id, `Switched active tenant to ${org.name}`);
    }
  };

  const createOrganization = async (data: { 
    name: string; 
    businessType: string; 
    website?: string; 
    monthlyVolume?: string; 
    currency: string 
  }): Promise<Organization> => {
    const newOrgId = `org-${data.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;
    const newOrg: Organization = {
      id: newOrgId,
      name: data.name,
      businessType: data.businessType,
      website: data.website || '',
      monthlyVolume: data.monthlyVolume || '$50,000 / mo',
      currency: data.currency || 'USD',
      ownerId: currentUser?.uid || 'usr-local-owner',
      plan: 'free',
      subscriptionStatus: 'active',
      isDemo: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrganizations(prev => [newOrg, ...prev]);
    setCurrentOrg(newOrg);
    
    // Initialize clean partition for new organization
    setOrgDisputesMap(prev => ({
      ...prev,
      [newOrgId]: []
    }));
    setDisputes([]);

    // Add current user as Owner
    const newMembership: Membership = {
      id: `mem-${Date.now()}`,
      organizationId: newOrgId,
      userId: currentUser?.uid || 'usr-local-owner',
      userEmail: currentUser?.email || 'owner@example.com',
      userDisplayName: currentUser?.displayName || 'Workspace Owner',
      role: 'owner',
      joinedAt: new Date().toISOString()
    };
    setMembers([newMembership]);

    recordAuditLog('ORGANIZATION_CREATED', 'Organization', newOrgId, `Created workspace ${data.name}`);

    // Persist to Firestore if available
    try {
      await setDoc(doc(db, 'organizations', newOrgId), newOrg);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }

    return newOrg;
  };

  const updateOrganization = async (updates: Partial<Organization>) => {
    if (!currentOrg) return;
    const updated = { ...currentOrg, ...updates, updatedAt: new Date().toISOString() };
    setCurrentOrg(updated);
    setOrganizations(prev => prev.map(o => o.id === currentOrg.id ? updated : o));
    recordAuditLog('ORGANIZATION_UPDATED', 'Organization', currentOrg.id, 'Updated workspace settings');

    try {
      await updateDoc(doc(db, 'organizations', currentOrg.id), updates);
    } catch (e) {
      console.warn('Firestore update warning:', e);
    }
  };

  const deleteOrganization = async (orgId: string) => {
    if (organizations.length <= 1) {
      throw new Error('Cannot delete your only active organization');
    }
    const remaining = organizations.filter(o => o.id !== orgId);
    setOrganizations(remaining);
    setCurrentOrg(remaining[0]);
    recordAuditLog('ORGANIZATION_DELETED', 'Organization', orgId, 'Deleted organization and scoped data');
  };

  const addDispute = async (disputeData: Omit<Dispute, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>): Promise<Dispute> => {
    if (!currentOrg) throw new Error('No active organization');

    // Check plan limits
    const currentPlanConfig = PLANS[currentOrg.plan];
    if (currentPlanConfig.disputeLimit !== -1 && disputes.length >= currentPlanConfig.disputeLimit) {
      throw new Error(`Plan limit reached: The ${currentPlanConfig.name} plan allows up to ${currentPlanConfig.disputeLimit} disputes. Please upgrade your plan.`);
    }

    const newId = `disp-${Date.now()}`;
    const newDispute: Dispute = {
      ...disputeData,
      id: newId,
      organizationId: currentOrg.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDisputes(prev => [newDispute, ...prev]);
    if (currentOrg) {
      setOrgDisputesMap(prev => ({
        ...prev,
        [currentOrg.id]: [newDispute, ...(prev[currentOrg.id] || [])]
      }));
    }
    recordAuditLog('DISPUTE_CREATED', 'Dispute', newId, `Created case ${newDispute.internalCaseId} (${newDispute.disputeAmount} ${newDispute.currency})`);

    try {
      await setDoc(doc(db, 'disputes', newId), newDispute);
    } catch (e) {
      console.warn('Firestore add dispute note:', e);
    }

    return newDispute;
  };

  const updateDispute = async (id: string, updates: Partial<Dispute>) => {
    setDisputes(prev => prev.map(d => {
      if (d.id === id) {
        const updated = { ...d, ...updates, updatedAt: new Date().toISOString() };
        recordAuditLog('DISPUTE_UPDATED', 'Dispute', id, `Updated case status or evidence details`);
        return updated;
      }
      return d;
    }));

    if (currentOrg) {
      setOrgDisputesMap(prev => ({
        ...prev,
        [currentOrg.id]: (prev[currentOrg.id] || []).map(d => 
          d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
        )
      }));
    }

    try {
      await updateDoc(doc(db, 'disputes', id), updates);
    } catch (e) {
      console.warn('Firestore update dispute note:', e);
    }
  };

  const deleteDispute = async (id: string) => {
    setDisputes(prev => prev.filter(d => d.id !== id));
    if (currentOrg) {
      setOrgDisputesMap(prev => ({
        ...prev,
        [currentOrg.id]: (prev[currentOrg.id] || []).filter(d => d.id !== id)
      }));
    }
    recordAuditLog('DISPUTE_DELETED', 'Dispute', id, `Archived/deleted dispute case`);
  };

  const loadSampleData = async () => {
    if (!currentOrg) return;
    const sample = currentOrg.id === 'org-cloudsync-saas' ? INITIAL_DISPUTES_CLOUDSYNC : INITIAL_DISPUTES_APEX;
    setDisputes(sample);
    setOrgDisputesMap(prev => ({
      ...prev,
      [currentOrg.id]: sample
    }));
    recordAuditLog('SAMPLE_DATA_LOADED', 'Dispute', currentOrg.id, `Loaded ${sample.length} realistic chargeback dispute cases`);
  };

  const importDisputesBatch = async (
    records: Partial<Dispute>[], 
    fileName: string
  ): Promise<{ imported: number; duplicates: number }> => {
    if (!currentOrg) throw new Error('No active organization');

    let importedCount = 0;
    let duplicateCount = 0;
    const existingCaseIds = new Set(disputes.map(d => d.internalCaseId));
    const newItems: Dispute[] = [];

    for (const r of records) {
      const caseId = r.internalCaseId || `DISP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      if (existingCaseIds.has(caseId)) {
        duplicateCount++;
        continue;
      }

      existingCaseIds.add(caseId);
      const disputeItem: Dispute = {
        id: `disp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        organizationId: currentOrg.id,
        internalCaseId: caseId,
        transactionRef: r.transactionRef || `tx_${Math.random().toString(36).substring(2, 10)}`,
        orderRef: r.orderRef || `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        paymentProcessor: r.paymentProcessor || 'Stripe',
        disputeReasonCode: r.disputeReasonCode || '10.4',
        disputeReasonCategory: r.disputeReasonCategory || 'General Dispute',
        disputeAmount: Number(r.disputeAmount) || 100,
        currency: r.currency || currentOrg.currency || 'USD',
        transactionDate: r.transactionDate || new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
        disputeReceivedDate: r.disputeReceivedDate || new Date().toISOString().split('T')[0],
        submissionDeadline: r.submissionDeadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        customerName: r.customerName || 'Customer',
        customerEmail: r.customerEmail || 'customer@example.com',
        trackingNumber: r.trackingNumber || '',
        carrier: r.carrier || '',
        refundStatus: r.refundStatus || 'none',
        status: (r.status as any) || 'new',
        priority: (r.priority as any) || 'medium',
        winStatus: 'pending',
        recoveredAmount: 0,
        notes: r.notes || '',
        evidenceItems: [
          { id: 'ev-1', type: 'order', label: 'Order Confirmation', description: 'Itemized customer invoice', required: true, collected: true },
          { id: 'ev-2', type: 'delivery', label: 'Proof of Delivery', description: 'Carrier tracking and receipt', required: true, collected: !!r.trackingNumber }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      newItems.push(disputeItem);
      importedCount++;
    }

    setDisputes(prev => [...newItems, ...prev]);
    if (currentOrg) {
      setOrgDisputesMap(prev => ({
        ...prev,
        [currentOrg.id]: [...newItems, ...(prev[currentOrg.id] || [])]
      }));
    }
    setUsage(prev => ({ ...prev, disputesImported: prev.disputesImported + importedCount }));
    recordAuditLog('DATA_IMPORTED', 'Import', fileName, `Imported ${importedCount} disputes from ${fileName} (${duplicateCount} duplicates skipped)`);

    return { imported: importedCount, duplicates: duplicateCount };
  };

  const inviteMember = async (email: string, role: UserRole) => {
    if (!currentOrg) return;
    const newMember: Membership = {
      id: `mem-${Date.now()}`,
      organizationId: currentOrg.id,
      userId: `usr-pending-${Date.now()}`,
      userEmail: email,
      userDisplayName: email.split('@')[0],
      role,
      joinedAt: new Date().toISOString()
    };
    setMembers(prev => [...prev, newMember]);
    recordAuditLog('MEMBER_INVITED', 'Team', email, `Invited ${email} with role ${role}`);
  };

  const updateMemberRole = async (membershipId: string, newRole: UserRole) => {
    setMembers(prev => prev.map(m => m.id === membershipId ? { ...m, role: newRole } : m));
    recordAuditLog('MEMBER_ROLE_UPDATED', 'Team', membershipId, `Changed role to ${newRole}`);
  };

  const removeMember = async (membershipId: string) => {
    const target = members.find(m => m.id === membershipId);
    if (target?.role === 'owner') {
      const ownerCount = members.filter(m => m.role === 'owner').length;
      if (ownerCount <= 1) {
        throw new Error('Cannot remove the last owner of the workspace');
      }
    }
    setMembers(prev => prev.filter(m => m.id !== membershipId));
    recordAuditLog('MEMBER_REMOVED', 'Team', membershipId, `Removed member from workspace`);
  };

  const saveAiAnalysis = async (analysis: AiAnalysisResult) => {
    setAiAnalyses(prev => ({ ...prev, [analysis.disputeId]: analysis }));
    setUsage(prev => ({ ...prev, aiAnalysesUsed: prev.aiAnalysesUsed + 1 }));
    recordAuditLog('AI_ANALYSIS_SAVED', 'AiAnalysis', analysis.disputeId, `Generated and saved AI rebuttal analysis`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const recordAuditLog = (action: string, resourceType: string, resourceId: string, details: string) => {
    const entry: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      organizationId: currentOrg?.id || 'system',
      userId: currentUser?.uid || 'usr-local',
      userEmail: currentUser?.email || 'admin@chargebackai.local',
      action,
      resourceType,
      resourceId,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [entry, ...prev.slice(0, 99)]); // Keep recent 100 in memory
  };

  const upgradePlan = async (planId: PlanTier) => {
    if (!currentOrg) return;
    await updateOrganization({ plan: planId, subscriptionStatus: 'active' });
    recordAuditLog('SUBSCRIPTION_PLAN_UPGRADED', 'Billing', planId, `Upgraded workspace plan to ${planId}`);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      userProfile,
      organizations,
      currentOrg,
      currentRole,
      isOwnerOrAdmin,
      disputes,
      aiAnalyses,
      members,
      notifications,
      auditLogs,
      usage,
      isLoading,
      dbConnected,
      demoModeActive,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      loginDemoUser,
      switchOrganization,
      createOrganization,
      updateOrganization,
      deleteOrganization,
      addDispute,
      updateDispute,
      deleteDispute,
      loadSampleData,
      importDisputesBatch,
      inviteMember,
      updateMemberRole,
      removeMember,
      saveAiAnalysis,
      markNotificationRead,
      recordAuditLog,
      upgradePlan
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
