import { Dispute, Organization } from '../types';
export { MULTI_MERCHANT_100_CHECKLIST, MULTI_MERCHANT_150_CHECKLIST, MULTI_MERCHANT_200_CHECKLIST, MULTI_MERCHANT_250_CHECKLIST } from './multiMerchant100';

export const SAMPLE_ORGS: Organization[] = [
  {
    id: 'org-apex-dtc',
    name: 'Apex Direct Retail (Fashion & Apparel)',
    businessType: 'Ecommerce & Retail',
    website: 'https://apexretail.io',
    monthlyVolume: '$185,000 / mo',
    currency: 'USD',
    ownerId: 'usr-corp-master-holder',
    masterHolderName: 'Apex Global Commerce Group',
    masterHoldingGroup: 'Apex Global Enterprise Holdings',
    gstinOrPan: '07AABCD1234E1Z5',
    plan: 'enterprise',
    subscriptionStatus: 'active',
    isDemo: false,
    kycTier: 'Tier 3 - Enterprise',
    disputeRate: 0.38,
    earlyWarningThreshold: 0.90,
    settlementSchedule: 'instant_upi',
    splitSettlementPercent: 98,
    reservePercent: 2,
    upiPayoutId: 'settlements@apexcommerce.bank',
    apiKeyLive: 'sk_live_apex_retail_992103819284',
    apiKeyTest: 'sk_test_apex_retail_229104819284',
    webhookUrl: 'https://api.apexretail.io/webhooks/chargeback',
    vrolStatus: 'safe',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'org-cloudsync-saas',
    name: 'CloudSync Enterprise Systems (B2B SaaS)',
    businessType: 'B2B SaaS / Subscriptions',
    website: 'https://cloudsync.io',
    monthlyVolume: '$340,000 / mo',
    currency: 'USD',
    ownerId: 'usr-corp-master-holder',
    masterHolderName: 'Apex Global Commerce Group',
    masterHoldingGroup: 'Apex Global Enterprise Holdings',
    gstinOrPan: '07AABCD1234E1Z5',
    plan: 'enterprise',
    subscriptionStatus: 'active',
    isDemo: false,
    kycTier: 'Tier 3 - Enterprise',
    disputeRate: 0.24,
    earlyWarningThreshold: 0.90,
    settlementSchedule: 'instant_upi',
    splitSettlementPercent: 98.5,
    reservePercent: 1.5,
    upiPayoutId: 'payouts@cloudsync.bank',
    apiKeyLive: 'sk_live_cloudsync_11029481920',
    apiKeyTest: 'sk_test_cloudsync_5592810938',
    webhookUrl: 'https://api.cloudsync.io/v1/chargebacks',
    vrolStatus: 'safe',
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'org-urbanbites-food',
    name: 'UrbanBites QuickCommerce & Food',
    businessType: 'Food & Quick Commerce',
    website: 'https://urbanbites.co',
    monthlyVolume: '₹58,00,000 / mo',
    currency: 'INR',
    ownerId: 'usr-corp-master-holder',
    masterHolderName: 'Apex Global Commerce Group',
    masterHoldingGroup: 'Apex Global Enterprise Holdings',
    gstinOrPan: '07AABCD1234E1Z5',
    plan: 'enterprise',
    subscriptionStatus: 'active',
    isDemo: false,
    kycTier: 'Tier 3 - Enterprise',
    disputeRate: 0.16,
    earlyWarningThreshold: 0.85,
    settlementSchedule: 'instant_upi',
    splitSettlementPercent: 98,
    reservePercent: 2,
    upiPayoutId: 'treasury@urbanbites.bank',
    apiKeyLive: 'sk_live_urbanbites_88472910381',
    apiKeyTest: 'sk_test_urbanbites_33729108462',
    webhookUrl: 'https://api.urbanbites.co/pos/webhook',
    vrolStatus: 'safe',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'org-gadgethub-tech',
    name: 'GadgetHub Electronics & Smart Tech',
    businessType: 'Consumer Tech & Hardware',
    website: 'https://gadgethub.io',
    monthlyVolume: '$610,000 / mo',
    currency: 'USD',
    ownerId: 'usr-corp-master-holder',
    masterHolderName: 'Apex Global Commerce Group',
    masterHoldingGroup: 'Apex Global Enterprise Holdings',
    gstinOrPan: '07AABCD1234E1Z5',
    plan: 'enterprise',
    subscriptionStatus: 'active',
    isDemo: false,
    kycTier: 'Tier 3 - Enterprise',
    disputeRate: 0.45,
    earlyWarningThreshold: 0.90,
    settlementSchedule: 'instant_upi',
    splitSettlementPercent: 97.5,
    reservePercent: 2.5,
    upiPayoutId: 'settlements@gadgethub.bank',
    apiKeyLive: 'sk_live_gadgethub_44729103829',
    apiKeyTest: 'sk_test_gadgethub_11928472910',
    webhookUrl: 'https://api.gadgethub.io/api/fraud-alerts',
    vrolStatus: 'safe',
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'org-luxewear-global',
    name: 'LuxeWear Global Atelier & Exports',
    businessType: 'High-End Luxury Goods',
    website: 'https://luxewear.eu',
    monthlyVolume: '€280,000 / mo',
    currency: 'EUR',
    ownerId: 'usr-corp-master-holder',
    masterHolderName: 'Apex Global Commerce Group',
    masterHoldingGroup: 'Apex Global Enterprise Holdings',
    gstinOrPan: '07AABCD1234E1Z5',
    plan: 'enterprise',
    subscriptionStatus: 'active',
    isDemo: false,
    kycTier: 'Tier 3 - Enterprise',
    disputeRate: 0.29,
    earlyWarningThreshold: 0.90,
    settlementSchedule: 'instant_upi',
    splitSettlementPercent: 98,
    reservePercent: 2,
    upiPayoutId: 'treasury@luxewear.bank',
    apiKeyLive: 'sk_live_luxewear_99382019482',
    apiKeyTest: 'sk_test_luxewear_44829103819',
    webhookUrl: 'https://api.luxewear.eu/payments/dispute-notice',
    vrolStatus: 'safe',
    createdAt: new Date(Date.now() - 75 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'org-zenfitness-sub',
    name: 'ZenStream Digital Media & Streaming Subscriptions',
    businessType: 'Subscription & Digital Streaming',
    website: 'https://zenstream.io',
    monthlyVolume: '$195,000 / mo',
    currency: 'USD',
    ownerId: 'usr-corp-master-holder',
    masterHolderName: 'Apex Global Commerce Group',
    masterHoldingGroup: 'Apex Global Enterprise Holdings',
    gstinOrPan: '07AABCD1234E1Z5',
    plan: 'enterprise',
    subscriptionStatus: 'active',
    isDemo: false,
    kycTier: 'Tier 3 - Enterprise',
    disputeRate: 0.21,
    earlyWarningThreshold: 0.90,
    settlementSchedule: 'instant_upi',
    splitSettlementPercent: 98.2,
    reservePercent: 1.8,
    upiPayoutId: 'payouts@zenstream.bank',
    apiKeyLive: 'sk_live_zenstream_77281092837',
    apiKeyTest: 'sk_test_zenstream_22819203847',
    webhookUrl: 'https://api.zenstream.io/api/billing-events',
    vrolStatus: 'safe',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_DISPUTES_APEX: Dispute[] = [
  {
    id: 'disp-apex-001',
    organizationId: 'org-apex-dtc',
    internalCaseId: 'DISP-2026-1049',
    transactionRef: 'ch_3N82bL2eZvKYlo2C1k8a92mX',
    orderRef: 'ORD-89211',
    paymentProcessor: 'Shopify Payments (Stripe)',
    disputeReasonCode: '13.1',
    disputeReasonCategory: 'Merchandise Not Received',
    disputeAmount: 349.50,
    currency: 'USD',
    transactionDate: '2026-09-18',
    disputeReceivedDate: '2026-10-08',
    submissionDeadline: '2026-10-22',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.vance@example.com',
    trackingNumber: '1Z9999999999999999',
    carrier: 'UPS Ground',
    deliveryDate: '2026-09-22',
    refundStatus: 'none',
    status: 'evidence_needed',
    priority: 'urgent',
    winStatus: 'pending',
    recoveredAmount: 0,
    assignedToName: 'Sarah Jenkins',
    notes: 'Customer claims designer jacket was never delivered. UPS tracking shows signed proof of delivery at front door by customer surname.',
    evidenceItems: [
      { id: 'ev-1', type: 'delivery', label: 'Signed Proof of Delivery', description: 'UPS signature confirmation and GPS delivery coordinates', required: true, collected: true },
      { id: 'ev-2', type: 'order', label: 'Order Confirmation & Invoice', description: 'Itemized receipt matching customer billing address', required: true, collected: true },
      { id: 'ev-3', type: 'comms', label: 'Customer Communications', description: 'Support chat or email transcripts prior to dispute', required: false, collected: false },
      { id: 'ev-4', type: 'terms', label: 'Terms of Service Acceptance', description: 'Checkout log proving acceptance of shipping policy', required: true, collected: true }
    ],
    createdAt: '2026-10-08T10:15:00Z',
    updatedAt: '2026-10-10T14:20:00Z'
  },
  {
    id: 'disp-apex-002',
    organizationId: 'org-apex-dtc',
    internalCaseId: 'DISP-2026-1050',
    transactionRef: 'ch_3N84xP2eZvKYlo2C0198dd3A',
    orderRef: 'ORD-89304',
    paymentProcessor: 'Stripe',
    disputeReasonCode: '10.4',
    disputeReasonCategory: 'Fraudulent - Card Absent',
    disputeAmount: 189.00,
    currency: 'USD',
    transactionDate: '2026-09-24',
    disputeReceivedDate: '2026-10-09',
    submissionDeadline: '2026-10-24',
    customerName: 'Elena Rostova',
    customerEmail: 'e.rostova@example.com',
    trackingNumber: '9400111899223192837192',
    carrier: 'USPS Priority',
    deliveryDate: '2026-09-28',
    refundStatus: 'none',
    status: 'ready_for_submission',
    priority: 'high',
    winStatus: 'pending',
    recoveredAmount: 0,
    assignedToName: 'Alex Chen',
    notes: 'Cardholder claims unauthorized transaction. AVS matched zip code 94107 and CVV2 verified passed at authorization time.',
    evidenceItems: [
      { id: 'ev-1', type: 'avs_cvv', label: 'AVS & CVV Verification Match', description: 'Processor authorization logs with full AVS street & zip match', required: true, collected: true },
      { id: 'ev-2', type: 'ip_log', label: 'Customer IP & Geolocation', description: 'Order submission IP address matching billing city', required: true, collected: true },
      { id: 'ev-3', type: 'delivery', label: 'Carrier Delivery Confirmation', description: 'USPS scanned delivery to billing address', required: true, collected: true }
    ],
    createdAt: '2026-10-09T08:30:00Z',
    updatedAt: '2026-10-11T16:00:00Z'
  },
  {
    id: 'disp-apex-003',
    organizationId: 'org-apex-dtc',
    internalCaseId: 'DISP-2026-1051',
    transactionRef: 'ch_3N79qA2eZvKYlo2C2098xx9L',
    orderRef: 'ORD-88992',
    paymentProcessor: 'Shopify Payments',
    disputeReasonCode: '13.3',
    disputeReasonCategory: 'Not as Described',
    disputeAmount: 420.00,
    currency: 'USD',
    transactionDate: '2026-09-10',
    disputeReceivedDate: '2026-09-28',
    submissionDeadline: '2026-10-14',
    customerName: 'David K. Wright',
    customerEmail: 'david.wright@example.com',
    trackingNumber: 'FEDEX-782910293819',
    carrier: 'FedEx Home',
    deliveryDate: '2026-09-14',
    refundStatus: 'none',
    status: 'submitted',
    priority: 'urgent',
    winStatus: 'pending',
    recoveredAmount: 0,
    assignedToName: 'Sarah Jenkins',
    notes: 'Customer disputed stating color was off. They never returned merchandise or contacted merchant for RMA return as required by return policy.',
    evidenceItems: [
      { id: 'ev-1', type: 'policy', label: 'Published Return Policy', description: 'Return policy requiring return authorization prior to refund', required: true, collected: true },
      { id: 'ev-2', type: 'product', label: 'Product Description & Specs', description: 'Product page specifications and imagery', required: true, collected: true },
      { id: 'ev-3', type: 'tracking', label: 'No Return Tracking', description: 'Verification that merchant warehouse received zero returned parcels', required: true, collected: true }
    ],
    createdAt: '2026-09-28T11:00:00Z',
    updatedAt: '2026-10-12T09:30:00Z'
  },
  {
    id: 'disp-apex-004',
    organizationId: 'org-apex-dtc',
    internalCaseId: 'DISP-2026-0988',
    transactionRef: 'ch_3N61mN2eZvKYlo2C1183aa4V',
    orderRef: 'ORD-87110',
    paymentProcessor: 'Stripe',
    disputeReasonCode: '13.1',
    disputeReasonCategory: 'Merchandise Not Received',
    disputeAmount: 275.00,
    currency: 'USD',
    transactionDate: '2026-08-15',
    disputeReceivedDate: '2026-09-02',
    submissionDeadline: '2026-09-16',
    customerName: 'Rachel Miller',
    customerEmail: 'rmiller@example.com',
    trackingNumber: '1Z8888888888888888',
    carrier: 'UPS Next Day',
    deliveryDate: '2026-08-17',
    refundStatus: 'none',
    status: 'won',
    priority: 'low',
    winStatus: 'won',
    recoveredAmount: 275.00,
    assignedToName: 'Alex Chen',
    notes: 'Dispute closed in our favor! Issuing bank reversed chargeback after GPS delivery scan and signature were submitted.',
    evidenceItems: [
      { id: 'ev-1', type: 'delivery', label: 'Signed Proof of Delivery', description: 'UPS signature confirmation', required: true, collected: true }
    ],
    createdAt: '2026-09-02T14:00:00Z',
    updatedAt: '2026-09-25T11:45:00Z'
  },
  {
    id: 'disp-apex-005',
    organizationId: 'org-apex-dtc',
    internalCaseId: 'DISP-2026-0940',
    transactionRef: 'ch_3N52kL2eZvKYlo2C9812cc1Z',
    orderRef: 'ORD-86200',
    paymentProcessor: 'Shopify Payments',
    disputeReasonCode: '10.4',
    disputeReasonCategory: 'Fraudulent - Card Absent',
    disputeAmount: 145.00,
    currency: 'USD',
    transactionDate: '2026-08-01',
    disputeReceivedDate: '2026-08-20',
    submissionDeadline: '2026-09-05',
    customerName: 'Timothy Vance',
    customerEmail: 'tvance@example.com',
    refundStatus: 'none',
    status: 'lost',
    priority: 'low',
    winStatus: 'lost',
    recoveredAmount: 0,
    assignedToName: 'Sarah Jenkins',
    notes: 'Lost due to mismatched shipping address and lack of signed delivery evidence.',
    evidenceItems: [],
    createdAt: '2026-08-20T12:00:00Z',
    updatedAt: '2026-09-10T10:00:00Z'
  }
];

export const INITIAL_DISPUTES_CLOUDSYNC: Dispute[] = [
  {
    id: 'disp-cs-001',
    organizationId: 'org-cloudsync-saas',
    internalCaseId: 'DISP-SAAS-401',
    transactionRef: 'sub_ch_99a8182741',
    orderRef: 'INV-2026-4821',
    paymentProcessor: 'Stripe Billing',
    disputeReasonCode: '13.7',
    disputeReasonCategory: 'Cancelled Recurring Transaction',
    disputeAmount: 588.00,
    currency: 'USD',
    transactionDate: '2026-09-29',
    disputeReceivedDate: '2026-10-05',
    submissionDeadline: '2026-10-19',
    customerName: 'Jordan Bailey (Acme Tech)',
    customerEmail: 'jordan@acmetech.io',
    refundStatus: 'none',
    status: 'evidence_needed',
    priority: 'high',
    winStatus: 'pending',
    recoveredAmount: 0,
    notes: 'Subscriber claims they cancelled their annual plan prior to renewal. Application audit logs show user actively logged in and exported data 4 days after renewal date.',
    evidenceItems: [
      { id: 'ev-1', type: 'access_logs', label: 'Application Login & Activity Logs', description: 'Server access logs showing usage post-renewal', required: true, collected: true },
      { id: 'ev-2', type: 'sub_terms', label: 'Subscription Agreement & Renewal Notice', description: 'Terms proving 14-day renewal reminder email sent and delivered', required: true, collected: true },
      { id: 'ev-3', type: 'cancel_policy', label: 'In-App Cancellation Policy', description: 'Documented self-serve cancellation flow', required: true, collected: true }
    ],
    createdAt: '2026-10-05T09:00:00Z',
    updatedAt: '2026-10-11T11:00:00Z'
  },
  {
    id: 'disp-cs-002',
    organizationId: 'org-cloudsync-saas',
    internalCaseId: 'DISP-SAAS-402',
    transactionRef: 'sub_ch_88b1726352',
    orderRef: 'INV-2026-4890',
    paymentProcessor: 'Stripe Billing',
    disputeReasonCode: '10.5',
    disputeReasonCategory: 'Fraudulent - Unauthorized Renewal',
    disputeAmount: 1188.00,
    currency: 'USD',
    transactionDate: '2026-10-01',
    disputeReceivedDate: '2026-10-10',
    submissionDeadline: '2026-10-25',
    customerName: 'Claire Dupont',
    customerEmail: 'claire@dupontmedia.com',
    refundStatus: 'none',
    status: 'new',
    priority: 'urgent',
    winStatus: 'pending',
    recoveredAmount: 0,
    notes: 'High dollar value enterprise team seat renewal disputed as unauthorized.',
    evidenceItems: [
      { id: 'ev-1', type: 'contract', label: 'Signed SaaS Master Service Agreement', description: 'DocuSign copy with explicit auto-renewal clause', required: true, collected: true }
    ],
    createdAt: '2026-10-10T15:20:00Z',
    updatedAt: '2026-10-10T15:20:00Z'
  }
];

export const INITIAL_DISPUTES_URBANBITES: Dispute[] = [
  {
    id: 'disp-ub-001',
    organizationId: 'org-urbanbites-food',
    internalCaseId: 'DISP-UB-901',
    transactionRef: 'upi_txn_988291038192',
    orderRef: 'UB-ORDER-48192',
    paymentProcessor: 'UPI QR (Merchant VPA)',
    disputeReasonCode: 'UPI-U1',
    disputeReasonCategory: 'Payment Debited but Order Not Delivered',
    disputeAmount: 1450.00,
    currency: 'INR',
    transactionDate: '2026-10-06',
    disputeReceivedDate: '2026-10-09',
    submissionDeadline: '2026-10-23',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.in',
    refundStatus: 'none',
    status: 'evidence_needed',
    priority: 'urgent',
    winStatus: 'pending',
    recoveredAmount: 0,
    assignedToName: 'Rohan Verma',
    notes: 'Customer scanned counter QR for 4 gourmet burgers & shakes. Claimed order was never handed over. Kitchen POS timestamped bill and OTP pickup log matches delivery partner timestamp.',
    evidenceItems: [
      { id: 'ev-ub-1', type: 'upi_utr', label: 'Bank NPCI UTR & Settlement Confirmation', description: 'Bank UTR reference 42910381920 matching merchant treasury payout account', required: true, collected: true },
      { id: 'ev-ub-2', type: 'pos_ticket', label: 'Kitchen KOT & Order Delivery Receipt', description: 'Itemized KOT bill marked delivered with OTP verification', required: true, collected: true }
    ],
    createdAt: '2026-10-09T08:00:00Z',
    updatedAt: '2026-10-11T12:00:00Z'
  },
  {
    id: 'disp-ub-002',
    organizationId: 'org-urbanbites-food',
    internalCaseId: 'DISP-UB-902',
    transactionRef: 'upi_txn_883719204918',
    orderRef: 'UB-ORDER-48250',
    paymentProcessor: 'UPI Instant Payout',
    disputeReasonCode: 'UPI-U3',
    disputeReasonCategory: 'Duplicate Debit at POS Counter',
    disputeAmount: 890.00,
    currency: 'INR',
    transactionDate: '2026-10-07',
    disputeReceivedDate: '2026-10-10',
    submissionDeadline: '2026-10-24',
    customerName: 'Priya Sundaram',
    customerEmail: 'priya.s@example.in',
    refundStatus: 'full',
    status: 'closed',
    priority: 'low',
    winStatus: 'won',
    recoveredAmount: 890.00,
    notes: 'Duplicate debit was automatically resolved by NPCI switch within 24 hours. Bank credit note provided to customer.',
    evidenceItems: [
      { id: 'ev-ub-3', type: 'refund_note', label: 'NPCI Auto-Reversal Memo', description: 'Official switch credit reversal record', required: true, collected: true }
    ],
    createdAt: '2026-10-10T11:00:00Z',
    updatedAt: '2026-10-12T14:00:00Z'
  }
];

export const INITIAL_DISPUTES_GADGETHUB: Dispute[] = [
  {
    id: 'disp-gh-001',
    organizationId: 'org-gadgethub-tech',
    internalCaseId: 'DISP-GH-201',
    transactionRef: 'ch_3N99tech82910',
    orderRef: 'GH-ORDER-77192',
    paymentProcessor: 'Stripe Card',
    disputeReasonCode: '10.4',
    disputeReasonCategory: 'Fraudulent - Card Absent',
    disputeAmount: 899.00,
    currency: 'USD',
    transactionDate: '2026-09-28',
    disputeReceivedDate: '2026-10-05',
    submissionDeadline: '2026-10-19',
    customerName: 'Ethan Cole',
    customerEmail: 'ethan.cole@example.com',
    trackingNumber: '1Z6666666666666666',
    carrier: 'UPS 2nd Day Air',
    deliveryDate: '2026-10-01',
    refundStatus: 'none',
    status: 'ready_for_submission',
    priority: 'urgent',
    winStatus: 'pending',
    recoveredAmount: 0,
    assignedToName: 'Alex Chen',
    notes: 'High-value gaming GPU dispute. Delivery address verified, customer signature obtained, and device IMEI/serial number registered to buyer account.',
    evidenceItems: [
      { id: 'ev-gh-1', type: 'serial_log', label: 'Hardware Serial & IMEI Registry', description: 'Factory serial scan matching package invoice', required: true, collected: true },
      { id: 'ev-gh-2', type: 'signature', label: 'Direct Signature Required Proof', description: 'UPS driver signature certificate with photo', required: true, collected: true },
      { id: 'ev-gh-3', type: 'ip_device', label: '3DS 2.0 Auth Fingerprint', description: 'Full EMV 3DSecure cryptographic payload', required: true, collected: true }
    ],
    createdAt: '2026-10-05T14:00:00Z',
    updatedAt: '2026-10-11T16:30:00Z'
  }
];

export const INITIAL_DISPUTES_LUXEWEAR: Dispute[] = [
  {
    id: 'disp-lx-001',
    organizationId: 'org-luxewear-global',
    internalCaseId: 'DISP-LX-101',
    transactionRef: 'ch_3N88luxe99281',
    orderRef: 'LX-COUTURE-391',
    paymentProcessor: 'Adyen / Stripe',
    disputeReasonCode: '13.3',
    disputeReasonCategory: 'Not As Described (Counterfeit Claim)',
    disputeAmount: 1450.00,
    currency: 'EUR',
    transactionDate: '2026-09-22',
    disputeReceivedDate: '2026-10-04',
    submissionDeadline: '2026-10-18',
    customerName: 'Camille Laurent',
    customerEmail: 'c.laurent@example.fr',
    trackingNumber: 'DHL-EXPRESS-88910293',
    carrier: 'DHL Express',
    deliveryDate: '2026-09-25',
    refundStatus: 'none',
    status: 'submitted',
    priority: 'urgent',
    winStatus: 'pending',
    recoveredAmount: 0,
    assignedToName: 'Sarah Jenkins',
    notes: 'Buyer claimed cashmere coat was unauthentic. Certificate of Authenticity, Italian manufacturer invoice, and authorized dealership license submitted to card scheme.',
    evidenceItems: [
      { id: 'ev-lx-1', type: 'cert_auth', label: 'Certificate of Brand Authenticity', description: 'Serialized hologram certificate signed by brand atelier', required: true, collected: true },
      { id: 'ev-lx-2', type: 'dealer_license', label: 'Authorized Dealer Distribution License', description: 'Official luxury distributor certification', required: true, collected: true }
    ],
    createdAt: '2026-10-04T10:00:00Z',
    updatedAt: '2026-10-12T13:00:00Z'
  }
];

export const INITIAL_DISPUTES_ZENFITNESS: Dispute[] = [
  {
    id: 'disp-zf-001',
    organizationId: 'org-zenfitness-sub',
    internalCaseId: 'DISP-ZF-055',
    transactionRef: 'sub_zf_11928472',
    orderRef: 'ZF-ANNUAL-VIP',
    paymentProcessor: 'Stripe Billing',
    disputeReasonCode: '13.7',
    disputeReasonCategory: 'Cancelled Recurring Membership',
    disputeAmount: 199.00,
    currency: 'USD',
    transactionDate: '2026-09-26',
    disputeReceivedDate: '2026-10-07',
    submissionDeadline: '2026-10-21',
    customerName: 'Jessica Morales',
    customerEmail: 'jess.morales@example.com',
    refundStatus: 'none',
    status: 'evidence_needed',
    priority: 'medium',
    winStatus: 'pending',
    recoveredAmount: 0,
    assignedToName: 'Sarah Jenkins',
    notes: 'Member disputes annual meditation subscription renewal. Mobile app logs show user completed 14 guided meditation sessions after the renewal date.',
    evidenceItems: [
      { id: 'ev-zf-1', type: 'mobile_session', label: 'Mobile App Streaming Logs', description: 'Device session telemetry and workout completions post-renewal', required: true, collected: true },
      { id: 'ev-zf-2', type: 'email_receipt', label: 'Pre-Billing Renewal Notification', description: 'Mandatory 7-day advance billing reminder email log', required: true, collected: true }
    ],
    createdAt: '2026-10-07T09:30:00Z',
    updatedAt: '2026-10-10T15:00:00Z'
  }
];

export interface MultiMerchantChecklistItem {
  id: string;
  category: 'Multi-Tenant & Security' | 'Multi-Store Settlement & UPI' | 'Network Compliance & VROL' | 'AI Rebuttals & Evidence' | 'Developer Platform & Operations';
  title: string;
  description: string;
  status: 'active' | 'verified' | 'production_ready';
  technicalDetails: string;
  badge: string;
}

export const MULTI_MERCHANT_50_CHECKLIST: MultiMerchantChecklistItem[] = [
  // Multi-Tenant & Security (1-10)
  {
    id: 'mm-01',
    category: 'Multi-Tenant & Security',
    title: 'Isolated Multi-Tenant Database Partitioning',
    description: 'Each merchant store has strictly segregated dispute cases, customer PII, and financial ledgers.',
    status: 'production_ready',
    technicalDetails: 'Firestore security rules enforce request.auth.uid org membership & query constraints on organizationId.',
    badge: 'Security'
  },
  {
    id: 'mm-02',
    category: 'Multi-Tenant & Security',
    title: 'Role-Based Access Control (RBAC) Per Store',
    description: 'Granular permissions (Owner, Admin, Analyst, Auditor) isolated per merchant profile.',
    status: 'verified',
    technicalDetails: 'UserRole claims verified per organization; viewers cannot mutate evidence or submit rebuttals.',
    badge: 'RBAC'
  },
  {
    id: 'mm-03',
    category: 'Multi-Tenant & Security',
    title: 'KYC & Merchant Verification Tiers',
    description: 'Automated Tier 1 (Basic), Tier 2 (Verified), and Tier 3 (Enterprise High-Volume) credentialing.',
    status: 'production_ready',
    technicalDetails: 'Validates business registration, GSTIN / EIN, director identity, and bank routing before scaling limits.',
    badge: 'KYC'
  },
  {
    id: 'mm-04',
    category: 'Multi-Tenant & Security',
    title: 'Tamper-Evident Merchant Audit Trail',
    description: 'Immutable timestamped logs of every dispute view, evidence file upload, and merchant switch.',
    status: 'verified',
    technicalDetails: 'auditLogs collection records actor, IP, timestamp, resource ID, and delta changes.',
    badge: 'Compliance'
  },
  {
    id: 'mm-05',
    category: 'Multi-Tenant & Security',
    title: 'Client-Side Tokenization & Zero-PCI Leakage',
    description: 'Never transmits raw credit card numbers or banking secrets through server application code.',
    status: 'production_ready',
    technicalDetails: 'Stripe Elements and UPI VPA tokens isolate sensitive payment rails away from applet storage.',
    badge: 'PCI-DSS'
  },
  {
    id: 'mm-06',
    category: 'Multi-Tenant & Security',
    title: 'Granular Store-Level Session Expiration',
    description: 'Automatic session timeout and re-authentication for high-security merchant actions.',
    status: 'verified',
    technicalDetails: 'Firebase Auth token refreshes every 60m with forced session revocation on credential change.',
    badge: 'Auth'
  },
  {
    id: 'mm-07',
    category: 'Multi-Tenant & Security',
    title: 'Customer PII Masking & Redaction',
    description: 'Masks cardholder emails, telephone numbers, and billing addresses in public views.',
    status: 'production_ready',
    technicalDetails: 'Automatic regex-based redaction on credit card numbers (PAN) and email obfuscation.',
    badge: 'Privacy'
  },
  {
    id: 'mm-08',
    category: 'Multi-Tenant & Security',
    title: 'Multi-Store Cross-Contamination Guard',
    description: 'Prevents store A dispute managers from querying or injecting store B evidence documents.',
    status: 'verified',
    technicalDetails: 'Multi-tenant dispute map enforces explicit orgId matching on all reads and writes.',
    badge: 'Isolation'
  },
  {
    id: 'mm-09',
    category: 'Multi-Tenant & Security',
    title: 'Automated Account Lockout & Fraud Protection',
    description: 'Protects merchant portal against brute-force login attempts and credential stuffing.',
    status: 'production_ready',
    technicalDetails: 'Firebase rate-limiting rules and client attempt trackers enforce backoff delays.',
    badge: 'Protection'
  },
  {
    id: 'mm-10',
    category: 'Multi-Tenant & Security',
    title: 'GDPR & CCPA Right-to-be-Forgotten Execution',
    description: 'Single-click data scrub for cardholder records across all merchant stores upon request.',
    status: 'verified',
    technicalDetails: 'Soft-delete and cryptographic shredding of customer PII in compliance with Article 17 GDPR.',
    badge: 'GDPR'
  },

  // Multi-Store Settlement & UPI (11-20)
  {
    id: 'mm-11',
    category: 'Multi-Store Settlement & UPI',
    title: 'Direct Instant UPI & Bank Clearing to Merchant VPA',
    description: 'Native instant settlement to primary designated corporate settlement account with zero intermediary holds.',
    status: 'production_ready',
    technicalDetails: 'Real-time NPCI UPI protocol routing, deep-link creation (upi://pay), and automated UTR verification.',
    badge: 'UPI'
  },
  {
    id: 'mm-12',
    category: 'Multi-Store Settlement & UPI',
    title: 'Custom Printable Counter Standees Per Merchant',
    description: 'Dynamic PDF/SVG counter standee generator for retail checkout with store name and QR code.',
    status: 'production_ready',
    technicalDetails: 'QRCode SVG rendering with high error correction (Level H), merchant wordmark, and FamX badge.',
    badge: 'Retail POS'
  },
  {
    id: 'mm-13',
    category: 'Multi-Store Settlement & UPI',
    title: 'Automated Split Settlement Calculation',
    description: 'Real-time fee split: 98% direct to merchant payout account, 2% rolling dispute reserve.',
    status: 'verified',
    technicalDetails: 'Programmable split logic calculating gross, processor interchange, platform fee, and net settlement.',
    badge: 'Split Engine'
  },
  {
    id: 'mm-14',
    category: 'Multi-Store Settlement & UPI',
    title: 'Multi-Currency Conversion Engine (USD / INR / EUR)',
    description: 'Live dual-currency displays with real-time exchange rates (1 USD = ₹83.50, 1 EUR = $1.08).',
    status: 'production_ready',
    technicalDetails: 'Currency formatter with localized symbol placement, ISO 4217 validation, and zero rounding drift.',
    badge: 'FX Rates'
  },
  {
    id: 'mm-15',
    category: 'Multi-Store Settlement & UPI',
    title: 'Automated Bank UTR Reconciliation',
    description: 'Matches 12-digit bank UTR numbers against settled invoices with instant status confirmation.',
    status: 'verified',
    technicalDetails: 'Regex validation on 12-digit alphanumeric UTR; verifies settlement ledger against bank feed.',
    badge: 'Recon'
  },
  {
    id: 'mm-16',
    category: 'Multi-Store Settlement & UPI',
    title: 'Multi-Merchant Payout Ledger CSV Export',
    description: 'One-click download of full settlement breakdown with gross, deductions, UTR, and timestamp.',
    status: 'production_ready',
    technicalDetails: 'Client-side UTF-8 CSV generator with sanitized headers and RFC 4180 escaping.',
    badge: 'Accounting'
  },
  {
    id: 'mm-17',
    category: 'Multi-Store Settlement & UPI',
    title: 'Settlement Cadence Selector (Instant, T+1, Weekly)',
    description: 'Configurable payout frequency per merchant profile based on sales velocity and risk tier.',
    status: 'verified',
    technicalDetails: 'Stores merchant payout cadence; automatically adjusts rolling reserve hold dates.',
    badge: 'Treasury'
  },
  {
    id: 'mm-18',
    category: 'Multi-Store Settlement & UPI',
    title: 'Multi-Gateway Aggregation (Stripe, Shopify, PayPal, UPI)',
    description: 'Unified financial reconciliation combining cards, digital wallets, and UPI payments in one dashboard.',
    status: 'production_ready',
    technicalDetails: 'Normalizes diverse gateway payloads into unified Dispute and Settlement data structures.',
    badge: 'Aggregator'
  },
  {
    id: 'mm-19',
    category: 'Multi-Store Settlement & UPI',
    title: 'Instant Cash-Out Payout Trigger Simulator',
    description: 'Allows merchants to trigger manual payouts of cleared dispute funds with instant visual feedback.',
    status: 'verified',
    technicalDetails: 'Generates mock IMPS/NEFT/UPI transfer receipt with real simulated transaction IDs.',
    badge: 'Payout'
  },
  {
    id: 'mm-20',
    category: 'Multi-Store Settlement & UPI',
    title: 'Tax Invoice & GSTIN Compliance Invoices',
    description: 'Auto-generates compliant GST/VAT tax invoices for SaaS subscription fees and platform commission.',
    status: 'production_ready',
    technicalDetails: 'Produces itemized invoice summaries with HSN/SAC codes, reverse charge indicator, and tax breakdown.',
    badge: 'Tax'
  },

  // Network Compliance & VROL (21-30)
  {
    id: 'mm-21',
    category: 'Network Compliance & VROL',
    title: 'Visa Resolve Online (VROL) Direct Schema Compliance',
    description: 'Pre-formats evidence according to Visa 2026 Core Rules and Dispute Management regulations.',
    status: 'production_ready',
    technicalDetails: 'Adheres to Visa Compelling Evidence 3.0 (CE3.0) requirements with qualified prior transactions.',
    badge: 'Visa VROL'
  },
  {
    id: 'mm-22',
    category: 'Network Compliance & VROL',
    title: 'Mastercard MasterCom Collaboration Framework',
    description: 'Supports Mastercard dispute lifecycle, pre-arbitration stages, and First Presentment appeals.',
    status: 'verified',
    technicalDetails: 'Formats claims under Mastercard reason codes (4837, 4853, 4834) with required exhibits.',
    badge: 'Mastercard'
  },
  {
    id: 'mm-23',
    category: 'Network Compliance & VROL',
    title: 'Dispute-to-Sales Ratio Threshold Radar (0.90% Limit)',
    description: 'Real-time alert monitoring to keep merchant chargeback ratios safely below Visa 0.90% threshold.',
    status: 'production_ready',
    technicalDetails: 'Calculates active chargeback ratio vs rolling monthly sales; triggers early warnings at 0.65%.',
    badge: 'Radar'
  },
  {
    id: 'mm-24',
    category: 'Network Compliance & VROL',
    title: 'Pre-Dispute Deflection & CDRN (Ethoca / Verifi)',
    description: 'Simulates rapid alerts from issuing banks allowing immediate refund before chargeback filing.',
    status: 'verified',
    technicalDetails: 'Deflection simulator allows 24-hour pre-chargeback refund to protect merchant dispute ratio.',
    badge: 'Deflection'
  },
  {
    id: 'mm-25',
    category: 'Network Compliance & VROL',
    title: 'Compelling Evidence 3.0 (CE3.0) Engine',
    description: 'Automatically matches 2 previous undisputed transactions with identical IP or device fingerprint.',
    status: 'production_ready',
    technicalDetails: 'Validates 120-day transaction history to qualify for mandatory Visa fraud liability reversal.',
    badge: 'CE3.0'
  },
  {
    id: 'mm-26',
    category: 'Network Compliance & VROL',
    title: 'Amex & Discover Dispute Resolution Templates',
    description: 'Specialized response letters for American Express Inquiry/Chargeback and Discover dispute workflows.',
    status: 'verified',
    technicalDetails: 'Tailored rebuttal templates formatted to Amex Dispute Manager guidelines.',
    badge: 'Amex'
  },
  {
    id: 'mm-27',
    category: 'Network Compliance & VROL',
    title: 'Submission Deadline Countdown & Breach Alarms',
    description: 'Visual urgent badges and deadline timers preventing forfeiture due to lapsed 7/14/21-day limits.',
    status: 'production_ready',
    technicalDetails: 'Calculates remaining hours until processor lock; sorts high-priority cases to top of queue.',
    badge: 'Deadline'
  },
  {
    id: 'mm-28',
    category: 'Network Compliance & VROL',
    title: 'Card Scheme Fine & Fee Mitigation Calculator',
    description: 'Calculates potential $15-$50 chargeback fees saved by winning disputes and deflecting claims.',
    status: 'verified',
    technicalDetails: 'Dynamic savings tally tracking platform ROI across all active merchant stores.',
    badge: 'Savings'
  },
  {
    id: 'mm-29',
    category: 'Network Compliance & VROL',
    title: 'Reason Code Translation & Plain-English Explainers',
    description: 'Translates arcane numeric codes (e.g. 10.4, 13.1, 4837) into clear merchant action checklists.',
    status: 'production_ready',
    technicalDetails: 'Comprehensive encyclopedia of 40+ Visa, Mastercard, and UPI dispute reason codes.',
    badge: 'Glossary'
  },
  {
    id: 'mm-30',
    category: 'Network Compliance & VROL',
    title: 'Pre-Arbitration & Formal Appeal Dossier Builder',
    description: 'Packages second-stage appeal documentation when initial representment is unfairly rejected.',
    status: 'verified',
    technicalDetails: 'Structures escalation letters citing card network operating regulations and arbitration precedents.',
    badge: 'Appeal'
  },

  // AI Rebuttals & Evidence (31-40)
  {
    id: 'mm-31',
    category: 'AI Rebuttals & Evidence',
    title: 'Store-Specific AI Rebuttal Customization',
    description: 'AI generator adapts tone and legal citations to match merchant category (SaaS vs Luxury vs Food).',
    status: 'production_ready',
    technicalDetails: 'Dynamic system prompts inject store policies, terms of service, and refund terms into rebuttal.',
    badge: 'AI Engine'
  },
  {
    id: 'mm-32',
    category: 'AI Rebuttals & Evidence',
    title: 'Automated Carrier Tracking & Proof-of-Delivery Sync',
    description: 'Integrates tracking numbers (UPS, FedEx, DHL, USPS) to automatically pull delivery signature scans.',
    status: 'verified',
    technicalDetails: 'Simulates carrier API webhook verification with GPS coordinates and delivery timestamp.',
    badge: 'Tracking'
  },
  {
    id: 'mm-33',
    category: 'AI Rebuttals & Evidence',
    title: 'One-Click Dispute Evidence Pack PDF Generator',
    description: 'Compiles order invoices, delivery receipts, customer emails, and AI letter into a sealed PDF bundle.',
    status: 'production_ready',
    technicalDetails: 'Browser print-to-PDF formatting with high-contrast print stylesheet and table of exhibits.',
    badge: 'Evidence PDF'
  },
  {
    id: 'mm-34',
    category: 'AI Rebuttals & Evidence',
    title: 'AVS & CVV Authorization Security Score Validator',
    description: 'Parses processor authorization payloads to prove cardholder identity at transaction initiation.',
    status: 'verified',
    technicalDetails: 'Checks AVS street/ZIP matches (Codes Y, Z, D) and CVV2 match (Code M) for automated defense.',
    badge: 'AVS/CVV'
  },
  {
    id: 'mm-35',
    category: 'AI Rebuttals & Evidence',
    title: 'Digital Goods & SaaS Telemetry Evidence Pack',
    description: 'Compiles IP access logs, API key calls, and login session history to defeat "cancelled" claims.',
    status: 'production_ready',
    technicalDetails: 'Generates structured audit logs showing ongoing cardholder utilization past billing date.',
    badge: 'Telemetry'
  },
  {
    id: 'mm-36',
    category: 'AI Rebuttals & Evidence',
    title: 'Confidence Score & Win-Probability Forecaster',
    description: 'Calculates empirical win probability (0-100%) before merchant spends time fighting dispute.',
    status: 'verified',
    technicalDetails: 'Multi-factor model evaluating reason code, evidence completeness, amount, and processor history.',
    badge: 'Predictive'
  },
  {
    id: 'mm-37',
    category: 'AI Rebuttals & Evidence',
    title: 'Batch Evidence Collector & Multi-Case Processor',
    description: 'Upload hundreds of dispute CSV rows and auto-attach evidence files in unified workflow.',
    status: 'production_ready',
    technicalDetails: 'Streams large CSV files, validates schemas, skips duplicates, and mounts cases in state.',
    badge: 'Batch'
  },
  {
    id: 'mm-38',
    category: 'AI Rebuttals & Evidence',
    title: 'Customer Communication & Chat Transcript OCR',
    description: 'Formats support tickets, email replies, and live chat logs into timestamped rebuttal exhibits.',
    status: 'verified',
    technicalDetails: 'Sanitizes and chronologically orders pre-dispute customer conversations.',
    badge: 'Comms'
  },
  {
    id: 'mm-39',
    category: 'AI Rebuttals & Evidence',
    title: 'Instant Copy-to-Clipboard Processor Format',
    description: 'Pre-formats text with character counter strictly respecting Stripe/PayPal 10,000-character limit.',
    status: 'production_ready',
    technicalDetails: 'One-click copy with toast notification and real-time character limit enforcement.',
    badge: 'Copy'
  },
  {
    id: 'mm-40',
    category: 'AI Rebuttals & Evidence',
    title: 'Recovered Funds Tally & Real-Time Win Tracker',
    description: 'Tracks total dollars and rupees saved by won disputes with historical recovery trends.',
    status: 'verified',
    technicalDetails: 'Live aggregation of recovered amounts across all active merchant workspaces.',
    badge: 'ROI Tracker'
  },

  // Developer Platform & Operations (41-50)
  {
    id: 'mm-41',
    category: 'Developer Platform & Operations',
    title: 'Per-Merchant API Keys (Live & Test Sandboxes)',
    description: 'Each store gets distinct secret and publishable keys for secure programmatic API integration.',
    status: 'production_ready',
    technicalDetails: 'Supports Bearer sk_live_... tokens with key rollover and instant revoking.',
    badge: 'API Keys'
  },
  {
    id: 'mm-42',
    category: 'Developer Platform & Operations',
    title: 'Real-Time Webhook Dispatch Simulator',
    description: 'Test dispute webhooks (dispute.created, dispute.won, payout.settled) with live JSON payloads.',
    status: 'production_ready',
    technicalDetails: 'Includes interactive payload editor, HTTP POST trigger, and status response inspect view.',
    badge: 'Webhooks'
  },
  {
    id: 'mm-43',
    category: 'Developer Platform & Operations',
    title: 'Multi-Store Financial Performance Benchmarks',
    description: 'Compare dispute rates, win rates, and GMV across all managed stores in unified matrix.',
    status: 'verified',
    technicalDetails: 'Cross-organization metrics computation with normalized performance index.',
    badge: 'Analytics'
  },
  {
    id: 'mm-44',
    category: 'Developer Platform & Operations',
    title: 'Progressive Web App (PWA) Offline & Mobile Support',
    description: 'Installable on mobile counter phones and tablets with service worker offline caching.',
    status: 'production_ready',
    technicalDetails: 'Full manifest.json, service worker cache, and custom install prompt for iOS/Android.',
    badge: 'PWA'
  },
  {
    id: 'mm-45',
    category: 'Developer Platform & Operations',
    title: 'Cross-Store Global Quick Search (Ctrl/Cmd + K)',
    description: 'Instant search across cases, order IDs, customer names, and merchant stores with keyboard shortcuts.',
    status: 'verified',
    technicalDetails: 'Debounced multi-attribute search indexing transactions, customers, and notes.',
    badge: 'Quick Search'
  },
  {
    id: 'mm-46',
    category: 'Developer Platform & Operations',
    title: 'Real-Time In-App Notification Center',
    description: 'Live alerts for urgent deadlines, new disputes, settlement transfers, and AI analyses.',
    status: 'production_ready',
    technicalDetails: 'Unread counter badge, mark-all-read action, and direct navigation links.',
    badge: 'Alerts'
  },
  {
    id: 'mm-47',
    category: 'Developer Platform & Operations',
    title: 'WCAG 2.1 AA Accessibility & Contrast Compliance',
    description: 'Designed for accessibility with high-contrast ratios, focus rings, and screen-reader labels.',
    status: 'verified',
    technicalDetails: 'Strict Tailwind color palettes exceeding 4.5:1 text-to-background contrast minimums.',
    badge: 'A11y'
  },
  {
    id: 'mm-48',
    category: 'Developer Platform & Operations',
    title: 'Automated 10-Point Security Test Suite View',
    description: 'Built-in automated test runner verifying RBAC, XSS escaping, quota enforcement, and isolation.',
    status: 'production_ready',
    technicalDetails: 'SecurityTestsView runs 10 live assertion checks with real-time green checkmark reporting.',
    badge: 'Test Suite'
  },
  {
    id: 'mm-49',
    category: 'Developer Platform & Operations',
    title: 'GDPR / CCPA Cookie Consent & Privacy Manager',
    description: 'Granular cookie controls (Necessary, Analytics, Marketing) with local persistent storage.',
    status: 'verified',
    technicalDetails: 'Zero tracking cookies loaded prior to affirmative user consent.',
    badge: 'Consent'
  },
  {
    id: 'mm-50',
    category: 'Developer Platform & Operations',
    title: 'End-Model Production Readiness Scorecard (100% Certified)',
    description: 'Full commercial readiness verification certifying live payment links, multi-merchant engine, and UPI.',
    status: 'production_ready',
    technicalDetails: 'Interactive modal inspecting all 50 multi-merchant production criteria with direct test triggers.',
    badge: 'Production 100%'
  }
];

export const CSV_SAMPLE_TEXT = `Internal Case ID,Order Ref,Transaction Ref,Processor,Reason Code,Reason Category,Amount,Currency,Transaction Date,Received Date,Deadline,Customer Name,Customer Email,Tracking,Carrier,Refund Status,Priority
DISP-2026-1090,ORD-90112,ch_3N99aa12345,Stripe,13.1,Merchandise Not Received,215.00,USD,2026-09-20,2026-10-04,2026-10-18,James Hall,james.hall@example.com,1Z9992910293019283,UPS Ground,none,urgent
DISP-2026-1091,ORD-90220,ch_3N99bb54321,Shopify Payments,10.4,Fraudulent,149.00,USD,2026-09-25,2026-10-06,2026-10-20,Lisa Wong,lisa.w@example.com,94001118992231920000,USPS Priority,none,high
DISP-2026-1092,ORD-90345,ch_3N99cc98765,PayPal,13.3,Not As Described,380.00,USD,2026-09-28,2026-10-07,2026-10-21,Robert Taylor,rtaylor@example.com,FEDEX-992102938192,FedEx 2Day,none,medium
DISP-2026-1093,ORD-90410,ch_3N99dd11223,Stripe,13.7,Cancelled Recurring,79.00,USD,2026-10-01,2026-10-09,2026-10-23,Emily Davis,emily.d@example.com,,,none,medium
DISP-2026-1094,ORD-90550,ch_3N99ee44556,Shopify Payments,13.6,Credit Not Processed,199.50,USD,2026-09-15,2026-10-02,2026-10-16,Daniel Smith,dsmith@example.com,1Z7772910293019111,UPS Ground,none,urgent`;

