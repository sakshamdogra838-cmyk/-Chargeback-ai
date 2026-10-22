# Chargeback AI — B2B Payment Dispute & Revenue Recovery SaaS

> **Core Value Proposition**: "Recover more revenue. Resolve disputes intelligently. Turn chargeback data into actionable decisions."

Chargeback AI is a full-stack, multi-tenant B2B SaaS platform that enables online merchants, ecommerce brands (Shopify, WooCommerce), and recurring SaaS businesses to manage payment disputes, identify potentially recoverable funds, organize reason-specific evidence, prepare formal dispute responses using Google Gemini AI, and track recovery performance over time.

---

## 1. Architecture Overview

```
                      ┌───────────────────────────────────────────────┐
                      │             React 19 Frontend (SPA)           │
                      │  - Tailwind CSS v4, Lucide Icons              │
                      │  - Multi-Tenant Workspace Selector            │
                      │  - CSV Drag-and-Drop Ingestion (PapaParse)   │
                      │  - Financial Operations KPIs & Charts         │
                      └──────────────────────┬────────────────────────┘
                                             │
                                   HTTP / REST API
                                             │
                      ┌──────────────────────▼────────────────────────┐
                      │          Express Full-Stack Server            │
                      │  - Multi-Tenant RBAC Authorization            │
                      │  - Gemini 3.8 Flash SDK (@google/genai)       │
                      │  - Server-Authoritative Stripe Billing       │
                      │  - Signed Webhook Verification & Deduplication│
                      │  - CSV Formula Injection Sanitization         │
                      │  - Automated Cross-Tenant Security Suite      │
                      └──────┬──────────────────┬──────────────┬──────┘
                             │                  │              │
                ┌────────────▼─────┐   ┌────────▼─────────┐   ┌▼────────────────────┐
                │ Cloud Firestore  │   │   Gemini 3.8     │   │  Payment Provider   │
                │ Provisioned DB   │   │ Flash AI Engine  │   │  Stripe / Webhooks  │
                │ Security Rules   │   │ (Server secrets) │   │  Entitlement Checks │
                └──────────────────┘   └──────────────────┘   └─────────────────────┘
```

### Multi-Tenant Isolation Model
- **Organizations (Tenants)**: Completely isolated workspaces (`Apex Direct DTC`, `CloudSync Software`, and custom merchant workspaces).
- **Users**: Individuals who belong to one or more organizations.
- **RBAC Roles**: `owner`, `admin`, `analyst`, and `viewer` with server-enforced permission barriers.
- **Data Scoping**: Every database document contains an authoritative `organizationId`. Security rules and server endpoints verify caller membership before allowing reads, updates, or deletes.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, PapaParse.
- **Backend**: Node.js, Express, `tsx`, Vite Middleware.
- **Database & Auth**: Google Cloud Firestore Enterprise, Firebase Authentication (Google OAuth & Email).
- **AI Engine**: Google Gen AI SDK (`@google/genai`), Model `gemini-3.8-flash`.
- **Payment & Subscriptions**: Stripe Billing Adapter + Test-Mode Webhook Lifecycle Simulator.

---

## 3. Environment Variables

Template configuration (defined in `.env.example`):

```bash
# GEMINI_API_KEY: Automatically injected at runtime in AI Studio from Secrets panel.
GEMINI_API_KEY=""

# APP_URL: Base URL where this applet is hosted.
APP_URL=""

# PAYMENT PROVIDER: "stripe" or test simulation mode
PAYMENT_PROVIDER="stripe"

# STRIPE CREDENTIALS (Server-side only)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# TEST MODE: Set to "true" to allow simulated checkouts and mock webhook triggers
PAYMENT_TEST_MODE="true"

# PLATFORM ADMIN ACCESS: Comma-separated list of super admin emails
PLATFORM_ADMIN_EMAILS="sakshamdogra838@gmail.com"
```

---

## 4. Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run dev server (Express backend + Vite React SPA)
npm run dev

# App runs at: http://localhost:3000
```

---

## 5. Security & Privacy Safeguards

1. **Formula Injection Sanitization**: All exported CSV rows are sanitized so values starting with `=`, `+`, `-`, `@`, `\t`, or `\r` are prepended with `'` to prevent DDE code execution in Microsoft Excel and Google Sheets.
2. **Server-Side Secret Storage**: The `GEMINI_API_KEY` and `STRIPE_SECRET_KEY` are only ever accessed on the server. They are never bundled or exposed to client-side code.
3. **PII Redaction**: Credit card numbers (16-digit PANs) and 3-4 digit CVVs are automatically redacted from case notes before prompt transmission to the Gemini API.
4. **No Training on Customer Data**: Private dispute logs are not used to train foundation models.
5. **Immutable Audit Trail**: Append-only security log records user identities, actions, affected resources, and timestamps.
6. **Last Owner Guard**: An organization's last remaining owner cannot be removed or deleted.

---

## 6. Automated Security Suite

Run the built-in automated security test suite by navigating to **Automated Security Tests** in the navigation bar or sending:

```bash
POST /api/tests/run-security-suite
```

Assertions evaluated:
- Authentication Check Enforcement
- Multi-Tenant Boundary Isolation (Org A vs Org B access denied)
- Formula Injection Prevention (CSV sanitization)
- Webhook Idempotency & Deduplication
- Forged Checkout Parameter Immunity
- PII Redaction Prior to AI Processing

---

## 7. Production Readiness Checklist

- [x] Cloud Firestore provisioned and connected
- [x] Firestore security rules deployed with default deny
- [x] Multi-tenant organization switching and data partitioning
- [x] Universal CSV drag-and-drop import with column mapping
- [x] Gemini 3.8 Flash server integration for dispute reasoning and rebuttal generation
- [x] Reason-specific evidence checklists (Visa Compelling Evidence 3.0)
- [x] Server-authoritative subscription tiers (Free, Starter, Growth, Enterprise)
- [x] Signed webhook receiver with event deduplication
- [x] Sanitized CSV export endpoint
- [x] GDPR data export and cascading organization purge
- [x] Automated security test suite verifying tenant isolation
