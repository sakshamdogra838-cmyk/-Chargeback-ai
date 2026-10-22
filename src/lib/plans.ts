import { PlanConfig, PlanTier } from '../types';

export const PLANS: Record<PlanTier, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free Starter',
    priceMonthly: 0,
    priceAnnualMonthly: 0,
    disputeLimit: 15,
    aiAnalysesLimit: 5,
    membersLimit: 1,
    exportLimit: 3,
    integrationsAllowed: false,
    features: [
      'Up to 15 disputes managed per month',
      '5 AI case analyses & rebuttal drafts',
      'Universal CSV import & field mapping',
      'Basic recovery metrics & financial dashboard',
      'Standard deadline tracking',
      'Single user workspace'
    ]
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    badge: 'Popular for DTC',
    priceMonthly: 99,
    priceAnnualMonthly: 79,
    disputeLimit: 100,
    aiAnalysesLimit: 50,
    membersLimit: 3,
    exportLimit: 25,
    integrationsAllowed: true,
    features: [
      'Up to 100 disputes managed per month',
      '50 Gemini AI analyses & rebuttal letters',
      '3 team members with role-based access',
      'Reason-specific evidence checklists',
      'Direct CSV & payment processor connections',
      'Standard email & in-app deadline alerts',
      'Sanitized CSV & report exports'
    ]
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    badge: 'Best Value',
    priceMonthly: 299,
    priceAnnualMonthly: 239,
    disputeLimit: 500,
    aiAnalysesLimit: 250,
    membersLimit: 10,
    exportLimit: 100,
    integrationsAllowed: true,
    features: [
      'Up to 500 disputes managed per month',
      '250 Gemini AI analyses & rebuttal letters',
      '10 team members with granular RBAC permissions',
      'Multi-processor sync (Stripe, Shopify, PayPal)',
      'Automated recovery prioritization ranking',
      'Advanced win-rate & reason code analytics',
      'Audit log access & team activity tracking',
      'Priority email & webhook alerts'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    badge: 'High Volume',
    priceMonthly: 799,
    priceAnnualMonthly: 639,
    disputeLimit: -1, // Unlimited
    aiAnalysesLimit: 1000,
    membersLimit: 50,
    exportLimit: -1,
    integrationsAllowed: true,
    features: [
      'Unlimited dispute case management',
      '1,000+ Gemini AI analyses & custom rebuttal drafts',
      'Up to 50 team members with custom security roles',
      'Enterprise audit log & compliance exports',
      'Dedicated processor integration engineer',
      'Custom SLA, data retention rules & SSO readiness',
      'Assigned customer success manager'
    ]
  }
};
