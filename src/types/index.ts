export type UserRole = 'owner' | 'admin' | 'analyst' | 'viewer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export type PlanTier = 'free' | 'starter' | 'growth' | 'enterprise';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';

export interface Organization {
  id: string;
  name: string;
  businessType: string;
  website?: string;
  monthlyVolume?: string;
  currency: string;
  ownerId: string;
  plan: PlanTier;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: string;
  supportEmail?: string;
  isDemo?: boolean;
  gatewaySettings?: {
    upiPayoutId?: string;
    stripeConnected?: boolean;
    stripePublishableKey?: string;
    stripeWebhookConfigured?: boolean;
    shopifyConnected?: boolean;
    shopifyStoreDomain?: string;
    paypalConnected?: boolean;
    paypalClientId?: string;
  };
  kycTier?: 'Tier 1 - Basic' | 'Tier 2 - Verified' | 'Tier 3 - Enterprise';
  disputeRate?: number;
  earlyWarningThreshold?: number;
  settlementSchedule?: 'instant_upi' | 't_plus_1' | 'weekly' | 'monthly';
  splitSettlementPercent?: number;
  reservePercent?: number;
  upiPayoutId?: string;
  apiKeyLive?: string;
  apiKeyTest?: string;
  webhookUrl?: string;
  vrolStatus?: 'safe' | 'monitoring' | 'breach';
  masterHolderName?: string;
  masterHoldingGroup?: string;
  gstinOrPan?: string;
  createdAt: string;
  updatedAt: string;
}

export type MultiMerchantCategory =
  | 'Multi-Tenant & Security'
  | 'Multi-Store Settlement & UPI'
  | 'Network Compliance & VROL'
  | 'AI Rebuttals & Evidence'
  | 'Developer Platform & Operations'
  | 'Rolling Reserves & Treasury'
  | 'Tax, Invoicing & Cross-Border'
  | 'Fraud Shield & Risk Fingerprinting'
  | 'Omnichannel Standee & In-Store'
  | 'Master Fleet Governance & Audit'
  | 'Gateway Integrations & Auto-Sync'
  | 'Chargeback Insurance & Loss Recovery'
  | 'Escrow Treasury & Sub-Merchant Splits'
  | 'Customer Behavioral Telemetry'
  | 'Cross-Border FX & International Clearing'
  | 'Autonomous AI Arbiter & Evidence Synthesis'
  | 'Real-Time Webhooks & Event Streaming'
  | 'Instant Liquidity & Working Capital Advances'
  | 'Card Scheme Dispute Defense & Pre-Arbitration'
  | 'Zero-Trust Enterprise Compliance & Audit Enclave'
  | 'Multi-Currency Dynamic Hedging & Settlement FX'
  | 'Omnichannel Tap-to-Pay & Smart Terminal Sync'
  | 'Automated Tax Withholding & 1099-K / GST E-Filing'
  | 'Biometric 3D Secure 2.3 & Frictionless Passkeys'
  | 'Predictive Chargeback Churn & Merchant Health';

export interface MultiMerchantChecklistItem {
  id: string;
  category: MultiMerchantCategory;
  title: string;
  description: string;
  status: 'active' | 'verified' | 'production_ready';
  technicalDetails: string;
  badge: string;
}

export interface Membership {
  id: string;
  organizationId: string;
  userId: string;
  userEmail: string;
  userDisplayName: string;
  role: UserRole;
  joinedAt: string;
}

export interface Invitation {
  id: string;
  organizationId: string;
  email: string;
  role: UserRole;
  token: string;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export type DisputeStatus = 
  | 'new'
  | 'under_review'
  | 'evidence_needed'
  | 'ready_for_submission'
  | 'submitted'
  | 'won'
  | 'lost'
  | 'closed';

export type DisputePriority = 'urgent' | 'high' | 'medium' | 'low';
export type DisputeWinStatus = 'pending' | 'won' | 'lost';

export interface EvidenceItem {
  id: string;
  type: string;
  label: string;
  description: string;
  required: boolean;
  collected: boolean;
  notes?: string;
  documentRef?: string;
}

export interface Dispute {
  id: string;
  organizationId: string;
  internalCaseId: string;
  transactionRef: string;
  orderRef: string;
  paymentProcessor: string;
  disputeReasonCode: string;
  disputeReasonCategory: string;
  disputeAmount: number;
  currency: string;
  transactionDate: string;
  disputeReceivedDate: string;
  submissionDeadline: string;
  customerName: string;
  customerEmail: string;
  trackingNumber?: string;
  carrier?: string;
  deliveryDate?: string;
  refundStatus: 'none' | 'partial' | 'full';
  status: DisputeStatus;
  priority: DisputePriority;
  winStatus: DisputeWinStatus;
  recoveredAmount: number;
  assignedToUserId?: string;
  assignedToName?: string;
  notes?: string;
  evidenceItems: EvidenceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AiAnalysisResult {
  id: string;
  organizationId: string;
  disputeId: string;
  summary: string;
  reasonExplanation: string;
  missingEvidence: string[];
  availableEvidence: string[];
  recommendations: string[];
  weaknesses: string[];
  urgency: 'critical' | 'high' | 'medium' | 'low';
  confidenceScore: number; // 0-100
  recoverabilityRating: 'High' | 'Moderate' | 'Low';
  draftResponse: string;
  modelUsed: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImportRecord {
  id: string;
  organizationId: string;
  fileName: string;
  rowCount: number;
  importedCount: number;
  skippedCount: number;
  duplicateCount: number;
  status: 'completed' | 'failed' | 'partial';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  organizationId: string;
  userId?: string;
  type: 'urgent_deadline' | 'new_dispute' | 'ai_completed' | 'import_finished' | 'quota_warning' | 'plan_updated' | 'info';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  organizationId: string;
  userId: string;
  userEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
  timestamp: string;
}

export interface UsagePeriod {
  organizationId: string;
  periodStart: string;
  periodEnd: string;
  aiAnalysesUsed: number;
  disputesImported: number;
  exportJobsRun: number;
}

export interface PlanConfig {
  id: PlanTier;
  name: string;
  badge?: string;
  priceMonthly: number;
  priceAnnualMonthly: number;
  disputeLimit: number; // -1 for unlimited
  aiAnalysesLimit: number;
  membersLimit: number;
  exportLimit: number;
  integrationsAllowed: boolean;
  features: string[];
}
